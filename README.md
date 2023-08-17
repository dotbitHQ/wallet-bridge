# wallet-bridge

`wallet-bridge` 是一个多链、多登录方式的 Web3 钱包连接库，支持如下链和登录方式：

- **链**: Ethereum、BNB Smart Chain、Polygon 、TRON、Dogecoin
- **登录方式**: Passkey、Torus

该库主要提供连接钱包、发送交易、签名消息的功能，并允许用户获取钱包的当前状态。

### Main Scripts

- `dev`: Bootstrap the Storybook preview with Hot Reload.
- `build`: Builds the static storybook project.
- `build:lib`: Builds the component library into the **dist** folder.
- `lint:fix`: Applies linting based on the rules defined in **.eslintrc.js**.
- `format:prettier`: Formats files using the prettier rules defined in **.prettierrc**.
- `test`: Runs testing using watch mode.
- `test:cov`: Runs testing displaying a coverage report.

## Using the library

### 1.Install:

```bash
yarn add wallet-bridge
```

### 2.To import the styles the library needs:

```js
import 'wallet-bridge/dist/style.css'
```

### 3.To import Wallet:

```js
import { Wallet } from 'wallet-bridge'
```

> **注意**: `wallet-bridge` 不支持 SSR。如果你的项目使用了 SSR，确保在使用 `wallet-bridge` 之前检测是否处于浏览器环境。虽然此库基于 react.js 开发，但可在任何前端项目中使用。

若需要按需导入 `Wallet`，可以使用 `import()` 方法：

```js
const { Wallet } = await import('wallet-bridge')
```

### 4.初始化

要创建一个新的 `Wallet` 对象，你可以使用其构造函数：

```js
const wallet = new Wallet({
  isTestNet: false,
  loggedInSelectAddress: true,
})
```

**参数**:

- `isTestNet` (可选): 类型为`boolean`。是否使用测试网络，默认为 `false`。
- `loggedInSelectAddress` (可选): 类型为`boolean`。是否在 Passkey 登录时，有多个地址的情况下选择地址，默认为 `true`。

### 5. Wallet 实例方法：

以下列出了主要的实例方法：

### 5.1 `initWallet({ involution = true }: { involution?: boolean } = {}): Promise<boolean>`

初始化钱包登录状态。可以在全局初始化，也可以在每次使用钱包前初始化，通过返回值来判断是否继续执行相关业务代码。`initWallet` 方法会检测钱包是否已经登录，如果已经登录，则不会再次弹窗要用户登录，如果未登录，可以通过 `involution` 参数来控制是否弹窗让用户重新登录。

**参数**:

- `involution` (可选): 类型为`boolean`。默认值为 `true`。未登录是否弹窗让用户重新登录。

**返回值**:

- `Promise<boolean>`: 表示钱包是否登录成功。如果登录成功，返回`true`；否则，返回`false`。

**示例**：

```js
wallet.initWallet().then((success) => {
  console.log('Wallet Initialization:', success ? 'Successful' : 'Failed')
})
```

#### 5.2 `connectWallet(params: { onlyEth?: boolean } = {})`

弹出连接钱包弹窗。

**参数**:

- `onlyEth` (可选): 类型为`boolean`。决定接钱包弹窗是否只显示 Ethereum 链。默认值为 `false`。

**示例**：

```js
wallet.connectWallet({ onlyEth: true })
```

### 5.3 `loggedInfo()`

弹出已登录弹窗。如果用户已经登录，弹窗将会展示出登录信息。

**示例**：

```js
wallet.loggedInfo()
```

### 5.4 `sendTransaction(data: ISendTrxParams): Promise<string | undefined>`

用来转账交易。

**参数**:

- `data`: 交易参数。
  - `to`: 交易的接收地址，类型为`string`。
  - `value`: 交易的金额，必须为代币最小单位，类型为`string`。
  - `data` (可选): 交易备注，类型为`string`。

**返回值**:

- `Promise<string | undefined>`: 在交易成功发送后，返回的是一个交易哈希。如果有任何错误或问题，可能会返回`undefined`或抛出错误。

**示例**：

```js
const transactionData = {
  to: '0x020881E3F5B7832E752d16FE2710eE855A6977Dc',
  value: '10000000000',
  data: 'a message',
}
wallet.sendTransaction(transactionData).then((txHash) => {
  console.log('Transaction Hash:', txHash)
})
```

### 5.5 `initSignContext(): Promise<InitSignContextRes>`

初始化签名上下文并返回签名方法。为了避免签名时弹窗被浏览器拦截，`initSignContext` 务必在点击事件所有异步操作之前调用。

**返回值**:

- `Promise<InitSignContextRes>`: 返回一个包含以下方法的对象:
  - `signTxList`: 函数，.bit 业务专用，用于签名交易列表。
  - `signData`: 函数，返回值是签名后的数据。
  - `onFailed`: 函数，其返回值是一个`DeviceAuthError`，有任何错误都需要调用 `onFailed` 通知弹窗显示错误。

示例：

```js
const { signTxList, signData, onFailed } = await wallet.initSignContext()
const res = await signTxList({})
const res = await signData('0x123')
const res = await signData({}, { isEIP712: true })
await onFailed()
```

### 5.6 `useWalletState(): { walletSnap: Snapshot<WalletState> }`

`useWalletState` 是一个 React hook，用于在组件中获取和监听钱包状态。

**返回值**:

- `walletSnap`: 对`walletState`的当前快照，它的类型为`WalletState`，其中包含以下字段：

  - `protocol`: 钱包的协议类型，类型为`WalletProtocol`。
  - `address`: 当前登录的钱包地址，类型为`string`。
  - `coinType`: 代币类型，类型为`CoinType`。
  - `hardwareWalletTipsShow`: 硬件钱包提示是否显示，类型为`boolean`。
  - `deviceData`: Passkey 登录时设备数据，类型为`IDeviceData`。
  - `ckbAddresses`: Passkey 登录时设备能够管理的 CKB 地址列表，类型为`string[]`。
  - `deviceList`: 备份设备列表，类型为`string[]`。
  - `isTestNet`: 是否为测试网，类型为`boolean`。
  - `loggedInSelectAddress`: 是否在 Passkey 登录时，有多个地址的情况下选择地址，默认为`true`。
  - `canAddDevice`: 是否可以添加备份设备，类型为`boolean`。
  - `iCloudPasskeySupport`: 当前环境是否支持将 passkey 存储在 iCloud 中，类型为`boolean`。

**示例**:

```js
function Component() {
  const { walletSnap } = wallet.useWalletState()

  return <div>Address: {walletSnap.address}</div>
}
```

### 5.7 `getWalletState(): { walletSnap: Snapshot<WalletState> }`

用于立即获取当前的钱包状态的快照。

**返回值**:

和 `useWalletState` 的返回值一样。

**示例**:

```js
const { walletSnap } = wallet.getWalletState()
console.log(walletSnap.address)
```

## License

[MIT](LICENSE)

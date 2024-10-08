# wallet-bridge

`wallet-bridge` 是一个支持多链、多登录方式的 Web3 钱包连接库。它主要提供了钱包连接、发送交易、签名消息等功能.

## 主要特性

- **支持的链**: Ethereum、BNB Smart Chain、Polygon、TRON、Dogecoin。
- **登录方式**: WalletConnect、Passkey、Torus。
- **行业标准**: 我们依赖于 [viem](https://viem.sh/)、[@wagmi/core](https://wagmi.sh/core/getting-started) 和 [@wagmi/connectors](https://wagmi.sh/core/api/connectors) 这是 Web3 中最常用的库。

[Documentation in English](README.md)

## 主要脚本

- `dev`: 使用热加载启动 Storybook 预览。
- `build`: 构建静态的 Storybook 项目。
- `build:lib`: 将组件库构建到 **dist** 文件夹。
- `lint:fix`: 基于 **.eslintrc.js** 中定义的规则进行 linting。
- `format:prettier`: 使用 **.prettierrc** 中定义的 prettier 规则格式化文件。
- `test`: 使用 watch 模式运行测试。
- `test:cov`: 显示测试覆盖率报告。

## 使用库

### 1. 安装：

安装 wallet-bridge 及其对等依赖.

```bash
yarn add wallet-bridge@^1 @wagmi/core@^2 @wagmi/connectors@^4 viem@^2
```

### 2. 导入 Wallet：

```js
import { Wallet } from 'wallet-bridge'
```

> **注意**: `wallet-bridge` 不支持 SSR。如果你的项目使用了 SSR，请确保在使用 `wallet-bridge` 之前检查是否在浏览器环境下。虽然此库是基于 react.js 开发的，但它也可以在任何前端项目中使用。

若需要按需导入 `Wallet`，可以使用 `import()` 方法：

```js
const { Wallet } = await import('wallet-bridge')
```

### 3. 初始化

要创建一个新的 `Wallet` 对象，你可以使用其构造函数，并提供以下参数：

- `isTestNet` (可选): 是否使用测试网络。默认为 `false`。
- `loggedInSelectAddress` (可选): 在使用 Passkey 登录时，如果有多个地址，是否允许用户选择。默认为 `true`。
- `customChains` (可选): 自定义链，来源于 `CustomChain` 枚举。默认为空数组。
- `customWallets` (可选): 自定义钱包，来源于 `CustomWallet` 枚举。默认为空数组。
- `wagmiConfig` (必须): 用于配置 [@wagmi/core](https://wagmi.sh/core/getting-started) 的相关信息，类型为 `WagmiConfig`。默认为`undefined`。现在依赖 WalletConnect 的每一个 DApp 都需要从 [WalletConnect Cloud](https://cloud.walletconnect.com) 免费获得一个 projectId。
- `gtag` (可选): 用来上报 wallet-bridge 的一些事件到 google analytics，便于统计和分析用户的行为。如果你使用 `event`，则不需要提供此参数。
- `event` (可选): 如果你使用 [nextjs-google-analytics](https://www.npmjs.com/package/nextjs-google-analytics) 来上报数据， 则可以用 `event` 来代替 `gtag`，用来上报 wallet-bridge 的一些事件到 google analytics，便于统计和分析用户的行为。如果你使用 `gtag`，则不需要提供此参数。
- `locale` (可选): 用于设置语言。 现在支持 en、zh-CN、zh—TW、zh-HK、zh-MO. 如果没有设置，locale 会从下列顺序进行检测: query parameter lang -> session storage lang -> 浏览器语言设置 -> en。

**示例**：

```js
import { Wallet } from 'wallet-bridge'
import { createConfig, http } from '@wagmi/core'
import { bsc, bscTestnet, holesky, mainnet as ethereum, polygon, polygonAmoy } from '@wagmi/core/chains'
import { injected, walletConnect } from '@wagmi/connectors'

const walletConnectOptions = {
  projectId: 'YOUR_PROJECT_ID', // Get projectId at https://cloud.walletconnect.com
  metadata: {
    name: '.bit',
    description: 'Barrier-free DID for Every Community and Everyone',
    url: 'https://d.id',
    icons: ['https://d.id/favicon.png'],
  },
}

const wagmiConfig = createConfig({
  chains: [ethereum, holesky, bsc, bscTestnet, polygon, polygonAmoy],
  transports: {
    [ethereum.id]: http(),
    [holesky.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
  connectors: [injected(), walletConnect(walletConnectOptions)],
})

const wallet = new Wallet({
  isTestNet: false,
  loggedInSelectAddress: true,
  customChains: [CustomChain.eth],
  customWallets: [CustomWallet.metaMask],
  wagmiConfig: wagmiConfig,
  locale: 'zh-CN',
})
```

### 4. Wallet 的实例方法

以下是一些主要的实例方法：

#### 4.1 `initWallet({ involution = true }: { involution?: boolean } = {}): Promise<boolean>`

初始化钱包登录状态。可以在全局初始化，也可以在每次使用钱包前初始化，通过返回值来判断是否继续执行相关业务代码。`initWallet` 方法会检测钱包是否已经登录，如果已经登录，则不会再次弹窗要用户登录，如果未登录，可以通过 `involution` 参数来控制是否弹窗让用户重新登录。

**参数**:

- `involution` (可选): 类型为`boolean`。默认值为 `true`。未登录是否弹窗让用户重新登录。

**返回值**:

- `Promise<boolean>`: 表示钱包是否登录成功。如果登录成功，返回`true`；否则返回`false`。

**示例**：

```js
wallet.initWallet().then((success) => {
  console.log('Wallet Initialization:', success ? 'Successful' : 'Failed')
})
```

#### 4.2 `connectWallet(params: { onlyEth?: boolean } = {})`

显示钱包连接弹窗。

**参数**:

- `onlyEth` (可选): 类型为`boolean`。是否只显示 Ethereum 链。默认值为 `false`。

**示例**：

```js
wallet.connectWallet({ onlyEth: true })
```

#### 4.3 `connectWalletAndSignData(params: { signData: SignDataParams })`

显示钱包连接弹窗。登录的同时可以进行签名操作。

**示例**：

```js
const res = await wallet.connectWalletAndSignData({
  signData: {
    data: 'hello world',
  },
})
console.log(res)

// or EVM EIP-712
const jsonStr =
  '{"types":{"EIP712Domain":[{"name":"chainId","type":"uint256"},{"name":"name","type":"string"},{"name":"verifyingContract","type":"address"},{"name":"version","type":"string"}],"Action":[{"name":"action","type":"string"},{"name":"params","type":"string"}],"Cell":[{"name":"capacity","type":"string"},{"name":"lock","type":"string"},{"name":"type","type":"string"},{"name":"data","type":"string"},{"name":"extraData","type":"string"}],"Transaction":[{"name":"DAS_MESSAGE","type":"string"},{"name":"inputsCapacity","type":"string"},{"name":"outputsCapacity","type":"string"},{"name":"fee","type":"string"},{"name":"action","type":"Action"},{"name":"inputs","type":"Cell[]"},{"name":"outputs","type":"Cell[]"},{"name":"digest","type":"bytes32"}]},"primaryType":"Transaction","domain":{"chainId":5,"name":"da.systems","verifyingContract":"0x0000000000000000000000000000000020210722","version":"1"},"message":{"DAS_MESSAGE":"TRANSFER FROM 0x54366bcd1e73baf55449377bd23123274803236e(906.74221046 CKB) TO ckt1qyqvsej8jggu4hmr45g4h8d9pfkpd0fayfksz44t9q(764.13228446 CKB), 0x54366bcd1e73baf55449377bd23123274803236e(142.609826 CKB)","inputsCapacity":"906.74221046 CKB","outputsCapacity":"906.74211046 CKB","fee":"0.0001 CKB","digest":"0x29cd28dbeb470adb17548563ceb4988953fec7b499e716c16381e5ae4b04021f","action":{"action":"transfer","params":"0x00"},"inputs":[],"outputs":[]}}'
const res = await wallet.connectWalletAndSignData({
  signData: {
    data: JSON.parse(jsonStr),
    isEIP712: true,
  },
})
console.log(res)
```

#### 4.4 `loggedInfo()`

显示已登录弹窗。如果用户已经登录，弹窗将会展示出登录信息。

**示例**：

```js
wallet.loggedInfo()
```

#### 4.5 `sendTransaction(data: ISendTrxParams): Promise<string | undefined>`

用于发送交易。

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

#### 4.6 `initSignContext(): Promise<InitSignContextRes>`

初始化签名上下文并返回签名方法。为了避免签名时弹窗被浏览器拦截，`initSignContext` 务必在点击事件所有异步操作之前调用。

**返回值**:

- `Promise<InitSignContextRes>`: 返回一个包含以下方法的对象:
  - `signTxList`: 函数，.bit 业务专用，用于签名交易列表。
  - `signData`: 函数，返回值是签名后的数据。
  - `onFailed`: 函数，其返回值是一个`Promise<IData<any>>`，有任何错误都需要调用 `onFailed` 通知弹窗显示错误。
  - `onClose`: 函数，其返回值是一个`Promise<void>`，有些情况下如果你想自己处理错误，而不是让弹窗显示错误，想关闭弹窗就用 `onClose`。

示例：

```js
const { signTxList, signData, onFailed, onClose } = await wallet.initSignContext()
const res = await signTxList({})
const res = await signData('0x123')
const res = await signData({}, { isEIP712: true })
await onFailed()
await onClose()
```

#### 4.7 `useWalletState(): { walletSnap: Snapshot<WalletState> }`

`useWalletState` 是一个 React hook，用于获取和监听钱包状态。

**返回值**:

- `walletSnap`: 对`walletState`的当前快照，它的类型为`WalletState`，其中包含以下字段：

  - `protocol`: 钱包的协议类型，类型为`WalletProtocol`。
  - `address`: 当前登录的钱包地址，类型为`string`。
  - `coinType`: 代币类型，类型为`CoinType`。
  - `walletName`: 钱包名称，类型为`string`。
  - `hardwareWalletTipsShow`: 硬件钱包提示是否显示，类型为`boolean`。
  - `deviceData`: Passkey 登录时设备数据，类型为`IDeviceData`。
  - `ckbAddresses`: Passkey 登录时设备能够管理的 CKB 地址列表，类型为`string[]`。
  - `deviceList`: 备份设备列表，类型为`string[]`。
  - `isTestNet`: 是否为测试网，类型为`boolean`。
  - `loggedInSelectAddress`: 是否在 Passkey 登录时，有多个地址的情况下选择地址，默认为`true`。
  - `canAddDevice`: 是否可以添加备份设备，类型为`boolean`。
  - `iCloudPasskeySupport`: 当前环境是否支持将 passkey 存储在 iCloud 中，类型为`boolean`。
  - `customChains`: 自定义显示的链，类型为`CustomChain[]`。
  - `customWallets`: 自定义显示的钱包，类型为`string[]`。
  - `alias`: 当前登录的钱包地址设置的 .bit alias，类型为`string`。
  - `locale`: 当前使用的语言，类型为`string`。
  - `chainId`: 当使用 EVM 链钱包登录时表示对应的链 ID，类型为`number`。当使用 TRON 钱包登录时表示对应的链 ID，类型为`string`。

**示例**:

```js
function Component() {
  const { walletSnap } = wallet.useWalletState()
  return <div>Address: {walletSnap.address}</div>
}
```

#### 4.8 `getWalletState(): { walletSnap: Snapshot<WalletState> }`

用于立即获取当前的钱包状态的快照。

**返回值**:

和 `useWalletState` 的返回值一样。

**示例**:

```js
const { walletSnap } = wallet.getWalletState()
console.log(walletSnap.address)
```

#### 4.9 `_verifyPasskeySignature(params: { message: string, signature: string }): Promise<boolean> `

验证 passkey 签名结果是否正确。

**参数**:

- `params`: 交易参数。
  - `message`: 原信息，类型为`string`。
  - `signature`: 信息签名结果，类型为`string`。

**返回值**:

- `Promise<boolean>`: 签名结果正确，则返回 `true`。如果有任何错误或问题，可能会抛出错误。

**示例**:

```js
wallet._verifyPasskeySignature({ message: '0x123', signature: '0x40b4a569e0cb53163f...' }).then((result) => {
  console.log('result: ', result)
})
```

#### 4.10 `setLocale(locale: string)`

用于设置语言。 现在支持 en、zh-CN、zh—TW、zh-HK、zh-MO. 如果没有设置，locale 会从下列顺序进行检测: query parameter lang -> session storage lang -> 浏览器语言设置 -> en。

**示例**：

```js
wallet.setLocale('en')
wallet.setLocale('zh-CN')
wallet.setLocale('zh—TW')
wallet.setLocale('zh-HK')
wallet.setLocale('zh-MO')
```

## License

[MIT](LICENSE)

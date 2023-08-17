# wallet-bridge

`wallet-bridge` 是一个支持多链、多登录方式的 Web3 钱包连接库。它主要提供了钱包连接、发送交易、消息签名等功能，并允许用户查看当前的钱包状态。

## 主要特性

- **支持的链**: Ethereum、BNB Smart Chain、Polygon、TRON、Dogecoin。
- **登录方式**: Passkey、Torus。

[在线示例](https://storybook.d.id/iframe.html?viewMode=story&id=ui-wallets--connect-wallet)

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

```bash
yarn add wallet-bridge
```

### 2. 导入所需样式：

```js
import 'wallet-bridge/dist/style.css'
```

### 3. 导入 Wallet：

```js
import { Wallet } from 'wallet-bridge'
```

> **注意**: `wallet-bridge` 不支持 SSR（服务器端渲染）。如果您的项目使用了 SSR，请确保在使用 `wallet-bridge` 之前检查是否在浏览器环境下。虽然此库是基于 react.js 开发的，但它也可以在任何前端项目中使用。

### 4. 初始化

要创建一个新的 `Wallet` 对象，你可以使用其构造函数，并提供以下参数：

- `isTestNet` (可选): 是否使用测试网络。默认为 `false`。
- `loggedInSelectAddress` (可选): 在使用 Passkey 登录时，如果有多个地址，是否允许用户选择。默认为 `true`。
- `customChains` (可选): 自定义链，来源于 `CustomChain` 枚举。默认为空数组。
- `customWallets` (可选): 自定义钱包，来源于 `CustomWallet` 枚举。默认为空数组。

```js
const wallet = new Wallet({
  isTestNet: false,
  loggedInSelectAddress: true,
})
```

### 5. Wallet 的实例方法

以下是一些主要的实例方法：

#### 5.1 `initWallet({ involution = true })`: 初始化钱包的登录状态。

- `involution` (可选): 未登录时是否显示登录弹窗。默认为 `true`。

**示例**：

```js
wallet.initWallet().then((success) => {
  console.log('Wallet Initialization:', success ? 'Successful' : 'Failed')
})
```

#### 5.2 `connectWallet({ onlyEth = false })`: 显示钱包连接弹窗。

- `onlyEth` (可选): 是否只显示 Ethereum 链。默认为 `false`。

**示例**：

```js
wallet.connectWallet({ onlyEth: true })
```

#### 5.3 `loggedInfo()`: 显示已登录信息的弹窗。

**示例**：

```js
wallet.loggedInfo()
```

#### 5.4 `sendTransaction(data)`: 用于发送交易。

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

#### 5.5 `initSignContext()`: 初始化签名上下文并返回签名方法。

**示例**：

```js
const { signTxList, signData, onFailed } = await wallet.initSignContext()
```

#### 5.6 `useWalletState()`: 一个 React hook，用于获取和监听钱包状态。

**示例**：

```js
function Component() {
  const { walletSnap } = wallet.useWalletState()
  return <div>Address: {walletSnap.address}</div>
}
```

#### 5.7 `getWalletState()`: 获取当前钱包状态的快照。

**示例**：

```js
const { walletSnap } = wallet.getWalletState()
console.log(walletSnap.address)
```

## 许可

[MIT](LICENSE)

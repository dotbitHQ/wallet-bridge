# wallet-bridge

`wallet-bridge` is a Web3 wallet connection library that supports multiple chains and multiple login methods. It primarily offers wallet connection, transaction sending, message signing functionalities, and allows users to view the current wallet status.

## Key Features

- **Supported Chains**: Ethereum, BNB Smart Chain, Polygon, TRON, Dogecoin.
- **Login Methods**: Passkey, Torus.

[Live Demo](https://storybook.d.id/iframe.html?viewMode=story&id=ui-wallets--connect-wallet)

[中文文档](README-CN.md)

## Main Scripts

- `dev`: Bootstrap the Storybook preview with Hot Reload.
- `build`: Builds the static storybook project.
- `build:lib`: Builds the component library into the **dist** folder.
- `lint:fix`: Applies linting based on the rules defined in **.eslintrc.js**.
- `format:prettier`: Formats files using the prettier rules defined in **.prettierrc**.
- `test`: Runs testing using watch mode.
- `test:cov`: Runs testing displaying a coverage report.

## Using the Library

### 1. Installation:

```bash
yarn add wallet-bridge
```

### 2. Import Required Styles:

```js
import 'wallet-bridge/dist/style.css'
```

### 3. Import Wallet:

```js
import { Wallet } from 'wallet-bridge'
```

> **Note**: `wallet-bridge` does not support SSR (Server Side Rendering). If your project uses SSR, ensure you're in a browser environment before using `wallet-bridge`. While this library is developed based on react.js, it can be used in any frontend project.

### 4. Initialization

To create a new `Wallet` object, you can use its constructor and provide the following parameters:

- `isTestNet` (optional): Whether to use the test network. Default is `false`.
- `loggedInSelectAddress` (optional): Allow users to select when there are multiple addresses while logging in with Passkey. Default is `true`.
- `customChains` (optional): Custom chains, sourced from `CustomChain` enumeration. Default is an empty array.
- `customWallets` (optional): Custom wallets, sourced from `CustomWallet` enumeration. Default is an empty array.

```js
const wallet = new Wallet({
  isTestNet: false,
  loggedInSelectAddress: true,
})
```

### 5. Wallet Instance Methods

Below are some primary instance methods:

#### 5.1 `initWallet({ involution = true })`: Initialize the wallet's login status.

- `involution` (optional): Show the login popup when not logged in. Default is `true`.

**Example**:

```js
wallet.initWallet().then((success) => {
  console.log('Wallet Initialization:', success ? 'Successful' : 'Failed')
})
```

#### 5.2 `connectWallet({ onlyEth = false })`: Display the wallet connection popup.

- `onlyEth` (optional): Only show the Ethereum chain. Default is `false`.

**Example**:

```js
wallet.connectWallet({ onlyEth: true })
```

#### 5.3 `loggedInfo()`: Display the logged-in information popup.

**Example**:

```js
wallet.loggedInfo()
```

#### 5.4 `sendTransaction(data)`: Used for sending transactions.

**Example**:

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

#### 5.5 `initSignContext()`: Initialize signing context and return signing methods.

**Example**:

```js
const { signTxList, signData, onFailed } = await wallet.initSignContext()
```

#### 5.6 `useWalletState()`: A React hook for obtaining and listening to wallet states.

**Example**:

```js
function Component() {
  const { walletSnap } = wallet.useWalletState()
  return <div>Address: {walletSnap.address}</div>
}
```

#### 5.7 `getWalletState()`: Obtain a snapshot of the current wallet state.

**Example**:

```js
const { walletSnap } = wallet.getWalletState()
console.log(walletSnap.address)
```

## License

[MIT](LICENSE)

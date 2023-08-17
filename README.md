# wallet-bridge

`wallet-bridge` is a Web3 wallet connection library that supports multiple chains and multiple login methods. It mainly provides functionalities like connecting wallets, sending transactions, signing messages, etc.

## Features

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

> **Note**: `wallet-bridge` does not support SSR. If your project uses SSR, make sure to check if you are in a browser environment before using `wallet-bridge`. Although this library is developed based on react.js, it can also be used in any frontend project.

To import the `Wallet` on demand, you can use the `import()` method:

```js
const { Wallet } = await import('wallet-bridge')
```

### 4. Initialization

To create a new `Wallet` object, you can use its constructor and provide the following parameters:

- `isTestNet` (optional): Whether to use the test network. Defaults to `false`.
- `loggedInSelectAddress` (optional): Whether to allow users to choose when logging in with Passkey if there are multiple addresses. Defaults to `true`.
- `customChains` (optional): Custom chains sourced from the `CustomChain` enum. Defaults to an empty array.
- `customWallets` (optional): Custom wallets sourced from the `CustomWallet` enum. Defaults to an empty array.

**Example**:

```js
const wallet = new Wallet({
  isTestNet: false,
  loggedInSelectAddress: true,
  customChains: [CustomChain.eth],
  customWallets: [CustomWallet.metaMask],
})
```

### 5. Wallet Instance Methods

Here are some primary instance methods:

#### 5.1 `initWallet({ involution = true }: { involution?: boolean } = {}): Promise<boolean>`

Initialize the wallet login status. It can be initialized globally or before every wallet use, and you can decide whether to continue executing the related business code based on the return value. The `initWallet` method checks whether the wallet is already logged in. If logged in, it won't prompt the user to log in again. If not logged in, the `involution` parameter can control whether to prompt the user to re-login.

**Parameters**:

- `involution` (optional): Type `boolean`. Defaults to `true`. Whether to prompt the user to re-login if not already logged in.

**Return Value**:

- `Promise<boolean>`: Indicates whether the wallet has successfully logged in. Returns `true` if successful; otherwise, returns `false`.

**Example**:

```js
wallet.initWallet().then((success) => {
  console.log('Wallet Initialization:', success ? 'Successful' : 'Failed')
})
```

#### 5.2 `connectWallet(params: { onlyEth?: boolean } = {})`

Display the wallet connection popup.

**Parameters**:

- `onlyEth` (optional): Type `boolean`. Whether to display only the Ethereum chain. Defaults to `false`.

**Example**:

```js
wallet.connectWallet({ onlyEth: true })
```

#### 5.3 `loggedInfo()`

Display the logged-in popup. If the user is already logged in, the popup will show the login information.

**Example**:

```js
wallet.loggedInfo()
```

#### 5.4 `sendTransaction(data: ISendTrxParams): Promise<string | undefined>`

Used for sending transactions.

**Parameters**:

- `data`: Transaction parameters.
  - `to`: The transaction's recipient address, type `string`.
  - `value`: Transaction amount, must be in the smallest unit of the token, type `string`.
  - `data` (optional): Transaction memo, type `string`.

**Return Value**:

- `Promise<string | undefined>`: After successfully sending the transaction, a transaction hash is returned. If there's any error or issue, it might return `undefined` or throw an error.

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

#### 5.5 `initSignContext(): Promise<InitSignContextRes>`

Initialize the signing context and return the signing method. To prevent the browser from blocking the signing popup, ensure that you call `initSignContext` before any asynchronous operations in the click event.

**Return Value**:

- `Promise<InitSignContextRes>`: Returns an object containing the following methods:
  - `signTxList`: Function, specific to .bit business, used for signing transaction lists.
  - `signData`: Function, the return value is the signed data.
  - `onFailed`: Function, its return value is a `DeviceAuthError`. In case of any errors, call `onFailed` to notify the popup to display the error.

Example:

```js
const { signTxList, signData, onFailed } = await wallet.initSignContext()
const res = await signTxList({})
const res = await signData('0x123')
const res = await signData({}, { isEIP712: true })
await onFailed()
```

#### 5.6 `useWalletState(): { walletSnap: Snapshot<WalletState> }`

`useWalletState` is a React hook for retrieving and listening to the wallet's state.

**Returns**:

- `walletSnap`: A current snapshot of the `walletState` with type `WalletState`, which contains the following fields:

  - `protocol`: The protocol type of the wallet, of type `WalletProtocol`.
  - `address`: The currently logged-in wallet address, of type `string`.
  - `coinType`: The type of token, of type `CoinType`.
  - `hardwareWalletTipsShow`: Whether the hardware wallet tips are shown or not, of type `boolean`.
  - `deviceData`: Device data during Passkey login, of type `IDeviceData`.
  - `ckbAddresses`: List of CKB addresses that the device can manage during Passkey login, of type `string[]`.
  - `deviceList`: List of backup devices, of type `string[]`.
  - `isTestNet`: Whether it's on testnet or not, of type `boolean`.
  - `loggedInSelectAddress`: Whether to select an address when logging in with Passkey with multiple addresses available, default is `true`.
  - `canAddDevice`: Whether a backup device can be added or not, of type `boolean`.
  - `iCloudPasskeySupport`: Whether the current environment supports storing the passkey in iCloud, of type `boolean`.
  - `customChains`: Custom chains to be displayed, of type `CustomChain[]`.
  - `customWallets`: Custom wallets to be displayed, of type `CustomWallet[]`.

**Example**:

```js
function Component() {
  const { walletSnap } = wallet.useWalletState()
  return <div>Address: {walletSnap.address}</div>
}
```

#### 5.7 `getWalletState(): { walletSnap: Snapshot<WalletState> }`

Used to immediately get the current snapshot of the wallet's state.

**Returns**:

Same as the return of `useWalletState`.

**Example**:

```js
const { walletSnap } = wallet.getWalletState()
console.log(walletSnap.address)
```

## License

[MIT](LICENSE)

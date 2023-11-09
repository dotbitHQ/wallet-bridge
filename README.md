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

### 2. Import Wallet:

```js
import { Wallet } from 'wallet-bridge'
```

> **Note**: `wallet-bridge` does not support SSR. If your project uses SSR, make sure to check if you are in a browser environment before using `wallet-bridge`. Although this library is developed based on react.js, it can also be used in any frontend project.

To import the `Wallet` on demand, you can use the `import()` method:

```js
const { Wallet } = await import('wallet-bridge')
```

### 3. Initialization

To create a new `Wallet` object, you can use its constructor and provide the following parameters:

- `isTestNet` (optional): Whether to use the test network. Defaults to `false`.
- `loggedInSelectAddress` (optional): Whether to allow users to choose when logging in with Passkey if there are multiple addresses. Defaults to `true`.
- `customChains` (optional): Custom chains sourced from the `CustomChain` enum. Defaults to an empty array.
- `customWallets` (optional): Custom wallets sourced from the `CustomWallet` enum. Defaults to an empty array.
- `wagmiConfig` (Optional): Used for configuring information related to [wagmi](https://wagmi.sh/core/getting-started), of type `WagmiConfig`. Defaults to `undefined`. If you need to use [WalletConnect](https://docs.walletconnect.com), this parameter must be provided.
- `gtag` (optional): Used to report some wallet-bridge events to Google Analytics for the purpose of tracking and analyzing user behavior. If you use `event`, you do not need to provide this parameter.
- `event` (optional): If you use [nextjs-google-analytics](https://www.npmjs.com/package/nextjs-google-analytics) to report data, you can use `event` in place of `gtag` to report wallet-bridge events to Google Analytics for tracking and analyzing user behavior. If you use `gtag`, you do not need to provide this parameter.
- `locale` (optional): Used to set the locale. Currently en, zh-CN, zh—TW, zh-HK and zh-MO are supported. If not set, the locale is detected in the order of query parameter lang -> the session storage lang -> browser language -> en.

**Example**:

```js
import { Wallet } from 'wallet-bridge'
import { bsc, bscTestnet, goerli, mainnet as ethereum, polygon, polygonMumbai } from '@wagmi/core/chains'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { configureChains, createConfig, InjectedConnector } from '@wagmi/core'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'

const chainIdToRpc: { [chainId: number]: string | undefined } = {
  [ethereum.id]: 'https://eth.public-rpc.com',
  [goerli.id]: 'https://rpc.ankr.com/eth_goerli',
  [bsc.id]: 'https://bscrpc.com',
  [bscTestnet.id]: 'https://rpc.ankr.com/bsc_testnet_chapel',
  [polygon.id]: 'https://polygon-rpc.com',
  [polygonMumbai.id]: 'https://rpc.ankr.com/polygon_mumbai',
}

const { publicClient, chains } = configureChains(
  [ethereum, goerli, bsc, bscTestnet, polygon, polygonMumbai],
  [
    jsonRpcProvider({
      rpc(chain) {
        return { http: chainIdToRpc[chain.id] || '' }
      },
    }),
  ],
)

const metaMaskConnector = new MetaMaskConnector({
  chains,
})

const injectedConnector = new InjectedConnector({
  chains,
})

const walletConnectConnectorOptions = {
  projectId: '13c75e7d20888adc7e57cad417ad9ed8',
  metadata: {
    name: '.bit',
    description: 'Barrier-free DID for Every Community and Everyone',
    url: 'https://d.id',
    icons: ['https://d.id/favicon.png'],
  },
}

const walletConnectConnectorShow = new WalletConnectConnector({
  chains,
  options: { ...walletConnectConnectorOptions, showQrModal: true },
})

const walletConnectConnectorHide = new WalletConnectConnector({
  chains,
  options: { ...walletConnectConnectorOptions, showQrModal: false },
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [walletConnectConnectorShow, walletConnectConnectorHide, injectedConnector, metaMaskConnector],
  publicClient,
})

const wallet = new Wallet({
  isTestNet: false,
  loggedInSelectAddress: true,
  customChains: [CustomChain.eth],
  customWallets: [CustomWallet.metaMask],
  wagmiConfig: wagmiConfig,
  locale: 'zh-CN'
})
```

### 4. Wallet Instance Methods

Here are some primary instance methods:

#### 4.1 `initWallet({ involution = true }: { involution?: boolean } = {}): Promise<boolean>`

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

#### 4.2 `connectWallet(params: { onlyEth?: boolean } = {})`

Display the wallet connection popup.

**Parameters**:

- `onlyEth` (optional): Type `boolean`. Whether to display only the Ethereum chain. Defaults to `false`.

**Example**:

```js
wallet.connectWallet({ onlyEth: true })
```

#### 4.3 `connectWalletAndSignData(params: { signData: SignDataParams })`

Displays a wallet connection popup. Allows signing while logging in.

**Example**：

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

Display the logged-in popup. If the user is already logged in, the popup will show the login information.

**Example**:

```js
wallet.loggedInfo()
```

#### 4.5 `sendTransaction(data: ISendTrxParams): Promise<string | undefined>`

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

#### 4.6 `initSignContext(): Promise<InitSignContextRes>`

Initialize the signing context and return the signing method. To prevent the browser from blocking the signing popup, ensure that you call `initSignContext` before any asynchronous operations in the click event.

**Return Value**:

- `Promise<InitSignContextRes>`: Returns an object containing the following methods:
  - `signTxList`: Function, specific to .bit business, used for signing transaction lists.
  - `signData`: Function, the return value is the signed data.
  - `onFailed`: A function, which returns a `Promise<IData<any>>`. In case of any errors, call `onFailed` to notify and display the error in a popup.
  - `onClose`: A function, which returns a `Promise<void>`. In some cases, if you want to handle the error yourself and not display it in a popup, use `onClose` to close the popup.

Example:

```js
const { signTxList, signData, onFailed, onClose } = await wallet.initSignContext()
const res = await signTxList({})
const res = await signData('0x123')
const res = await signData({}, { isEIP712: true })
await onFailed()
await onClose()
```

#### 4.7 `useWalletState(): { walletSnap: Snapshot<WalletState> }`

`useWalletState` is a React hook for retrieving and listening to the wallet's state.

**Returns**:

- `walletSnap`: A current snapshot of the `walletState` with type `WalletState`, which contains the following fields:

  - `protocol`: The protocol type of the wallet, of type `WalletProtocol`.
  - `address`: The currently logged-in wallet address, of type `string`.
  - `coinType`: The type of token, of type `CoinType`.
  - `walletName`: The wallet name, of type `string`.
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

#### 4.8 `getWalletState(): { walletSnap: Snapshot<WalletState> }`

Used to immediately get the current snapshot of the wallet's state.

**Returns**:

Same as the return of `useWalletState`.

**Example**:

```js
const { walletSnap } = wallet.getWalletState()
console.log(walletSnap.address)
```

#### 4.9 `_verifyPasskeySignature(params: { message: string, signature: string }): Promise<boolean> `

Verify if the passkey signature is correct.

**Parameters**:

- `params`: Transaction parameters.
  - `message`: Original message, of type `string`.
  - `signature`: Result of message signature, of type `string`.

**Return value**:

- `Promise<boolean>`: If the signature is correct, it returns `true`. Any errors or issues may result in an exception being thrown.

**Example**:

```js
wallet._verifyPasskeySignature({ message: '0x123', signature: '0x40b4a569e0cb53163f...' }).then((result) => {
  console.log('result: ', result)
})
```

## License

[MIT](LICENSE)

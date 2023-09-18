import { Button } from '../../components'
import { Wallet } from '../index'
import { bsc, bscTestnet, goerli, mainnet as ethereum, polygon, polygonMumbai } from '@wagmi/core/chains'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { configureChains, createConfig } from '@wagmi/core'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'

export default {
  title: 'UI/Wallets',
}

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

const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    projectId: '13c75e7d20888adc7e57cad417ad9ed8',
    metadata: {
      name: '.bit',
      description: 'Barrier-free DID for Every Community and Everyone',
      url: 'https://d.id',
      icons: ['https://d.id/favicon.png'],
    },
    showQrModal: true,
  },
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [walletConnectConnector, metaMaskConnector],
  publicClient,
})

const wallet = new Wallet({
  isTestNet: true,
  wagmiConfig,
})

// wallet.walletSDK?.context?.addEventListener('walletConnect', () => {
//   window.location.reload()
// })
//
// wallet.walletSDK?.context?.addEventListener('walletChange', () => {
//   window.location.reload()
// })

wallet.initWallet({ involution: false })

const TemplateConnectWallet = () => {
  const { walletSnap } = wallet.useWalletState()

  const onConnect = async () => {
    wallet.connectWallet()
  }

  const onConnectOnlyETH = async () => {
    wallet.connectWallet({ onlyEth: true })
  }

  const onLoggedIn = async () => {
    wallet.loggedInfo()
  }

  const onSignData = async () => {
    const message = '0x123abc'
    const signature = await wallet.walletSDK.signData(message)
    console.log(signature)
    // const res = await wallet.walletSDK._verifyPasskeySignature({ message, signature: signature as string })
    // console.log(res)
  }

  return (
    <>
      <div>
        <div>protocol: {walletSnap.protocol}</div>
        <div>coinType: {walletSnap.coinType}</div>
        <div className="break-words">address: {walletSnap.address}</div>
      </div>
      <Button onClick={onConnect}>Connect Wallet</Button>
      <br />
      <Button onClick={onConnectOnlyETH}>Connect Wallet only ETH</Button>
      <br />
      <Button onClick={onLoggedIn}>Logged In</Button>
      <br />
      <Button onClick={onSignData}>Sign data</Button>
    </>
  )
}

export const ConnectWallet = TemplateConnectWallet.bind({})

const TemplateInitWallet = () => {
  const initWallet = async () => {
    await wallet.initWallet()
  }

  return (
    <>
      <Button onClick={initWallet}>init wallet</Button>
    </>
  )
}

export const InitWallet = TemplateInitWallet.bind({})

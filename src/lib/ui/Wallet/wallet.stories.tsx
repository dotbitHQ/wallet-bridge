import { Button } from '../../components'
import { Wallet } from '../index'
import { bsc, bscTestnet, goerli, mainnet, polygon, polygonMumbai } from '@wagmi/core/chains'
import { publicProvider } from '@wagmi/core/providers/public'
import { configureChains, createConfig } from '@wagmi/core'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'

export default {
  title: 'UI/Wallets',
}

const projectId = '13c75e7d20888adc7e57cad417ad9ed8'

const { publicClient, chains } = configureChains(
  [mainnet, goerli, bsc, bscTestnet, polygon, polygonMumbai],
  [publicProvider()],
)

const connector = new WalletConnectConnector({
  chains,
  options: {
    projectId,
    metadata: {
      name: '.bit',
      description: 'Barrier-free DID for Every Community and Everyone',
      url: 'https://d.id/bit/reg',
      icons: ['https://test.d.id/bit/images/reg/das-logo.svg'],
    },
    showQrModal: true,
  },
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [connector],
  publicClient,
})

const wallet = new Wallet({
  isTestNet: true,
  wagmiConfig,
})

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
        <div>address: {walletSnap.address}</div>
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

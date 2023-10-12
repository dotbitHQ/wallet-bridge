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

  const onConnectWalletAndSignData = async () => {
    const signature = await wallet.connectWalletAndSignData({
      signData: {
        data: 'hello',
      },
    })
    console.log(signature)
  }

  const onConnectWalletAndSignData712 = async () => {
    const mmJson =
      '{"types":{"EIP712Domain":[{"name":"chainId","type":"uint256"},{"name":"name","type":"string"},{"name":"verifyingContract","type":"address"},{"name":"version","type":"string"}],"Action":[{"name":"action","type":"string"},{"name":"params","type":"string"}],"Cell":[{"name":"capacity","type":"string"},{"name":"lock","type":"string"},{"name":"type","type":"string"},{"name":"data","type":"string"},{"name":"extraData","type":"string"}],"Transaction":[{"name":"DAS_MESSAGE","type":"string"},{"name":"inputsCapacity","type":"string"},{"name":"outputsCapacity","type":"string"},{"name":"fee","type":"string"},{"name":"action","type":"Action"},{"name":"inputs","type":"Cell[]"},{"name":"outputs","type":"Cell[]"},{"name":"digest","type":"bytes32"}]},"primaryType":"Transaction","domain":{"chainId":5,"name":"da.systems","verifyingContract":"0x0000000000000000000000000000000020210722","version":"1"},"message":{"DAS_MESSAGE":"TRANSFER FROM 0x54366bcd1e73baf55449377bd23123274803236e(906.74221046 CKB) TO ckt1qyqvsej8jggu4hmr45g4h8d9pfkpd0fayfksz44t9q(764.13228446 CKB), 0x54366bcd1e73baf55449377bd23123274803236e(142.609826 CKB)","inputsCapacity":"906.74221046 CKB","outputsCapacity":"906.74211046 CKB","fee":"0.0001 CKB","digest":"0x29cd28dbeb470adb17548563ceb4988953fec7b499e716c16381e5ae4b04021f","action":{"action":"transfer","params":"0x00"},"inputs":[],"outputs":[]}}'
    const signature = await wallet.connectWalletAndSignData({
      signData: {
        data: JSON.parse(mmJson),
        isEIP712: true,
      },
    })
    console.log(signature)
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

  const onSendTransaction = async () => {
    const signature = await wallet.walletSDK.sendTransaction({
      to: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
      value: '10000000000000000',
      data: '0x123abc',
    })
    console.log(signature)
  }

  return (
    <>
      <div>
        <div>protocol: {walletSnap.protocol}</div>
        <div>coinType: {walletSnap.coinType}</div>
        <div className="break-words">address: {walletSnap.address}</div>
        <div>walletName: {walletSnap.walletName}</div>
      </div>
      <Button onClick={onConnect}>Connect Wallet</Button>
      <br />
      <Button onClick={onConnectOnlyETH}>Connect Wallet only ETH</Button>
      <br />
      <Button onClick={onConnectWalletAndSignData}>connectWalletAndSignData</Button>
      <br />
      <Button onClick={onConnectWalletAndSignData712}>onConnectWalletAndSignData712</Button>
      <br />
      <Button onClick={onLoggedIn}>Logged In</Button>
      <br />
      <Button onClick={onSignData}>Sign data</Button>
      <br />
      <Button onClick={onSendTransaction}>Send transaction</Button>
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

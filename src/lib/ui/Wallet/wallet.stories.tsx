import { Button } from '../../components'
import { Wallet } from '../index'
import { bsc, bscTestnet, goerli, mainnet as ethereum, polygon, polygonMumbai } from '@wagmi/core/chains'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { configureChains, createConfig, InjectedConnector } from '@wagmi/core'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { useEffect } from 'react'
import { loadScript } from '../../utils'

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

const injectedConnector = new InjectedConnector({
  chains,
})

const walletConnectConnectorOptions = {
  projectId: '13c75e7d20888adc7e57cad417ad9ed8', // Get projectId at https://cloud.walletconnect.com
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
  connectors: [walletConnectConnectorShow, walletConnectConnectorHide, injectedConnector],
  publicClient,
})

const wallet = new Wallet({
  isTestNet: false,
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

  const onDisconnect = async () => {
    await wallet.walletSDK?.disconnect()
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
    // only Passkey-signed transactions can be verified.
    const res = await wallet._verifyPasskeySignature({ message, signature: signature as string })
    console.log(res)
  }

  const onSendTransaction = async () => {
    const signature = await wallet.sendTransaction({
      to: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
      value: '10000000000000000',
      data: '0x123abc',
    })
    console.log(signature)
  }

  const setLocale = (locale: string) => {
    wallet.setLocale(locale)
  }

  useEffect(() => {
    loadScript('//cdn.jsdelivr.net/npm/eruda', 'eruda').then(() => {
      // @ts-ignore
      window.eruda.init()
    })
  })

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
      <Button onClick={onDisconnect}>Disconnect</Button>
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
      <br />
      <Button
        onClick={() => {
          setLocale('zh-HK')
        }}
      >
        set zh-HK
      </Button>
      <br />
      <Button
        onClick={() => {
          setLocale('zh-CN')
        }}
      >
        set zh-CN
      </Button>
      <br />
      <Button
        onClick={() => {
          setLocale('en')
        }}
      >
        set en
      </Button>
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

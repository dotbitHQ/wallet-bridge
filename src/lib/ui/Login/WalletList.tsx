import { createTips, Header, SwapChildProps } from '../../components'
import { CoinType, CustomWallet } from '../../constant'
import { ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { WalletItem } from '../../components/WalletItem'
import handleError from '../../utils/handleError'
import { setLoginCacheState, useLoginCacheState } from '../../store/loginCache'
import { WalletSDKContext } from '../ConnectWallet'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { useWalletState } from '../../store'
import MetaMaskIcon from './icon/metamask-icon.svg'
import TrustWalletIcon from './icon/trustwallet-icon.svg'
import ImTokenIcon from './icon/imtoken-icon.svg'
import TokenPocketIcon from './icon/tokenpocket-icon.svg'
// import UnisatIcon from './icon/unisat-icon.svg'
import OneKeyIcon from './icon/onekey-icon.svg'
import TronLinkIcon from './icon/tronlink-icon.svg'
import WalletConnectIcon from './icon/walletconnect-icon.svg'
import { t } from '@lingui/macro'
import { getConnectors } from '@wagmi/core'

interface IWallet {
  icon: ReactNode
  name: string
  supportList: CoinType[]
}

export const WalletList = ({ transitionRef, transitionStyle }: SwapChildProps) => {
  const walletSDK = useContext(WalletSDKContext)!
  const { goBack, onClose, goNext } = useSimpleRouter()!
  const [currentLogin, setCurrentLogin] = useState('')
  const [timeoutId, setTimeoutId] = useState(0)
  const { loginCacheSnap } = useLoginCacheState()
  const { walletSnap } = useWalletState()

  const wallets = useMemo<IWallet[]>(() => {
    const connectors = getConnectors(walletSDK.context.wagmiConfig)

    let list = [
      {
        // eslint-disable-next-line lingui/no-unlocalized-strings
        icon: <img className="size-10" src={WalletConnectIcon} alt="WalletConnect" />,
        name: CustomWallet.walletConnect,
        supportList: [CoinType.eth, CoinType.bsc, CoinType.pol],
      },
      {
        icon: <img className="size-10" src={ImTokenIcon} alt="imToken" />,
        name: CustomWallet.imToken,
        supportList: [CoinType.trx],
      },
      // {
      //   icon: <img className="size-10" src={UnisatIcon} alt="Unisat" />,
      //   name: CustomWallet.unisat,
      //   supportList: [CoinType.btc],
      // },
      {
        // eslint-disable-next-line lingui/no-unlocalized-strings
        icon: <img className="size-10" src={TokenPocketIcon} alt="TokenPocket" />,
        name: CustomWallet.tokenPocket,
        supportList: [CoinType.trx, CoinType.doge],
      },
      {
        // eslint-disable-next-line lingui/no-unlocalized-strings
        icon: <img className="size-10" src={TronLinkIcon} alt="TronLink" />,
        name: CustomWallet.tronLink,
        supportList: [CoinType.trx],
      },
    ]

    if (connectors.length > 2) {
      connectors.forEach((connector) => {
        if (connector.name !== 'WalletConnect' && connector.name !== 'Injected') {
          list.unshift({
            icon: <img className="size-10" src={connector.icon} alt={connector.name} />,
            name: connector.name,
            supportList: [CoinType.eth, CoinType.bsc, CoinType.pol],
          })
        }
      })
    } else {
      list = [
        {
          // eslint-disable-next-line lingui/no-unlocalized-strings
          icon: <img className="size-10" src={WalletConnectIcon} alt="WalletConnect" />,
          name: CustomWallet.walletConnect,
          supportList: [CoinType.eth, CoinType.bsc, CoinType.pol],
        },
        {
          // eslint-disable-next-line lingui/no-unlocalized-strings
          icon: <img className="size-10" src={MetaMaskIcon} alt="MetaMask" />,
          name: CustomWallet.metaMask,
          supportList: [CoinType.eth, CoinType.bsc, CoinType.pol],
        },
        {
          // eslint-disable-next-line lingui/no-unlocalized-strings
          icon: <img className="size-10" src={TrustWalletIcon} alt="TrustWallet" />,
          name: CustomWallet.trustWallet,
          supportList: [CoinType.eth, CoinType.bsc, CoinType.pol],
        },
        {
          icon: <img className="size-10" src={ImTokenIcon} alt="imToken" />,
          name: CustomWallet.imToken,
          supportList: [CoinType.eth, CoinType.bsc, CoinType.pol, CoinType.trx],
        },
        // {
        //   icon: <img className="size-10" src={UnisatIcon} alt="Unisat" />,
        //   name: CustomWallet.unisat,
        //   supportList: [CoinType.btc],
        // },
        {
          // eslint-disable-next-line lingui/no-unlocalized-strings
          icon: <img className="size-10" src={TokenPocketIcon} alt="TokenPocket" />,
          name: CustomWallet.tokenPocket,
          supportList: [CoinType.eth, CoinType.bsc, CoinType.pol, CoinType.trx, CoinType.doge],
        },
        {
          // eslint-disable-next-line lingui/no-unlocalized-strings
          icon: <img className="size-10" src={OneKeyIcon} alt="OneKey" />,
          name: CustomWallet.oneKey,
          supportList: [CoinType.eth, CoinType.bsc, CoinType.pol],
        },
        // {
        //   icon: <img className="h-10 w-10" src={ITokenIcon} alt="iToken" />,
        //   name: CustomWallet.iToken,
        //   supportList: [CoinType.eth, CoinType.bsc, CoinType.pol],
        // },
        {
          // eslint-disable-next-line lingui/no-unlocalized-strings
          icon: <img className="size-10" src={TronLinkIcon} alt="TronLink" />,
          name: CustomWallet.tronLink,
          supportList: [CoinType.trx],
        },
      ]
    }

    return list
  }, [walletSDK.context.wagmiConfig])

  const showWallets = useMemo(() => {
    const { coinType } = loginCacheSnap
    if (coinType) {
      return wallets.filter((wallet) => {
        if (wallet.name === CustomWallet.walletConnect && !walletSDK.context.wagmiConfig) {
          return false
        }

        return (
          wallet.supportList.includes(coinType) &&
          (walletSnap.customWallets && walletSnap.customWallets?.length > 0
            ? walletSnap.customWallets.includes(wallet.name)
            : true)
        )
      })
    }
    return wallets
  }, [loginCacheSnap, walletSDK.context.wagmiConfig, walletSnap.customWallets, wallets])

  const onLogin = async (wallet: IWallet) => {
    const { name } = wallet
    if (currentLogin) {
      return
    }

    try {
      setCurrentLogin(name)
      const id = globalThis.setTimeout(() => {
        setCurrentLogin('')
      }, 12000)
      setTimeoutId(id as unknown as number)
      const { coinType } = loginCacheSnap
      if (coinType) {
        setLoginCacheState({ walletName: name })
        await walletSDK.init({
          coinType,
          walletName: name,
        })
        await walletSDK.connect()
      }
      onClose?.()
      setLoginCacheState({ walletConnectDisplayUri: '', walletName: '' })
    } catch (error: any) {
      const handleErrorRes = handleError(error)
      if (handleErrorRes.isHandle) {
        if (handleErrorRes.title && handleErrorRes.message) {
          createTips({
            title: handleErrorRes.title,
            content: handleErrorRes.message,
          })
        }
      } else {
        createTips({
          title: t`Tips`,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          content: error.code ? `${error.code}: ${error.message}` : error.message ? error.message : error.toString(),
        })
      }
    } finally {
      setCurrentLogin('')
      globalThis.clearTimeout(timeoutId)
    }
  }

  const close = () => {
    onClose?.()
    globalThis.clearTimeout(timeoutId)
    setCurrentLogin('')
  }

  const back = () => {
    goBack?.()
    globalThis.clearTimeout(timeoutId)
    setCurrentLogin('')
  }

  useEffect(() => {
    if (loginCacheSnap.walletConnectDisplayUri) {
      goNext?.()
    }
  }, [goNext, loginCacheSnap.walletConnectDisplayUri])

  return (
    <>
      <Header
        className="z-10 mt-0.5 w-full-4px bg-white p-6"
        title={t`Select Wallet`}
        onClose={close}
        goBack={back}
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div className="w-full px-6 pb-6 pt-[76px]" style={transitionStyle} ref={transitionRef}>
        <ul className="flex flex-col gap-2">
          {showWallets?.map((wallet, index) => {
            return (
              <WalletItem
                key={index}
                {...wallet}
                currentLogin={currentLogin}
                onClick={async () => {
                  await onLogin(wallet)
                }}
              ></WalletItem>
            )
          })}
        </ul>
      </div>
    </>
  )
}

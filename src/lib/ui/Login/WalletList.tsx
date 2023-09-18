import { createTips, Header, SwapChildProps } from '../../components'
import { CustomWallet, WalletProtocol } from '../../constant'
import { ReactNode, useContext, useMemo, useState } from 'react'
import { WalletItem } from '../../components/WalletItem'
import { snapshot } from 'valtio'
import handleError from '../../utils/handleError'
import { loginCacheState, useLoginCacheState } from '../../store/loginCache'
import { WalletSDKContext } from '../ConnectWallet'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { useWalletState } from '../../store'
import MetaMaskIcon from './icon/metamask-icon.svg'
import TrustWalletIcon from './icon/trustwallet-icon.svg'
import ImTokenIcon from './icon/imtoken-icon.svg'
import TokenPocketIcon from './icon/tokenpocket-icon.svg'
import OneKeyIcon from './icon/onekey-icon.svg'
import ITokenIcon from './icon/itoken-icon.svg'
import TronLinkIcon from './icon/tronlink-icon.svg'
import WalletConnectIcon from './icon/walletconnect-icon.svg'
import { isMobile } from 'react-device-detect'

interface IWallet {
  icon: ReactNode
  name: CustomWallet
  protocol: WalletProtocol[]
}

export const WalletList = ({ transitionRef, transitionStyle }: SwapChildProps) => {
  const walletSDK = useContext(WalletSDKContext)!
  const router = useSimpleRouter()!
  const goBack = router.goBack
  const onClose = router.onClose
  const [currentLogin, setCurrentLogin] = useState('')
  const { loginCacheSnap } = useLoginCacheState()
  const { walletSnap } = useWalletState()

  const wallets = useMemo<IWallet[]>(() => {
    return [
      {
        icon: <img className="h-10 w-10" src={WalletConnectIcon} alt="WalletConnect" />,
        name: CustomWallet.walletConnect,
        protocol: [WalletProtocol.walletConnect, WalletProtocol.metaMask],
      },
      {
        icon: <img className="h-10 w-10" src={MetaMaskIcon} alt="MetaMask" />,
        name: CustomWallet.metaMask,
        protocol: [WalletProtocol.metaMask],
      },
      {
        icon: <img className="h-10 w-10" src={TrustWalletIcon} alt="TrustWallet" />,
        name: CustomWallet.trustWallet,
        protocol: [WalletProtocol.metaMask],
      },
      {
        icon: <img className="h-10 w-10" src={ImTokenIcon} alt="imToken" />,
        name: CustomWallet.imToken,
        protocol: [WalletProtocol.metaMask, WalletProtocol.tronLink],
      },
      {
        icon: <img className="h-10 w-10" src={TokenPocketIcon} alt="TokenPocket" />,
        name: CustomWallet.tokenPocket,
        protocol: [WalletProtocol.metaMask, WalletProtocol.tokenPocketUTXO, WalletProtocol.tronLink],
      },
      {
        icon: <img className="h-10 w-10" src={OneKeyIcon} alt="OneKey" />,
        name: CustomWallet.oneKey,
        protocol: [WalletProtocol.metaMask],
      },
      {
        icon: <img className="h-10 w-10" src={ITokenIcon} alt="iToken" />,
        name: CustomWallet.iToken,
        protocol: [WalletProtocol.metaMask],
      },
      {
        icon: <img className="h-10 w-10" src={TronLinkIcon} alt="TronLink" />,
        name: CustomWallet.tronLink,
        protocol: [WalletProtocol.tronLink],
      },
    ]
  }, [])

  const showWallets = useMemo(() => {
    const { protocol } = loginCacheSnap
    if (protocol) {
      return wallets.filter((wallet) => {
        if (isMobile) {
          if (
            (protocol === WalletProtocol.walletConnect || protocol === WalletProtocol.metaMask) &&
            wallet.name === CustomWallet.walletConnect
          ) {
            return true
          } else if (!(protocol === WalletProtocol.walletConnect || protocol === WalletProtocol.metaMask)) {
            return (
              wallet.protocol.includes(protocol) &&
              (walletSnap.customWallets && walletSnap.customWallets?.length > 0
                ? walletSnap.customWallets.includes(wallet.name)
                : true)
            )
          }
          return false
        } else {
          return (
            wallet.protocol.includes(protocol) &&
            (walletSnap.customWallets && walletSnap.customWallets?.length > 0
              ? walletSnap.customWallets.includes(wallet.name)
              : true)
          )
        }
      })
    }
    return wallets
  }, [loginCacheSnap, walletSnap.customWallets, wallets])

  const onLogin = async (wallet: IWallet) => {
    const { name } = wallet
    if (currentLogin) {
      return
    }

    try {
      setCurrentLogin(name)
      const isWalletConnect = name === CustomWallet.walletConnect
      const { protocol, coinType } = snapshot(loginCacheState)
      if (protocol && coinType) {
        await walletSDK.init({
          protocol: isWalletConnect ? WalletProtocol.walletConnect : protocol,
          coinType,
        })
        await walletSDK.connect()
      }
      onClose?.()
    } catch (error: any) {
      console.error(error)
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
          title: `Tips`,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          content: error.code ? `${error.code}: ${error.message}` : error.message ? error.message : error.toString(),
        })
      }
    } finally {
      setCurrentLogin('')
    }
  }

  const close = () => {
    onClose?.()
    setCurrentLogin('')
  }
  const back = () => {
    goBack?.()
    setCurrentLogin('')
  }

  return (
    <>
      <Header
        className="z-10 w-full bg-white p-6"
        title="Select Wallet"
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

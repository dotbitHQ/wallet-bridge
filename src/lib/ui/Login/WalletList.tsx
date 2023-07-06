import {
  createTips,
  Header,
  ImTokenIcon,
  ITokenIcon,
  MetaMaskIcon,
  OneKeyIcon,
  SwapChildProps,
  TokenPocketIcon,
  TronLinkIcon,
  TrustWalletIcon,
} from '../../components'
import { WalletProtocol } from '../../constant'
import clsx from 'clsx'
import { ReactNode, useContext, useMemo, useState } from 'react'
import { WalletItem } from '../../components/WalletItem'
import { snapshot } from 'valtio'
import handleError from '../../utils/handleError'
import { loginCacheState, useLoginCacheState } from '../../store/loginCache'
import { WalletSDKContext } from '../ConnectWallet'
import { useSimpleRouter } from '../../components/SimpleRouter'

interface IWallet {
  icon: ReactNode
  name: string
  protocol: WalletProtocol[]
}

export const WalletList = ({ transitionRef, transitionStyle }: SwapChildProps) => {
  const walletSDK = useContext(WalletSDKContext)!
  const router = useSimpleRouter()!
  const goBack = router.goBack
  const onClose = router.onClose
  const [currentLogin, setCurrentLogin] = useState('')
  const { loginCacheSnap } = useLoginCacheState()

  const wallets = useMemo<IWallet[]>(() => {
    return [
      {
        icon: <MetaMaskIcon className="h-10 w-10"></MetaMaskIcon>,
        name: 'MetaMask',
        protocol: [WalletProtocol.metaMask],
      },
      {
        icon: <TrustWalletIcon className="h-10 w-10"></TrustWalletIcon>,
        name: 'TrustWallet',
        protocol: [WalletProtocol.metaMask],
      },
      {
        icon: <ImTokenIcon className="h-10 w-10"></ImTokenIcon>,
        name: 'imToken',
        protocol: [WalletProtocol.metaMask, WalletProtocol.tronLink],
      },
      {
        icon: <TokenPocketIcon className="h-10 w-10"></TokenPocketIcon>,
        name: 'TokenPocket',
        protocol: [WalletProtocol.metaMask, WalletProtocol.tokenPocketUTXO, WalletProtocol.tronLink],
      },
      {
        icon: <OneKeyIcon className="h-10 w-10"></OneKeyIcon>,
        name: 'OneKey',
        protocol: [WalletProtocol.metaMask],
      },
      {
        icon: <ITokenIcon className="h-10 w-10"></ITokenIcon>,
        name: 'iToken',
        protocol: [WalletProtocol.metaMask],
      },
      {
        icon: <TronLinkIcon className="h-10 w-10"></TronLinkIcon>,
        name: 'TronLink',
        protocol: [WalletProtocol.tronLink],
      },
    ]
  }, [])

  const showWallets = useMemo(() => {
    const { protocol } = loginCacheSnap
    if (protocol) {
      return wallets.filter((wallet) => {
        return wallet.protocol.includes(protocol)
      })
    }
    return wallets
  }, [loginCacheSnap, wallets])

  const onLogin = async (wallet: IWallet) => {
    const { name } = wallet
    if (currentLogin) {
      return
    }

    try {
      setCurrentLogin(name)
      const { protocol, coinType } = snapshot(loginCacheState)
      if (protocol && coinType) {
        await walletSDK.init({
          protocol,
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
        <ul>
          {showWallets.map((wallet, index) => {
            return (
              <WalletItem
                key={wallet.name}
                className={clsx('mt-2', { 'mb-6': index === showWallets.length - 1 })}
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

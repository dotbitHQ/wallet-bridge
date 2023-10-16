import {
  createTips,
  Header,
  SwapChildProps,
  Button,
  ButtonSize,
  ButtonShape,
  Alert,
  AlertType,
  NoticeIcon,
  ButtonVariant,
  FaceIcon,
  ArrowLeftIcon,
} from '../../components'
import { CoinType, CustomChain } from '../../constant'
import { useWalletState } from '../../store'
import { ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import handleError from '../../utils/handleError'
import { WalletSDKContext } from '../ConnectWallet'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { checkWebAuthnSupport } from '../../utils'
import clsx from 'clsx'
import EthIcon from './icon/eth-icon.svg'
import BscIcon from './icon/bsc-icon.svg'
import PolygonIcon from './icon/polygon-icon.svg'
import TronIcon from './icon/tron-icon.svg'
import DogecoinIcon from './icon/dogecoin-icon.svg'
import TorusIcon from './icon/torus-icon.svg'

interface IChain {
  icon: ReactNode
  name: CustomChain
  tag?: ReactNode
  coinType: CoinType
}

const passkey: IChain = {
  icon: undefined,
  name: CustomChain.passkey,
  coinType: CoinType.ckb,
}

export const Connect = ({ transitionStyle, transitionRef }: SwapChildProps) => {
  const [currentLogin, setCurrentLogin] = useState('')
  const [isSupportWebAuthn, setIsSupportWebAuthn] = useState(true)
  const walletSDK = useContext(WalletSDKContext)!
  const router = useSimpleRouter()!
  const { walletSnap } = useWalletState()

  const showChainList = () => {
    if (currentLogin) {
      return
    }
    router?.goTo('ChainList')
  }
  const showAddressList = () => {
    router?.goTo('AddressList')
  }
  const onClose = router?.onClose

  const showPasskey = useMemo(() => {
    return (
      !walletSDK.onlyEth &&
      (walletSnap.customChains && walletSnap.customChains.length > 0
        ? walletSnap.customChains.includes(CustomChain.passkey)
        : true)
    )
  }, [walletSDK.onlyEth, walletSnap.customChains])

  useEffect(() => {
    checkWebAuthnSupport()
      .then((res) => {
        setIsSupportWebAuthn(res)
      })
      .catch((err) => {
        console.error(err)
        setIsSupportWebAuthn(false)
      })
  }, [])

  const onLogin = async (chain: IChain) => {
    const { name, coinType } = chain
    if (currentLogin) {
      return
    }

    try {
      setCurrentLogin(name)
      await walletSDK.init({
        coinType,
        walletName: name,
      })
      await walletSDK.connect()
      const { ckbAddresses, loggedInSelectAddress } = walletSnap
      if (name === CustomChain.passkey && ckbAddresses && ckbAddresses.length > 0 && loggedInSelectAddress) {
        showAddressList()
      } else {
        onClose()
      }
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
    onClose()
    setCurrentLogin('')
  }

  return (
    <>
      <Header
        className="z-10 w-full bg-white p-6"
        title="Connect"
        onClose={close}
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div className="w-full px-6 pb-6 pt-[76px]" style={transitionStyle} ref={transitionRef}>
        {showPasskey ? (
          <div className="flex flex-col items-center pt-[82px]">
            <Button
              className="w-[218px]"
              loading={currentLogin === passkey.name}
              disabled={!isSupportWebAuthn}
              variant={ButtonVariant.passkey}
              size={ButtonSize.super}
              shape={ButtonShape.round}
              onClick={async () => {
                await onLogin(passkey)
              }}
            >
              <span className="inline-flex items-center text-xl font-bold">
                {currentLogin === passkey.name ? null : <FaceIcon className="mr-1.5 h-6 w-6 text-white" />}
                Continue
              </span>
            </Button>
            <div className="mt-4 w-[216px] text-center text-sm font-normal text-font-tips">
              Most friendly and secure way base on Passkey.
            </div>
            <Alert
              className={clsx('mt-5', isSupportWebAuthn ? 'invisible' : 'visible')}
              type={AlertType.warning}
              icon={<NoticeIcon className="h-[18px] w-[18px] text-[#FFB02E]"></NoticeIcon>}
            >
              This device or browser unsupported. Try connect by social or wallet.
            </Alert>
          </div>
        ) : null}
        <div
          className={clsx(
            'mt-11 box-border flex h-[52px] cursor-pointer items-center justify-between rounded-2xl border border-[#B6C4D966] px-4 py-2 hover:bg-secondary active:bg-secondary-active',
            { 'cursor-no-drop': !!currentLogin },
          )}
          onClick={showChainList}
        >
          <span className="text-base font-bold">Other wallets</span>
          <span className="inline-flex items-center">
            <span className="relative mr-1 inline-flex">
              <img
                className="relative right-[-40px] h-6 w-6 rounded-full border-2 border-white bg-white"
                src={EthIcon}
                alt="ETH"
              />
              <img
                className="relative right-[-32px] h-6 w-6 rounded-full border-2 border-white bg-white"
                src={BscIcon}
                alt="BSC"
              />
              <img
                className="relative right-[-24px] h-6 w-6 rounded-full border-2 border-white bg-white"
                src={PolygonIcon}
                alt="Polygon"
              />
              <img
                className="relative right-[-16px] h-6 w-6 rounded-full border-2 border-white bg-white"
                src={TronIcon}
                alt="Tron"
              />
              <img
                className="relative right-[-8px] h-6 w-6 rounded-full border-2 border-white bg-white"
                src={DogecoinIcon}
                alt="Dogecoin"
              />
              <img className="z-10 h-6 w-6 rounded-full border-2 border-white bg-white" src={TorusIcon} alt="Torus" />
            </span>
            <ArrowLeftIcon className="h-2.5 w-2.5 rotate-180 text-font-secondary"></ArrowLeftIcon>
          </span>
        </div>
      </div>
    </>
  )
}
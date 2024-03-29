import {
  Alert,
  AlertType,
  ArrowLeftIcon,
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
  createTips,
  FaceIcon,
  Header,
  NoticeIcon,
  SwapChildProps,
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
import { t } from '@lingui/macro'
import { TorusList } from '../../components/TorusList'
import DeviceBg from '../LoggedIn/bg/device.svg'

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
    // eslint-disable-next-line lingui/no-unlocalized-strings
    router?.goTo('ChainList')
  }
  const showAddressList = () => {
    // eslint-disable-next-line lingui/no-unlocalized-strings
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

  const showWallets = useMemo(() => {
    const list = walletSnap.customChains?.filter((chain: CustomChain) => chain !== CustomChain.passkey)
    return (
      walletSDK.onlyEth ||
      (walletSnap.customChains && walletSnap.customChains.length > 0 ? list?.length && list?.length > 0 : true)
    )
  }, [walletSDK.onlyEth, walletSnap.customChains])

  const isPadge = useMemo(() => {
    if (walletSnap.customChains) {
      return (
        walletSnap.customChains.length === 2 &&
        walletSnap.customChains.includes(CustomChain.passkey) &&
        walletSnap.customChains.includes(CustomChain.torus)
      )
    }
    return false
  }, [walletSnap.customChains])

  useEffect(() => {
    checkWebAuthnSupport()
      .then((res) => {
        setIsSupportWebAuthn(res)
      })
      .catch(() => {
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
    }
  }

  const close = () => {
    onClose()
    setCurrentLogin('')
  }

  const viewPasskeyDocs = () => {
    window.open('https://developer.apple.com/passkeys/')
  }

  return (
    <>
      {isPadge && <img className="absolute top-0 w-full-4px rounded-t-[32px]" src={DeviceBg} alt="" />}
      <Header
        className="z-10 mt-0.5 w-full-4px p-6 pb-0"
        title={t`Request Permission`}
        onClose={close}
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div
        className={clsx('relative w-full px-6 pb-6', isPadge ? 'pt-[46px]' : 'pt-[76px]')}
        style={transitionStyle}
        ref={transitionRef}
      >
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
                {t`Continue`}
              </span>
            </Button>
            <div className="mt-4 w-[216px] text-center text-sm font-normal text-font-tips">
              {t`Most friendly and secure way based on`}{' '}
              <span
                className="cursor-pointer border-b border-dashed border-black hover:opacity-70"
                onClick={viewPasskeyDocs}
              >
                {t`Passkey`}
              </span>
              .
            </div>
            <Alert
              className={clsx('mt-5', isSupportWebAuthn ? 'invisible' : 'visible')}
              type={AlertType.warning}
              icon={<NoticeIcon className="h-[18px] w-[18px] text-[#FFB02E]"></NoticeIcon>}
            >
              {t`This device or browser unsupported. Try connect by social or wallet.`}
            </Alert>
          </div>
        ) : null}
        {showWallets ? (
          isPadge ? (
            <TorusList
              className="mt-6"
              currentLogin={currentLogin}
              onClick={async () => {
                await onLogin({ icon: undefined, name: CustomChain.torus, coinType: CoinType.eth })
              }}
            />
          ) : (
            <div
              className={clsx(
                'mt-11 box-border flex h-[52px] cursor-pointer items-center justify-between rounded-2xl border border-[#B6C4D966] px-4 py-2 hover:bg-secondary active:bg-secondary-active',
                { 'cursor-no-drop': !!currentLogin },
              )}
              onClick={showChainList}
            >
              <span className="text-base font-bold">{t`Continue with wallets`}</span>
              <span className="inline-flex items-center">
                <span className="relative mr-1 inline-flex w-[102px]">
                  <img className="h-6 w-6 rounded-full border-2 border-white bg-white" src={EthIcon} alt="ETH" />
                  <img
                    className="absolute left-[16px] h-6 w-6 rounded-full border-2 border-white bg-white"
                    src={BscIcon}
                    alt="BSC"
                  />
                  <img
                    className="absolute left-[32px] h-6 w-6 rounded-full border-2 border-white bg-white"
                    src={PolygonIcon}
                    // eslint-disable-next-line lingui/no-unlocalized-strings
                    alt="Polygon"
                  />
                  <img
                    className="absolute left-[48px] h-6 w-6 rounded-full border-2 border-white bg-white"
                    src={TronIcon}
                    // eslint-disable-next-line lingui/no-unlocalized-strings
                    alt="Tron"
                  />
                  <img
                    className="absolute left-[64px] h-6 w-6 rounded-full border-2 border-white bg-white"
                    src={DogecoinIcon}
                    // eslint-disable-next-line lingui/no-unlocalized-strings
                    alt="Dogecoin"
                  />
                  <img
                    className="absolute left-[80px] h-6 w-6 rounded-full border-2 border-white bg-white"
                    src={TorusIcon}
                    // eslint-disable-next-line lingui/no-unlocalized-strings
                    alt="Torus"
                  />
                </span>
                <ArrowLeftIcon className="h-2.5 w-2.5 rotate-180 text-font-secondary"></ArrowLeftIcon>
              </span>
            </div>
          )
        ) : null}
      </div>
    </>
  )
}

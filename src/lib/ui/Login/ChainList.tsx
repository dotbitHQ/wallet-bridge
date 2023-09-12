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
} from '../../components'
import { CoinType, CustomChain } from '../../constant'
import { useWalletState } from '../../store'
import { ChainItem } from '../../components/ChainItem'
import { ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import handleError from '../../utils/handleError'
import { setLoginCacheState } from '../../store/loginCache'
import { WalletSDKContext } from '../ConnectWallet'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { checkWebAuthnSupport } from '../../utils'
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

interface IChainList {
  label: string
  list: IChain[]
}

const passkey: IChain = {
  icon: undefined,
  name: CustomChain.passkey,
  coinType: CoinType.ckb,
}

const eth: IChain = {
  icon: <img className="h-10 w-10" src={EthIcon} alt="ETH" />,
  name: CustomChain.eth,
  coinType: CoinType.eth,
}

const bsc: IChain = {
  icon: <img className="h-10 w-10" src={BscIcon} alt="BSC" />,
  name: CustomChain.bsc,
  coinType: CoinType.bsc,
}

const polygon: IChain = {
  icon: <img className="h-10 w-10" src={PolygonIcon} alt="Polygon" />,
  name: CustomChain.polygon,
  coinType: CoinType.matic,
}

const tron: IChain = {
  icon: <img className="h-10 w-10" src={TronIcon} alt="Tron" />,
  name: CustomChain.tron,
  coinType: CoinType.trx,
}

const doge: IChain = {
  icon: <img className="h-10 w-10" src={DogecoinIcon} alt="Dogecoin" />,
  name: CustomChain.doge,
  coinType: CoinType.doge,
}

const torus: IChain = {
  icon: <img className="h-10 w-10" src={TorusIcon} alt="Torus" />,
  name: CustomChain.torus,
  coinType: CoinType.eth,
}

export const ChainList = ({ transitionStyle, transitionRef }: SwapChildProps) => {
  const [currentLogin, setCurrentLogin] = useState('')
  const [isSupportWebAuthn, setIsSupportWebAuthn] = useState(true)
  const walletSDK = useContext(WalletSDKContext)!
  const router = useSimpleRouter()!
  const { walletSnap } = useWalletState()

  const showWalletList = () => {
    router?.goTo('WalletList')
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

  const chains: IChainList[] = useMemo(() => {
    const customChains = walletSnap.customChains
    let walletList: IChain[] = [eth, bsc, polygon, tron, doge]
    let socialList: IChain[] = [torus]

    const list = []

    if (customChains && customChains.length > 0) {
      walletList = walletList.filter((item) => {
        return customChains.includes(item.name)
      })
      socialList = socialList.filter((item) => {
        return customChains.includes(item.name)
      })
      if (walletList.length > 0) {
        list.push({
          label: 'by Wallet',
          list: walletList.filter((item) => {
            return customChains.includes(item.name)
          }),
        })
      }
      if (socialList.length > 0) {
        list.push({
          label: 'by Social',
          list: socialList.filter((item) => {
            return customChains.includes(item.name)
          }),
        })
      }
    } else {
      list.push(
        {
          label: 'by Wallet',
          list: walletList,
        },
        {
          label: 'by Social',
          list: socialList,
        },
      )
    }

    const onlyEth = [
      {
        label: 'by Wallet',
        list: [eth],
      },
    ]
    return walletSDK.onlyEth ? onlyEth : list
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

  const selectChain = (chain: IChain) => {
    const { coinType } = chain
    setLoginCacheState({
      coinType,
    })
    showWalletList()
  }

  const onLogin = async (chain: IChain) => {
    const { name, coinType } = chain
    if (currentLogin) {
      return
    }

    if (![CustomChain.torus, CustomChain.passkey].includes(name)) {
      selectChain(chain)
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
          <div className="mb-6 flex flex-col items-center py-4">
            <Button
              className="w-40"
              loading={currentLogin === passkey.name}
              disabled={!isSupportWebAuthn}
              variant={ButtonVariant.passkey}
              size={ButtonSize.large}
              shape={ButtonShape.round}
              onClick={async () => {
                await onLogin(passkey)
              }}
            >
              <span className="font-bold">by Passkey</span>
            </Button>
            <div className="mt-2 text-font-secondary">Seedless but still decentralized</div>
            {isSupportWebAuthn ? null : (
              <Alert
                className="mt-2"
                type={AlertType.warning}
                icon={<NoticeIcon className="h-[18px] w-[18px] text-[#FFB02E]"></NoticeIcon>}
              >
                This device or browser unsupported. Try connect by social or wallet.
              </Alert>
            )}
          </div>
        ) : null}
        <ul className="flex flex-col gap-6">
          {chains?.map((item, index) => {
            return (
              <div key={`container-${index}`}>
                <li key={`label-${index}`} className="mx-2 font-bold text-font-secondary">
                  {item.label}
                </li>
                <div className="mt-2 overflow-hidden rounded-2xl border border-[#B6C4D966]">
                  {item.list?.map((chain, i) => {
                    return (
                      <div key={chain.name}>
                        <ChainItem
                          {...chain}
                          currentLogin={currentLogin}
                          onClick={async () => {
                            await onLogin(chain)
                          }}
                        ></ChainItem>
                        {item.list.length > 2 && i !== item.list.length - 1 ? (
                          <hr className="mx-5 border-[#B6C4D966]" />
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </ul>
      </div>
    </>
  )
}

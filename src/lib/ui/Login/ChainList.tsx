import {
  BscIcon,
  createTips,
  DogecoinIcon,
  EthIcon,
  Header,
  PolygonIcon,
  TorusIcon,
  SwapChildProps,
  TronIcon,
  Button,
  ButtonSize,
  ButtonShape,
  Alert,
  AlertType,
  NoticeIcon,
  ButtonVariant,
} from '../../components'
import { CoinType, CustomChain, WalletProtocol } from '../../constant'
import { useWalletState, walletState } from '../../store'
import { ChainItem } from '../../components/ChainItem'
import { ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import handleError from '../../utils/handleError'
import { snapshot } from 'valtio'
import { setLoginCacheState } from '../../store/loginCache'
import { WalletSDKContext } from '../ConnectWallet'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { checkWebAuthnSupport } from '../../utils'

interface IChain {
  icon: ReactNode
  name: CustomChain
  tag?: ReactNode
  coinType: CoinType
  protocol: WalletProtocol
}

interface IChainList {
  label: string
  list: IChain[]
}

const passkey: IChain = {
  icon: undefined,
  name: CustomChain.passkey,
  coinType: CoinType.ckb,
  protocol: WalletProtocol.webAuthn,
}

const eth: IChain = {
  icon: <EthIcon className="h-10 w-10"></EthIcon>,
  name: CustomChain.eth,
  coinType: CoinType.eth,
  protocol: WalletProtocol.metaMask,
}

const bsc: IChain = {
  icon: <BscIcon className="h-10 w-10"></BscIcon>,
  name: CustomChain.bsc,
  coinType: CoinType.bsc,
  protocol: WalletProtocol.metaMask,
}

const polygon: IChain = {
  icon: <PolygonIcon className="h-10 w-10"></PolygonIcon>,
  name: CustomChain.polygon,
  coinType: CoinType.matic,
  protocol: WalletProtocol.metaMask,
}

const tron: IChain = {
  icon: <TronIcon className="h-10 w-10"></TronIcon>,
  name: CustomChain.tron,
  coinType: CoinType.trx,
  protocol: WalletProtocol.tronLink,
}

const doge: IChain = {
  icon: <DogecoinIcon className="h-10 w-10"></DogecoinIcon>,
  name: CustomChain.doge,
  coinType: CoinType.doge,
  protocol: WalletProtocol.tokenPocketUTXO,
}

const torus: IChain = {
  icon: <TorusIcon className="h-10 w-10"></TorusIcon>,
  name: CustomChain.torus,
  coinType: CoinType.eth,
  protocol: WalletProtocol.torus,
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

  // const createHardwareWalletTips = (chain: IChain) => {
  //   createTips({
  //     title: 'Tips',
  //     content: (
  //       <div className="text-center">
  //         <div className="mb-3 font-medium text-danger-hover">
  //           DO NOT use .bit with ANY hardware wallet except Ledger and the latest version of OneKey!
  //         </div>
  //         <div>Since most hardware wallets have incompatibility problems.</div>
  //       </div>
  //     ),
  //     confirmBtnText: 'Understand, Continue',
  //     onConfirm: () => {
  //       closeHardwareWalletTips(chain)
  //     },
  //     onClose: () => {
  //       closeHardwareWalletTips(chain)
  //     },
  //   })
  // }

  // const closeHardwareWalletTips = (chain: IChain) => {
  //   setWalletState({
  //     hardwareWalletTipsShow: false,
  //   })
  //   void onLogin(chain)
  // }

  const selectChain = (chain: IChain) => {
    const { protocol, coinType } = chain
    setLoginCacheState({
      protocol,
      coinType,
    })
    showWalletList()
  }

  const onLogin = async (chain: IChain) => {
    const { name, protocol, coinType } = chain
    if (currentLogin) {
      return
    }

    // const { hardwareWalletTipsShow } = snapshot(walletState)
    // if (hardwareWalletTipsShow && ![WalletProtocol.torus, WalletProtocol.webAuthn].includes(protocol)) {
    //   createHardwareWalletTips(chain)
    //   return
    // }

    if (![WalletProtocol.torus, WalletProtocol.webAuthn].includes(protocol)) {
      selectChain(chain)
      return
    }

    try {
      setCurrentLogin(name)
      await walletSDK.init({
        protocol,
        coinType,
      })
      await walletSDK.connect()
      const { ckbAddresses, loggedInSelectAddress } = snapshot(walletState)
      if (protocol === WalletProtocol.webAuthn && ckbAddresses && ckbAddresses.length > 0 && loggedInSelectAddress) {
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
                This device or browser unsupported. Try connect by social or chain.
              </Alert>
            )}
          </div>
        ) : null}
        <ul className="flex flex-col gap-6">
          {chains.map((item, index) => {
            return (
              <div key={`container-${index}`}>
                <li key={`label-${index}`} className="mx-2 font-bold text-font-secondary">
                  {item.label}
                </li>
                <div className="mt-2 overflow-hidden rounded-2xl border border-[#B6C4D966]">
                  {item.list.map((chain, i) => {
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

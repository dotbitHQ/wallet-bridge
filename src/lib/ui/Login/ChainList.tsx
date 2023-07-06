import {
  BscIcon,
  createTips,
  DeviceIcon,
  DogecoinIcon,
  EthIcon,
  Header,
  PolygonIcon,
  TorusIcon,
  SwapChildProps,
  TronIcon,
} from '../../components'
import { CoinType, WalletProtocol } from '../../constant'
import { setWalletState, walletState } from '../../store'
import { Tag, TagVariant } from '../../components/Tag'
import { ChainItem } from '../../components/ChainItem'
import clsx from 'clsx'
import { ReactNode, useContext, useState } from 'react'
import handleError from '../../utils/handleError'
import { snapshot } from 'valtio'
import { setLoginCacheState } from '../../store/loginCache'
import { WalletSDKContext } from '../ConnectWallet'
import { useSimpleRouter } from '../../components/SimpleRouter'

interface IChain {
  icon: ReactNode
  name: string
  tag?: ReactNode
  coinType: CoinType
  protocol: WalletProtocol
}

interface IChainList {
  label: string
  list: IChain[]
}

export const ChainList = ({ transitionStyle, transitionRef }: SwapChildProps) => {
  const [currentLogin, setCurrentLogin] = useState('')
  const walletSDK = useContext(WalletSDKContext)!
  const router = useSimpleRouter()!
  const showWalletList = () => {
    router?.goTo('WalletList')
  }
  const showAddressList = () => {
    router?.goTo('AddressList')
  }
  const onClose = router?.onClose

  const chains: IChainList[] = [
    {
      label: 'by Device',
      list: [
        {
          icon: <DeviceIcon className="h-10 w-10"></DeviceIcon>,
          name: 'This Device',
          tag: <Tag variant={TagVariant.primary}>Recommended</Tag>,
          coinType: CoinType.ckb,
          protocol: WalletProtocol.webAuthn,
        },
      ],
    },
    {
      label: 'by Wallet',
      list: [
        {
          icon: <EthIcon className="h-10 w-10"></EthIcon>,
          name: 'ETH',
          coinType: CoinType.eth,
          protocol: WalletProtocol.metaMask,
        },
        {
          icon: <BscIcon className="h-10 w-10"></BscIcon>,
          name: 'BSC',
          coinType: CoinType.bsc,
          protocol: WalletProtocol.metaMask,
        },
        {
          icon: <PolygonIcon className="h-10 w-10"></PolygonIcon>,
          name: 'Polygon',
          coinType: CoinType.matic,
          protocol: WalletProtocol.metaMask,
        },
        {
          icon: <TronIcon className="h-10 w-10"></TronIcon>,
          name: 'Tron',
          coinType: CoinType.trx,
          protocol: WalletProtocol.tronLink,
        },
        {
          icon: <DogecoinIcon className="h-10 w-10"></DogecoinIcon>,
          name: 'Dogecoin',
          coinType: CoinType.doge,
          protocol: WalletProtocol.tokenPocketUTXO,
        },
      ],
    },
    {
      label: 'by Social',
      list: [
        {
          icon: <TorusIcon className="h-10 w-10"></TorusIcon>,
          name: 'Torus',
          coinType: CoinType.eth,
          protocol: WalletProtocol.torus,
        },
      ],
    },
  ]

  const createHardwareWalletTips = (chain: IChain) => {
    createTips({
      title: 'Tips',
      content: (
        <div className="text-center">
          <div className="mb-3 font-medium text-danger-hover">
            DO NOT use .bit with ANY hardware wallet except Ledger and the latest version of OneKey!
          </div>
          <div>Since most hardware wallets have incompatibility problems.</div>
        </div>
      ),
      confirmBtnText: 'Understand, Continue',
      onConfirm: () => {
        closeHardwareWalletTips(chain)
      },
      onClose: () => {
        closeHardwareWalletTips(chain)
      },
    })
  }

  const closeHardwareWalletTips = (chain: IChain) => {
    setWalletState({
      hardwareWalletTipsShow: false,
    })
    void onLogin(chain)
  }

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

    const { hardwareWalletTipsShow } = snapshot(walletState)
    if (hardwareWalletTipsShow) {
      createHardwareWalletTips(chain)
      return
    }

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
      const { ckbAddresses } = snapshot(walletState)
      if (protocol === WalletProtocol.webAuthn && ckbAddresses && ckbAddresses.length > 0) {
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
        onClose={close}
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div className="w-full px-6 pb-6 pt-[76px]" style={transitionStyle} ref={transitionRef}>
        <ul>
          {chains.map((item, index) => {
            return (
              <div key={`container-${index}`}>
                <li key={`label-${index}`} className="mx-2 font-bold text-font-secondary">
                  {item.label}
                </li>
                {item.list.map((chain, index) => {
                  return (
                    <ChainItem
                      key={chain.name}
                      className={clsx('mt-2', { 'mb-6': index === item.list.length - 1 })}
                      {...chain}
                      currentLogin={currentLogin}
                      onClick={async () => {
                        await onLogin(chain)
                      }}
                    ></ChainItem>
                  )
                })}
              </div>
            )
          })}
        </ul>
      </div>
    </>
  )
}

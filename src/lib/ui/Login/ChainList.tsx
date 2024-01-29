import { createTips, Header, SwapChildProps } from '../../components'
import { CoinType, CustomChain } from '../../constant'
import { useWalletState } from '../../store'
import { ChainItem } from '../../components/ChainItem'
import { ReactNode, useContext, useMemo, useState } from 'react'
import handleError from '../../utils/handleError'
import { setLoginCacheState } from '../../store/loginCache'
import { WalletSDKContext } from '../ConnectWallet'
import { useSimpleRouter } from '../../components/SimpleRouter'
import EthIcon from './icon/eth-icon.svg'
import BscIcon from './icon/bsc-icon.svg'
import PolygonIcon from './icon/polygon-icon.svg'
import TronIcon from './icon/tron-icon.svg'
import DogecoinIcon from './icon/dogecoin-icon.svg'
import TorusIcon from './icon/torus-icon.svg'
import { t } from '@lingui/macro'

interface IChain {
  icon: ReactNode
  name: CustomChain
  tag?: ReactNode
  coinType: CoinType
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
  // eslint-disable-next-line lingui/no-unlocalized-strings
  icon: <img className="h-10 w-10" src={PolygonIcon} alt="Polygon" />,
  name: CustomChain.polygon,
  coinType: CoinType.matic,
}

const tron: IChain = {
  // eslint-disable-next-line lingui/no-unlocalized-strings
  icon: <img className="h-10 w-10" src={TronIcon} alt="Tron" />,
  name: CustomChain.tron,
  coinType: CoinType.trx,
}

const doge: IChain = {
  // eslint-disable-next-line lingui/no-unlocalized-strings
  icon: <img className="h-10 w-10" src={DogecoinIcon} alt="Dogecoin" />,
  name: CustomChain.doge,
  coinType: CoinType.doge,
}

const torus: IChain = {
  // eslint-disable-next-line lingui/no-unlocalized-strings
  icon: <img className="h-10 w-10" src={TorusIcon} alt="Torus" />,
  name: CustomChain.torus,
  coinType: CoinType.eth,
}

export const ChainList = ({ transitionStyle, transitionRef }: SwapChildProps) => {
  const [currentLogin, setCurrentLogin] = useState('')
  const walletSDK = useContext(WalletSDKContext)!
  const { goBack, onClose, goTo } = useSimpleRouter()!
  const { walletSnap } = useWalletState()

  const showWalletList = () => {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    goTo('WalletList')
  }

  const chains: IChain[] = useMemo(() => {
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
        list.push(...walletList)
      }
      if (socialList.length > 0) {
        list.push(...socialList)
      }
    } else {
      list.push(...walletList, ...socialList)
    }

    const onlyEth = [eth]
    return walletSDK.onlyEth ? onlyEth : list
  }, [walletSDK.onlyEth, walletSnap.customChains])

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

    if (![CustomChain.torus].includes(name)) {
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
      onClose()
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

  const back = () => {
    goBack?.()
    setCurrentLogin('')
  }

  return (
    <>
      <Header
        className="z-10 mt-0.5 w-full-4px bg-white p-6"
        title={t`Other Wallets`}
        onClose={close}
        goBack={back}
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div className="w-full px-6 pb-6 pt-[76px]" style={transitionStyle} ref={transitionRef}>
        <ul className="flex flex-col gap-2">
          {chains?.map((chain) => {
            return (
              <ChainItem
                key={chain.name}
                {...chain}
                currentLogin={currentLogin}
                onClick={async () => {
                  await onLogin(chain)
                }}
              ></ChainItem>
            )
          })}
        </ul>
      </div>
    </>
  )
}

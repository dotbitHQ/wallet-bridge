import { proxy, useSnapshot } from 'valtio'
import { CoinType, WalletProtocol } from '../constant'

interface WalletState {
  protocol?: WalletProtocol
  address?: string
  coinType?: CoinType
  hardwareWalletTipsShow?: boolean
}

const WalletStateKey = 'WalletState'

const walletStateLocalStorage = localStorage.getItem(WalletStateKey)

const localWalletState = walletStateLocalStorage
  ? JSON.parse(walletStateLocalStorage)
  : {
      protocol: undefined,
      address: undefined,
      coinType: undefined,
      hardwareWalletTipsShow: true,
    }

export const walletState = proxy<WalletState>(localWalletState)

export const setWalletState = ({ protocol, address, coinType, hardwareWalletTipsShow }: WalletState) => {
  if (protocol) {
    walletState.protocol = protocol
  }
  if (address) {
    walletState.address = address
  }
  if (coinType) {
    walletState.coinType = coinType
  }
  if (hardwareWalletTipsShow !== undefined) {
    walletState.hardwareWalletTipsShow = hardwareWalletTipsShow
  }
  localStorage.setItem(WalletStateKey, JSON.stringify(walletState))
}

export const resetWalletState = () => {
  walletState.protocol = undefined
  walletState.coinType = undefined
  walletState.address = undefined
  localStorage.setItem(WalletStateKey, JSON.stringify(walletState))
}

export function useWalletState() {
  const walletSnap = useSnapshot(walletState)
  return { walletSnap }
}

import { proxy, useSnapshot } from 'valtio'
import { CoinType, WalletProtocol } from '../constant'
import { IDeviceData } from 'connect-did-sdk'
import { merge } from 'lodash-es'

interface WalletState {
  protocol?: WalletProtocol
  address?: string
  coinType?: CoinType
  hardwareWalletTipsShow?: boolean
  deviceData?: IDeviceData
  ckbAddresses?: string[]
  enableAuthorize?: boolean
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
      deviceData: undefined,
      ckbAddresses: [],
      enableAuthorize: false,
    }

export const walletState = proxy<WalletState>(localWalletState)

export const setWalletState = ({
  protocol,
  address,
  coinType,
  hardwareWalletTipsShow,
  deviceData,
  ckbAddresses,
  enableAuthorize,
}: WalletState) => {
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
  if (deviceData) {
    walletState.deviceData = merge(walletState.deviceData, deviceData)
  }
  if (ckbAddresses) {
    walletState.ckbAddresses = ckbAddresses
  }
  if (enableAuthorize !== undefined) {
    walletState.enableAuthorize = enableAuthorize
  }
  localStorage.setItem(WalletStateKey, JSON.stringify(walletState))
}

export const resetWalletState = () => {
  walletState.protocol = undefined
  walletState.coinType = undefined
  walletState.address = undefined
  walletState.deviceData = undefined
  walletState.ckbAddresses = []
  walletState.enableAuthorize = false
  localStorage.setItem(WalletStateKey, JSON.stringify(walletState))
}

export function useWalletState() {
  const walletSnap = useSnapshot(walletState)
  return { walletSnap }
}

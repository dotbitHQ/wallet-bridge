import { proxy, snapshot, useSnapshot } from 'valtio'
import { CoinType, WalletProtocol, WebAuthnApi, WebAuthnTestApi } from '../constant'
import { IDeviceData } from 'connect-did-sdk'
import { merge } from 'lodash-es'
import Axios from 'axios'
import errno from '../constant/errno'
import CustomError from '../utils/CustomError'

export interface WalletState {
  protocol?: WalletProtocol
  address?: string
  coinType?: CoinType
  hardwareWalletTipsShow?: boolean
  deviceData?: IDeviceData
  ckbAddresses?: string[]
  deviceList?: string[]
  isTestNet?: boolean
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
      deviceList: [],
      isTestNet: false,
    }

export const walletState = proxy<WalletState>(localWalletState)

export async function getAuthorizeInfo() {
  const { protocol, isTestNet, address } = snapshot(walletState)
  if (protocol === WalletProtocol.webAuthn) {
    const api = isTestNet ? WebAuthnTestApi : WebAuthnApi
    const res = await Axios.post(`${api}/v1/webauthn/authorize-info`, {
      ckb_address: address,
    })
    if (res.data?.err_no === errno.success) {
      setWalletState({
        deviceList: res.data.data.ckb_address,
      })
    } else {
      throw new CustomError(res.data?.err_no, res.data?.err_msg)
    }
  }
}

export async function getMastersAddress() {
  const { protocol, isTestNet, deviceData } = snapshot(walletState)
  if (protocol === WalletProtocol.webAuthn) {
    const api = isTestNet ? WebAuthnTestApi : WebAuthnApi

    const mastersAddress = await Axios.post(`${api}/v1/webauthn/get-masters-addr`, {
      cid: deviceData?.credential.rawId,
    })
    if (mastersAddress.data?.err_no === errno.success) {
      setWalletState({
        ckbAddresses: mastersAddress.data.data.ckb_address,
      })
    } else {
      throw new CustomError(mastersAddress.data?.err_no, mastersAddress.data?.err_msg)
    }
  }
}

export const setWalletState = ({
  protocol,
  address,
  coinType,
  hardwareWalletTipsShow,
  deviceData,
  ckbAddresses,
  deviceList,
  isTestNet,
}: WalletState) => {
  if (protocol) {
    walletState.protocol = protocol
  }
  if (coinType) {
    walletState.coinType = coinType
  }
  if (address) {
    walletState.address = address
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
  if (deviceList) {
    walletState.deviceList = deviceList
  }
  if (isTestNet !== undefined) {
    walletState.isTestNet = isTestNet
  }
  localStorage.setItem(WalletStateKey, JSON.stringify(walletState))
}

export const resetWalletState = () => {
  walletState.protocol = undefined
  walletState.coinType = undefined
  walletState.address = undefined
  walletState.deviceData = undefined
  walletState.ckbAddresses = []
  walletState.deviceList = []
  walletState.isTestNet = false
  localStorage.setItem(WalletStateKey, JSON.stringify(walletState))
}

export function useWalletState() {
  const walletSnap = useSnapshot(walletState)
  return { walletSnap }
}

export function getWalletState() {
  const walletSnap = snapshot(walletState)
  return { walletSnap }
}

import { proxy, snapshot, useSnapshot } from 'valtio'
import { CoinType, CustomChain, CustomWallet, WalletProtocol, WebAuthnApi, WebAuthnTestApi } from '../constant'
import { IDeviceData } from 'connect-did-sdk'
import { merge } from 'lodash-es'
import Axios from 'axios'
import errno from '../constant/errno'
import CustomError from '../utils/CustomError'
import { checkPasskeysSupport } from '../utils'

export interface WalletState {
  protocol?: WalletProtocol
  address?: string
  coinType?: CoinType
  walletName?: string
  hardwareWalletTipsShow?: boolean
  deviceData?: IDeviceData
  ckbAddresses?: string[]
  masterNotes?: string
  deviceList?: ICKBAddressItem[]
  isTestNet?: boolean
  loggedInSelectAddress?: boolean
  canAddDevice?: boolean
  isSwitchAddress?: boolean
  iCloudPasskeySupport?: boolean
  customChains?: CustomChain[]
  customWallets?: CustomWallet[]
}

export interface ICKBAddressItem {
  address: string
  avatar?: number
  notes?: string
}

const WalletStateKey = 'WalletStateV1'

const walletStateLocalStorage = globalThis.localStorage ? globalThis.localStorage.getItem(WalletStateKey) : null

const localWalletState = walletStateLocalStorage
  ? JSON.parse(walletStateLocalStorage)
  : {
      protocol: undefined,
      address: undefined,
      coinType: undefined,
      walletName: undefined,
      hardwareWalletTipsShow: true,
      deviceData: undefined,
      ckbAddresses: [],
      masterNotes: undefined,
      deviceList: [],
      isTestNet: false,
      loggedInSelectAddress: true,
      canAddDevice: false,
      isSwitchAddress: false,
      iCloudPasskeySupport: false,
      customChains: [],
      customWallets: [],
    }

export const walletState = proxy<WalletState>({
  ...localWalletState,
  deviceList: localWalletState.deviceList?.map((i: ICKBAddressItem | string) =>
    typeof i === 'string' ? { address: i } : i,
  ),
})

async function fetchAuthorizeInfo(api: string, address: string) {
  const res = await Axios.post(`${api}/v1/webauthn/authorize-info`, {
    ckb_address: address,
  })

  if (res.data?.err_no !== errno.success) {
    throw new CustomError(res.data?.err_no, res.data?.err_msg)
  }

  return res.data.data
}

function setAuthorizeState(
  data: { can_authorize: number; ckb_address: ICKBAddressItem[]; master_notes?: string | undefined },
  address: string = '',
) {
  if (address) {
    setWalletState({
      address,
      masterNotes: data.master_notes,
      canAddDevice: data.can_authorize !== 0,
      deviceList: data.ckb_address,
    })
  } else {
    setWalletState({
      masterNotes: data.master_notes,
      canAddDevice: data.can_authorize !== 0,
      deviceList: data.ckb_address,
    })
  }
}

export async function getAuthorizeInfo({ detectAssets = false } = {}) {
  const { protocol, isTestNet, address, isSwitchAddress, ckbAddresses } = snapshot(walletState)

  if (protocol !== WalletProtocol.webAuthn || !address) return

  const api = isTestNet ? WebAuthnTestApi : WebAuthnApi

  const data = await fetchAuthorizeInfo(api, address)
  // eslint-disable-next-line
  if (data.can_authorize !== 0 || !detectAssets || isSwitchAddress || !(ckbAddresses && ckbAddresses.length > 0)) {
    setAuthorizeState(data)
    return
  }

  let isSetAddress = false

  for (const item of ckbAddresses) {
    const res = await fetchAuthorizeInfo(api, item)
    if (res.can_authorize !== 0) {
      isSetAddress = true
      setAuthorizeState(res, item)
      break
    }
  }

  if (!isSetAddress) {
    setAuthorizeState(data)
  }
}

export async function getMastersAddress() {
  const { protocol, isTestNet, deviceData } = snapshot(walletState)
  const cid = deviceData?.credential.rawId
  if (protocol === WalletProtocol.webAuthn && cid) {
    const api = isTestNet ? WebAuthnTestApi : WebAuthnApi

    const mastersAddress = await Axios.post(`${api}/v1/webauthn/get-masters-addr`, {
      cid,
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
  walletName,
  hardwareWalletTipsShow,
  deviceData,
  masterNotes,
  ckbAddresses,
  deviceList,
  isTestNet,
  loggedInSelectAddress,
  canAddDevice,
  isSwitchAddress,
  customChains,
  customWallets,
}: WalletState) => {
  if (protocol) {
    walletState.protocol = protocol
  }
  if (coinType) {
    walletState.coinType = coinType
  }
  if (walletName) {
    walletState.walletName = walletName
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
  if (masterNotes) {
    walletState.masterNotes = masterNotes
  }
  if (deviceList) {
    walletState.deviceList = deviceList
  }
  if (isTestNet !== undefined) {
    walletState.isTestNet = isTestNet
  }
  if (loggedInSelectAddress !== undefined) {
    walletState.loggedInSelectAddress = loggedInSelectAddress
  }
  if (canAddDevice !== undefined) {
    walletState.canAddDevice = canAddDevice
  }
  if (isSwitchAddress !== undefined) {
    walletState.isSwitchAddress = isSwitchAddress
  }
  if (customChains !== undefined) {
    walletState.customChains = customChains
  }
  if (customWallets !== undefined) {
    walletState.customWallets = customWallets
  }

  walletState.iCloudPasskeySupport = checkPasskeysSupport()
  globalThis.localStorage.setItem(WalletStateKey, JSON.stringify(walletState))
}

export const resetWalletState = () => {
  walletState.protocol = undefined
  walletState.coinType = undefined
  walletState.walletName = undefined
  walletState.address = undefined
  walletState.deviceData = undefined
  walletState.ckbAddresses = []
  walletState.masterNotes = undefined
  walletState.deviceList = []
  walletState.canAddDevice = false
  walletState.isSwitchAddress = false
  globalThis.localStorage.setItem(WalletStateKey, JSON.stringify(walletState))
}

export function useWalletState() {
  const walletSnap = useSnapshot(walletState)
  return { walletSnap }
}

export function getWalletState() {
  const walletSnap = snapshot(walletState)
  return { walletSnap }
}

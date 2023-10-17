import { proxy, snapshot, useSnapshot } from 'valtio'
import {
  CoinType,
  CustomChain,
  CustomWallet,
  DotbitAliasApi,
  DotbitAliasTestApi,
  WalletProtocol,
  WebAuthnApi,
  WebAuthnTestApi,
} from '../constant'
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
  masterDevice?: string
  deviceList?: ICKBAddressItem[]
  isTestNet?: boolean
  loggedInSelectAddress?: boolean
  canAddDevice?: boolean
  isSwitchAddress?: boolean
  iCloudPasskeySupport?: boolean
  customChains?: CustomChain[]
  customWallets?: CustomWallet[]
  alias?: string
}

export interface ICKBAddressItem {
  address: string
  device?: string
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
      masterDevice: undefined,
      deviceList: [],
      isTestNet: false,
      loggedInSelectAddress: true,
      canAddDevice: false,
      isSwitchAddress: false,
      iCloudPasskeySupport: false,
      customChains: [],
      customWallets: [],
      alias: '',
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
  data: {
    can_authorize: number
    ckb_address: ICKBAddressItem[]
    master_notes?: string | undefined
    master_device?: string | undefined
  },
  address: string = '',
) {
  const record: WalletState = {
    masterNotes: data.master_notes,
    masterDevice: data.master_device,
    canAddDevice: data.can_authorize !== 0,
    deviceList: data.ckb_address,
  }
  if (address) {
    record.address = address
    const { deviceData } = snapshot(walletState)
    if (deviceData?.ckbAddr === address) {
      record.deviceData = {
        ...deviceData,
        name: data.master_notes || deviceData.name,
        device: data.master_device || deviceData.device,
      }
    }
  }
  setWalletState(record)
}

export async function getAuthorizeInfo({ detectAssets = false } = {}) {
  const { protocol, isTestNet, address, isSwitchAddress, ckbAddresses } = snapshot(walletState)

  if (protocol !== WalletProtocol.webAuthn || !address) return

  const api = isTestNet ? WebAuthnTestApi : WebAuthnApi

  const data = await fetchAuthorizeInfo(api, address)
  // eslint-disable-next-line
  if (data.can_authorize !== 0 || !detectAssets || isSwitchAddress || !(ckbAddresses && ckbAddresses.length > 0)) {
    setAuthorizeState(data, address)
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
    setAuthorizeState(data, address)
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

export async function getDotbitAlias() {
  const { coinType, isTestNet, address } = snapshot(walletState)
  const api = isTestNet ? DotbitAliasTestApi : DotbitAliasApi

  const aliasInfo = await Axios.post(`${api}/v1/reverse/info`, {
    type: 'blockchain',
    key_info: { coin_type: coinType, key: address },
  })

  if (aliasInfo.data?.err_no === errno.success) {
    if (aliasInfo.data?.data?.is_valid === true) {
      setWalletState({
        alias: aliasInfo.data.data.account,
      })
    } else {
      setWalletState({
        alias: '',
      })
    }
  } else {
    throw new CustomError(aliasInfo.data?.err_no, aliasInfo.data?.err_msg)
  }
}

export async function backupDeviceData() {
  const { isTestNet, deviceData, address, masterNotes } = snapshot(walletState)
  if (masterNotes || deviceData?.ckbAddr !== address) {
    return
  }
  const api = isTestNet ? WebAuthnTestApi : WebAuthnApi
  const res = await fetch(`${api}/v1/webauthn/add-cid-info`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ckb_addr: deviceData?.ckbAddr,
      cid: deviceData?.credential.rawId,
      notes: deviceData?.name,
      device: deviceData?.device || deviceData?.name.split('-')[0],
    }),
  }).then(async (res) => await res.json())

  return res
}

export const setWalletState = (
  {
    protocol,
    address,
    coinType,
    walletName,
    hardwareWalletTipsShow,
    deviceData,
    masterNotes,
    masterDevice,
    ckbAddresses,
    deviceList,
    isTestNet,
    loggedInSelectAddress,
    canAddDevice,
    isSwitchAddress,
    customChains,
    customWallets,
    alias,
  }: WalletState,
  isSwitch = false,
) => {
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
  // reset
  if (isSwitch) {
    walletState.masterNotes = masterNotes
    walletState.masterDevice = masterDevice
  } else if (masterNotes) {
    walletState.masterNotes = masterNotes
  } else if (masterDevice) {
    walletState.masterDevice = masterDevice
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
  if (alias !== undefined) {
    walletState.alias = alias
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
  walletState.masterDevice = undefined
  walletState.deviceList = []
  walletState.canAddDevice = false
  walletState.isSwitchAddress = false
  walletState.alias = ''
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

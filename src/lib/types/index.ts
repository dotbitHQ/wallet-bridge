import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'
import { SignDataType } from '../wallets/WalletSignerHandler'
import { DeviceAuthError } from 'connect-did-sdk'

export interface SignInfo {
  sign_type: number
  sign_msg: string
}

export interface TxsList {
  sign_list: SignInfo[]
}

export interface TxsSignedOrUnSigned {
  action: string
  list: TxsList[]
  sign_key: string
  sub_action?: string
  sign_address?: string
}

export interface TxsWithMMJsonSignedOrUnSigned {
  sign_key: string
  sign_list: SignInfo[]
  mm_json?: TypedMessage<MessageTypes>
  sign_address?: string
}

export interface GetSignMethodRes {
  signTxList: (
    txs: TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned,
  ) => Promise<TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned>
  signData: (data: SignDataType, options?: Record<string, any>) => Promise<string | undefined>
  onFailed: () => Promise<DeviceAuthError>
}

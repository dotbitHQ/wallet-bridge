import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'
import { SignDataOptions, SignDataType } from '../wallets/WalletSignerHandler'
import { IData } from 'connect-did-sdk'

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

export interface InitSignContextRes {
  signTxList: (
    txs: TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned,
  ) => Promise<TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned>
  signData: (data: SignDataType, options?: SignDataOptions) => Promise<string | undefined>
  onFailed: () => Promise<IData<any>>
  onClose: () => Promise<void>
}

export type EventOptions = Record<string, any> & {
  category?: string
  label?: string
  value?: number
  nonInteraction?: boolean
  userId?: string
}

import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'
import { SignDataOptions, SignDataType } from '../wallets/WalletSignerHandler'
import { IData } from 'connect-did-sdk'

export interface SignInfo {
  sign_type: number
  sign_msg: string
}

export interface SignTxListParams {
  action?: string
  sub_action?: string
  sign_key: string
  sign_list: SignInfo[]
  mm_json?: TypedMessage<MessageTypes>
}

export interface SignTxListRes {
  action?: string
  sub_action?: string
  sign_key: string
  sign_list: SignInfo[]
  sign_address?: string
}

export interface InitSignContextRes {
  signTxList: (txs: SignTxListParams) => Promise<SignTxListRes>
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

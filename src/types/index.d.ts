import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'

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
}

export interface TxsWithMMJsonSignedOrUnSigned {
  sign_key: string
  sign_list: SignInfo[]
  mm_json?: TypedMessage<MessageTypes>
}

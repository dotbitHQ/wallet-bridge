export interface SignList {
  sign_type: number
  sign_msg: string
}

export interface TxsList {
  sign_list: SignList[]
}

export interface TxsSignedOrUnSigned {
  action: string
  list: TxsList[]
  sign_key: string
  sub_action?: string
}

export interface TxsWithMMJsonSignedOrUnSigned {
  sign_key: string
  sign_list: SignList[]
  mm_json?: TypedMessage<MessageTypes>
}

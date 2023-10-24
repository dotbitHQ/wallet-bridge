import { WalletContext } from '../WalletContext'
import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'

export type SignDataType = TypedMessage<MessageTypes> | string

export interface SignDataOptions {
  isEIP712?: boolean
  provider?: any
}

export interface SignDataParams {
  data: SignDataType
  isEIP712?: boolean
}

export abstract class WalletSigner {
  context: WalletContext

  constructor(context: WalletContext) {
    this.context = context
  }

  abstract signData(data: SignDataType, options?: SignDataOptions): Promise<string>
}

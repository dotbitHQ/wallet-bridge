import { WalletContext } from '../WalletContext'
import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'

export type SignDataType = TypedMessage<MessageTypes> | string

export abstract class WalletSigner {
  context: WalletContext

  constructor(context: WalletContext) {
    this.context = context
  }

  abstract signData(data: SignDataType, options?: Record<string, any>): Promise<string>
}

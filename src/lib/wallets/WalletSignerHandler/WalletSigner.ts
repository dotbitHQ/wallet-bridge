import { WalletContext } from '../WalletContext'
import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'

export abstract class WalletSigner {
  context: WalletContext

  constructor(context: WalletContext) {
    this.context = context
  }

  abstract signData(data: TypedMessage<MessageTypes> | string, options?: Record<string, any>): Promise<string>
}

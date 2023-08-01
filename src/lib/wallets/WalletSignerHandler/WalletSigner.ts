import { WalletContext } from '../WalletContext'
import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'

export type DataFunction = () => Promise<any>

export type SignDataType = TypedMessage<MessageTypes> | string | DataFunction

export abstract class WalletSigner {
  context: WalletContext

  constructor(context: WalletContext) {
    this.context = context
  }

  abstract signData(data: SignDataType, options?: Record<string, any>): Promise<string>
}

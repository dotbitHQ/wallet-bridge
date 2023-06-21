import { WalletContext } from '../WalletContext'

export abstract class WalletSigner {
  context: WalletContext

  constructor(context: WalletContext) {
    this.context = context
  }

  abstract signData(data: string, options?: Record<string, any>): Promise<string>
}

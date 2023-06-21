import { WalletContext } from '../WalletContext'

export interface ISendTrxParams {
  to: string
  value: string
  data?: string
}

export abstract class WalletTransaction {
  context: WalletContext

  public constructor(context: WalletContext) {
    this.context = context
  }

  abstract sendTrx(data: ISendTrxParams): Promise<string>
}

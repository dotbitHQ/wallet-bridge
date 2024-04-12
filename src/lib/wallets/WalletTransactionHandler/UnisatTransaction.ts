import { ISendTrxParams, WalletTransaction } from './WalletTransaction'

export class UnisatTransaction extends WalletTransaction {
  async sendTrx(data: ISendTrxParams): Promise<string> {
    const { provider } = this.context

    const hash = await provider.sendBitcoin(data.to, data.value)
    return hash
  }
}

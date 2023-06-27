import { ISendTrxParams, WalletTransaction } from './WalletTransaction'

export class ConnectDidTransaction extends WalletTransaction {
  async sendTrx(data: ISendTrxParams): Promise<string> {
    return await Promise.resolve('')
  }
}

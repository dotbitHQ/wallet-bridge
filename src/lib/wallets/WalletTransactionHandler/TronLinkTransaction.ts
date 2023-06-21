import { ISendTrxParams, WalletTransaction } from './WalletTransaction'

export class TronLinkTransaction extends WalletTransaction {
  async sendTrx(data: ISendTrxParams): Promise<string> {
    const _from = this.context.address
    let res = await this.context.provider.transactionBuilder.sendTrx(data.to, data.value, _from)
    res = await this.context.provider.transactionBuilder.addUpdateData(res, data.data)
    res = await this.context.provider.trx.sign(res)
    res = await this.context.provider.trx.sendRawTransaction(res)
    return res.txid
  }
}

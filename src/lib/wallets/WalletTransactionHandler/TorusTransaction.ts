import { ISendTrxParams, WalletTransaction } from './WalletTransaction'
import { utf8ToHex, numberToHex } from '../../utils'

export class TorusTransaction extends WalletTransaction {
  async sendTrx(data: ISendTrxParams): Promise<string> {
    const _from = this.context.address
    let _data: string = ''
    if (data.data) {
      _data = utf8ToHex(data.data)
    }
    const _value = numberToHex(data.value)

    return this.context.provider.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: _from,
          to: data.to,
          value: _value,
          data: _data,
        },
      ],
    })
  }
}

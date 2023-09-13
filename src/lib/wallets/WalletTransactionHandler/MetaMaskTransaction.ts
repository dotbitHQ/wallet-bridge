import { ISendTrxParams, WalletTransaction } from './WalletTransaction'
import { numberToHex, utf8ToHex } from '../../utils'

export class MetaMaskTransaction extends WalletTransaction {
  async sendTrx(data: ISendTrxParams): Promise<string> {
    const _from = this.context.address
    let _data: string = ''
    if (data.data != null) {
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

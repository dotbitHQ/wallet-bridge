import { ISendTrxParams, WalletTransaction } from './WalletTransaction'
import { utf8ToHex } from '../../utils'
import { sendTransaction } from '@wagmi/core'
import { parseUnits } from 'viem'

export class WalletConnectTransaction extends WalletTransaction {
  async sendTrx(data: ISendTrxParams): Promise<string> {
    const { chainId } = this.context
    let _data: string = ''
    if (data.data != null) {
      _data = utf8ToHex(data.data)
    }
    console.log('sendTransaction: ', chainId, data.to, data.value, _data)
    const { hash } = await sendTransaction({
      chainId,
      to: data.to,
      value: parseUnits(data.value, 0),
      data: _data as any,
    })
    return hash
  }
}

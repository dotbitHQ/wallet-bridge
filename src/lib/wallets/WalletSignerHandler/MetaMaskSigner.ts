import { WalletSigner } from './WalletSigner'
import { isHexStrict } from '../../utils'

export class MetaMaskSigner extends WalletSigner {
  async signData(data: string, options?: Record<string, any>): Promise<string> {
    let res
    if (options?.isEIP712) {
      res = await this.context.provider.request({
        method: 'eth_signTypedData_v4',
        params: [this.context.address, JSON.stringify(data)],
      })
    } else {
      let _data = data
      if (isHexStrict('0x' + data)) {
        _data = '0x' + data
      }
      res = await this.context.provider.request({
        method: 'personal_sign',
        params: [_data, this.context.address],
      })
    }
    return res
  }
}

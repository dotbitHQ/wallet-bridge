import { SignDataOptions, SignDataType, WalletSigner } from './WalletSigner'
import { isHexStrict } from '../../utils'

export class TorusSigner extends WalletSigner {
  async signData(data: SignDataType, options?: SignDataOptions): Promise<string> {
    let res
    if (options?.isEIP712) {
      res = await this.context.provider.request({
        method: 'eth_signTypedData_v4',
        params: [this.context.address, JSON.stringify(data)],
      })
    } else {
      let _data = data
      // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-plus-operands
      if (isHexStrict('0x' + data)) {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-plus-operands
        _data = '0x' + data
      }

      console.log('personal_sign', _data)
      res = await this.context.provider.request({
        method: 'personal_sign',
        params: [_data, this.context.address],
      })
    }
    return res
  }
}

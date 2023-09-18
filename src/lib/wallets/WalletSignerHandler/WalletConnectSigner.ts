import { SignDataOptions, SignDataType, WalletSigner } from './WalletSigner'
import { isHexStrict } from '../../utils'
import { signMessage, signTypedData } from '@wagmi/core'

export class WalletConnectSigner extends WalletSigner {
  async signData(data: SignDataType, options?: SignDataOptions): Promise<string> {
    let res
    if (options?.isEIP712) {
      res = await signTypedData(data as any)
    } else {
      let _data = data
      // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-plus-operands
      if (isHexStrict('0x' + data)) {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-plus-operands
        _data = '0x' + data
      }

      console.log('signMessage', String(_data))
      res = await signMessage({
        message: String(_data),
      })
    }
    return res
  }
}

import { WalletSigner } from './WalletSigner'
import { ActionErrorCode } from 'connect-did-sdk'
import CustomError from '../../utils/CustomError'

export class ConnectDidSigner extends WalletSigner {
  async signData(data: string): Promise<string> {
    const res = await this.context.provider.requestSignData({
      msg: data,
    })
    if (res.code !== ActionErrorCode.SUCCESS) {
      throw new CustomError(res.code, res.msg)
    }
    return res.data
  }
}

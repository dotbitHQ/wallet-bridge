import { WalletSigner } from './WalletSigner'
import CustomError from '../../utils/CustomError'
import errno from '../../constant/errno'

export class ConnectDidSigner extends WalletSigner {
  async signData(data: string): Promise<string> {
    const res = await this.context.provider.requestSignData({
      msg: data,
    })
    if (res.code !== errno.connectDidSdkSuccess) {
      throw new CustomError(res.code, res.msg)
    }
    return res.data
  }
}

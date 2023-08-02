import { SignDataType, WalletSigner } from './WalletSigner'
import CustomError from '../../utils/CustomError'
import errno from '../../constant/errno'
import { EnumRequestMethods, IData } from 'connect-did-sdk'

export class ConnectDidSigner extends WalletSigner {
  async signData(data: SignDataType, options?: Record<string, any>): Promise<string> {
    let provider
    if (options?.provider) {
      provider = options?.provider
    } else {
      provider = await this.context.provider.requestWaitingPage((err: IData<any>) => {
        console.error(err)
        throw new CustomError(err.code, err.msg)
      })
    }

    const res = await provider.onNext({
      method: EnumRequestMethods.REQUEST_SIGN_DATA,
      params: {
        msg: data,
      },
    })
    if (res.code !== errno.connectDidSdkSuccess) {
      throw new CustomError(res.code, res.msg)
    }
    return res.data
  }
}

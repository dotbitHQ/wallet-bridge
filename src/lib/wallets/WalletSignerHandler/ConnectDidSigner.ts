import { SignDataOptions, SignDataType, WalletSigner } from './WalletSigner'
import CustomError from '../../utils/CustomError'
import errno from '../../constant/errno'
import { DeviceAuthError, EnumRequestMethods } from 'connect-did-sdk'

export class ConnectDidSigner extends WalletSigner {
  async signData(data: SignDataType, options?: SignDataOptions): Promise<string> {
    let provider
    if (options?.provider) {
      provider = options?.provider
    } else {
      provider = await this.context.provider.requestWaitingPage((err: DeviceAuthError) => {
        console.error(err)
        throw new CustomError(err.code, err.message)
      })
    }

    const res = await provider.onNext({
      method: EnumRequestMethods.REQUEST_SIGN_DATA,
      params: {
        msg: data,
      },
    })
    if (res.code !== errno.connectDidSdkSuccess) {
      throw new CustomError(res.code, res.message)
    }
    return res.data
  }
}

import { SignDataType, WalletSigner } from './WalletSigner'
import CustomError from '../../utils/CustomError'
import errno from '../../constant/errno'
import { EnumRequestMethods, IData } from 'connect-did-sdk'

export class ConnectDidSigner extends WalletSigner {
  async signData(data: SignDataType, options?: Record<string, any>): Promise<string> {
    const provider =
      options?.provider ||
      this.context.provider.requestWaitingPage((err: IData<any>) => {
        console.error(err)
        throw new CustomError(err.code, err.msg)
      })
    let _data = data
    if (typeof _data === 'function') {
      try {
        _data = await _data()
      } catch (err) {
        console.log(err)
        await provider.onFailed()
        throw err
      }
    }
    const res = await provider.onNext({
      method: EnumRequestMethods.REQUEST_SIGN_DATA,
      params: {
        msg: _data,
      },
    })
    if (res.code !== errno.connectDidSdkSuccess) {
      throw new CustomError(res.code, res.msg)
    }
    return res.data
  }
}

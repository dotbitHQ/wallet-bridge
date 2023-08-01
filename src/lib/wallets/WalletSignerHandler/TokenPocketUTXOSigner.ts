import { SignDataType, WalletSigner } from './WalletSigner'

export class TokenPocketUTXOSigner extends WalletSigner {
  async signData(data: SignDataType): Promise<string> {
    let _data = data
    if (typeof _data === 'function') {
      _data = await _data()
    }
    const res = await this.context.provider.request({
      method: 'btc_signMessage',
      params: [_data, this.context.address],
    })
    return res
  }
}

import { SignDataType, WalletSigner } from './WalletSigner'

export class TokenPocketUTXOSigner extends WalletSigner {
  async signData(data: SignDataType): Promise<string> {
    const res = await this.context.provider.request({
      method: 'btc_signMessage',
      params: [data, this.context.address],
    })
    return res
  }
}

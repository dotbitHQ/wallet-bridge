import { WalletSigner } from './WalletSigner'

export class TokenPocketUTXOSigner extends WalletSigner {
  async signData(data: string): Promise<string> {
    const res = await this.context.provider.request({
      method: 'btc_signMessage',
      params: [data, this.context.address],
    })
    return res
  }
}

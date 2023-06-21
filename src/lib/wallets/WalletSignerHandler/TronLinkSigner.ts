import { WalletSigner } from './WalletSigner'

export class TronLinkSigner extends WalletSigner {
  async signData(data: string): Promise<string> {
    const res = await this.context.provider.trx.signMessageV2(data)
    return res
  }
}

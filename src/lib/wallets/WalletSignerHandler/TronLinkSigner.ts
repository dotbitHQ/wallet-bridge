import { SignDataType, WalletSigner } from './WalletSigner'

export class TronLinkSigner extends WalletSigner {
  async signData(data: SignDataType): Promise<string> {
    const res = await this.context.provider.trx.signMessageV2(data)
    return res
  }
}

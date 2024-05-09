import { SignDataType, WalletSigner } from './WalletSigner'

export class UnisatSigner extends WalletSigner {
  async signData(data: SignDataType): Promise<string> {
    const res = await this.context.provider.signMessage(data)
    return res
  }
}

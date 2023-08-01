import { SignDataType, WalletSigner } from './WalletSigner'

export class TronLinkSigner extends WalletSigner {
  async signData(data: SignDataType): Promise<string> {
    let _data = data
    if (typeof _data === 'function') {
      _data = await _data()
    }
    const res = await this.context.provider.trx.signMessageV2(_data)
    return res
  }
}

import { WalletConnector } from './WalletConnector'
import { resetWalletState, setWalletState } from '../../store'
import { EventEnum } from '../WalletEventListenerHandler'
import { snapshot } from 'valtio'
import { loginCacheState } from '../../store/loginCache'
import { SignDataType, TokenPocketUTXOSigner } from '../WalletSignerHandler'

export class TokenPocketUTXOConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    const { provider } = this.context
    const res = await provider.request({
      method: 'btc_accounts',
    })
    if (res?.[0]) {
      this.context.address = res[0]
      setWalletState({
        protocol: this.context.protocol,
        address: this.context.address,
        coinType: this.context.coinType,
        walletName: this.context.walletName,
      })
      const { signDataParams } = snapshot(loginCacheState)
      if (signDataParams) {
        const signature = await this.signData(signDataParams.data as SignDataType)
        this.context.emitEvent(EventEnum.Signature, signature)
      } else if (!ignoreEvent) {
        this.context.emitEvent(EventEnum.Connect)
      }
    }
  }

  async disconnect(): Promise<void> {
    this.context.address = undefined
    this.context.chainId = undefined
    this.context.coinType = undefined
    resetWalletState()
    this.context.emitEvent(EventEnum.Disconnect)
  }

  async switchNetwork(chainId: number): Promise<void> {}

  async signData(data: SignDataType): Promise<string | undefined> {
    const signer = new TokenPocketUTXOSigner(this.context)
    return await signer.signData(data)
  }
}

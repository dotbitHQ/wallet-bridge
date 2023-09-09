import { WalletConnector } from './WalletConnector'
import { resetWalletState, setWalletState } from '../../store'
import { EventEnum } from '../WalletEventListenerHandler'

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
      })
      if (!ignoreEvent) {
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
}

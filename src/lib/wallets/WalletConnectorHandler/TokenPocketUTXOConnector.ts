import { WalletConnector } from './WalletConnector'
import { resetWalletState } from '../../store'

export class TokenPocketUTXOConnector extends WalletConnector {
  async connect(): Promise<void> {
    const { provider } = this.context
    const res = await provider.request({
      method: 'btc_accounts',
    })
    this.context.address = res[0]
  }

  disconnect() {
    this.context.address = undefined
    this.context.chainId = undefined
    this.context.coinType = undefined
    resetWalletState()
  }

  async switchNetwork(chainId: number): Promise<void> {}
}

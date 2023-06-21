import { WalletContext } from '../WalletContext'

export abstract class WalletConnector {
  context: WalletContext

  constructor(context: WalletContext) {
    this.context = context
  }

  abstract connect(): Promise<void>

  abstract disconnect(): void

  abstract switchNetwork(chainId: number): void
}

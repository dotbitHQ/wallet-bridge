import { WalletContext } from '../WalletContext'

export abstract class WalletConnector {
  context: WalletContext

  constructor(context: WalletContext) {
    this.context = context
  }

  abstract connect({ ignoreEvent }: { ignoreEvent: boolean }): Promise<void>

  abstract disconnect(): Promise<void>

  abstract switchNetwork(chainId: number): Promise<void>
}

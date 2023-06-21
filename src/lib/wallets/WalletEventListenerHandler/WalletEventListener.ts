import { WalletContext } from '../WalletContext'

export type EventKey = 'walletConnect' | 'walletDisconnect' | 'walletChange' | 'walletError'

export enum EventEnum {
  Connect = 'walletConnect',
  Disconnect = 'walletDisconnect',
  Change = 'walletChange',
  Error = 'walletError',
}

export abstract class WalletEventListener {
  context: WalletContext

  constructor(context: WalletContext) {
    this.context = context
  }

  abstract listenEvents(): void

  abstract removeEvents(): void
}

import { WalletProtocol } from '../constant'
import {
  MetaMaskConnector,
  TokenPocketUTXOConnector,
  TorusConnector,
  TronLinkConnector,
  WalletConnector,
} from './WalletConnectorHandler'
import {
  MetaMaskEventListener,
  TokenPocketUTXOEventListener,
  TorusEventListener,
  TronLinkEventListener,
  WalletEventListener,
} from './WalletEventListenerHandler'
import { MetaMaskSigner, TokenPocketUTXOSigner, TorusSigner, TronLinkSigner, WalletSigner } from './WalletSignerHandler'
import {
  MetaMaskTransaction,
  TokenPocketUTXOTransaction,
  TorusTransaction,
  TronLinkTransaction,
  WalletTransaction,
} from './WalletTransactionHandler'
import { WalletContext } from './WalletContext'

type WalletHandlerMap = {
  [P in WalletProtocol]: {
    Connector: new (context: WalletContext) => WalletConnector
    EventListener: new (context: WalletContext) => WalletEventListener
    Signer: new (context: WalletContext) => WalletSigner
    Transaction: new (context: WalletContext) => WalletTransaction
  }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class WalletHandlerFactory {
  private static readonly handlerMap: WalletHandlerMap = {
    [WalletProtocol.metaMask]: {
      Connector: MetaMaskConnector,
      EventListener: MetaMaskEventListener,
      Signer: MetaMaskSigner,
      Transaction: MetaMaskTransaction,
    },
    [WalletProtocol.tronLink]: {
      Connector: TronLinkConnector,
      EventListener: TronLinkEventListener,
      Signer: TronLinkSigner,
      Transaction: TronLinkTransaction,
    },
    [WalletProtocol.torus]: {
      Connector: TorusConnector,
      EventListener: TorusEventListener,
      Signer: TorusSigner,
      Transaction: TorusTransaction,
    },
    [WalletProtocol.tokenPocketUTXO]: {
      Connector: TokenPocketUTXOConnector,
      EventListener: TokenPocketUTXOEventListener,
      Signer: TokenPocketUTXOSigner,
      Transaction: TokenPocketUTXOTransaction,
    },
    [WalletProtocol.webAuthn]: {
      Connector: MetaMaskConnector,
      EventListener: MetaMaskEventListener,
      Signer: MetaMaskSigner,
      Transaction: MetaMaskTransaction,
    },
  }

  static createConnector(context: WalletContext): WalletConnector {
    if (!context.protocol) {
      throw new Error('createConnector: Please initialize wallet first')
    }
    return new this.handlerMap[context.protocol].Connector(context)
  }

  static createEventListener(context: WalletContext): WalletEventListener {
    if (!context.protocol) {
      throw new Error('createConnector: Please initialize wallet first')
    }
    return new this.handlerMap[context.protocol].EventListener(context)
  }

  static createSigner(context: WalletContext): WalletSigner {
    if (!context.protocol) {
      throw new Error('createConnector: Please initialize wallet first')
    }
    return new this.handlerMap[context.protocol].Signer(context)
  }

  static createTransaction(context: WalletContext): WalletTransaction {
    if (!context.protocol) {
      throw new Error('createConnector: Please initialize wallet first')
    }
    return new this.handlerMap[context.protocol].Transaction(context)
  }
}

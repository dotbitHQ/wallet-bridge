import { WalletProtocol } from '../constant'
import {
  ConnectDidConnector,
  MetaMaskConnector,
  TokenPocketUTXOConnector,
  TorusConnector,
  TronLinkConnector,
  WalletConnector,
} from './WalletConnectorHandler'
import {
  ConnectDidEventListener,
  MetaMaskEventListener,
  TokenPocketUTXOEventListener,
  TorusEventListener,
  TronLinkEventListener,
  WalletEventListener,
} from './WalletEventListenerHandler'
import {
  ConnectDidSigner,
  MetaMaskSigner,
  TokenPocketUTXOSigner,
  TorusSigner,
  TronLinkSigner,
  WalletSigner,
} from './WalletSignerHandler'
import {
  ConnectDidTransaction,
  MetaMaskTransaction,
  TokenPocketUTXOTransaction,
  TorusTransaction,
  TronLinkTransaction,
  WalletTransaction,
} from './WalletTransactionHandler'
import { WalletContext } from './WalletContext'
import { WalletConnectConnector } from './WalletConnectorHandler/WalletConnectConnector'
import { WalletConnectEventListener } from './WalletEventListenerHandler/WalletConnectEventListener'
import { WalletConnectSigner } from './WalletSignerHandler/WalletConnectSigner'
import { WalletConnectTransaction } from './WalletTransactionHandler/WalletConnectTransaction'

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
      Connector: ConnectDidConnector,
      EventListener: ConnectDidEventListener,
      Signer: ConnectDidSigner,
      Transaction: ConnectDidTransaction,
    },
    [WalletProtocol.walletConnect]: {
      Connector: WalletConnectConnector,
      EventListener: WalletConnectEventListener,
      Signer: WalletConnectSigner,
      Transaction: WalletConnectTransaction,
    },
  }

  static createConnector(context: WalletContext): WalletConnector {
    if (!context.protocol) {
      // eslint-disable-next-line lingui/no-unlocalized-strings
      throw new Error('createConnector: Please initialize wallet first')
    }
    return new this.handlerMap[context.protocol].Connector(context)
  }

  static createEventListener(context: WalletContext): WalletEventListener {
    if (!context.protocol) {
      // eslint-disable-next-line lingui/no-unlocalized-strings
      throw new Error('createConnector: Please initialize wallet first')
    }
    return new this.handlerMap[context.protocol].EventListener(context)
  }

  static createSigner(context: WalletContext): WalletSigner {
    if (!context.protocol) {
      // eslint-disable-next-line lingui/no-unlocalized-strings
      throw new Error('createConnector: Please initialize wallet first')
    }
    return new this.handlerMap[context.protocol].Signer(context)
  }

  static createTransaction(context: WalletContext): WalletTransaction {
    if (!context.protocol) {
      // eslint-disable-next-line lingui/no-unlocalized-strings
      throw new Error('createConnector: Please initialize wallet first')
    }
    return new this.handlerMap[context.protocol].Transaction(context)
  }
}

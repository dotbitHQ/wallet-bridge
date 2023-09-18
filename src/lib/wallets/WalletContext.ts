import {
  CoinTypeToChainIdMap,
  CoinTypeToChainMap,
  CoinTypeToTestNetChainIdMap,
  CoinTypeToTorusHostTestNetMap,
  WalletProtocol,
  ChainId,
  CoinType,
  CoinTypeToTorusHostMap,
  CustomChain,
  CustomWallet,
} from '../constant'
import { sleep } from '../utils'
import Torus from '@toruslabs/torus-embed'
import Emittery from 'emittery'
import { EventKey } from './WalletEventListenerHandler'
import { isAndroid, isMobile } from 'react-device-detect'
import { ConnectDID } from 'connect-did-sdk'
import CustomError from '../utils/CustomError'
import errno from '../constant/errno'
import { snapshot } from 'valtio'
import { walletState } from '../store'

export class WalletContext {
  // sendTrx method
  provider: any
  protocol?: WalletProtocol
  address?: string
  chainId?: ChainId
  coinType?: CoinType
  isTestNet = false
  torusWallet?: Torus
  wagmiConfig: any
  walletName?: string
  // event emitter
  #emitter = new Emittery()

  constructor({ isTestNet, wagmiConfig }: { isTestNet: boolean; wagmiConfig?: any }) {
    this.isTestNet = isTestNet
    this.wagmiConfig = wagmiConfig
  }

  async retrieveProvider({ coinType, walletName }: { coinType?: CoinType; walletName?: string }) {
    const walletSnap = snapshot(walletState)
    if (walletSnap?.address) {
      this.address = walletSnap?.address
    }

    if (walletName) {
      this.walletName = walletName
    } else {
      this.walletName = walletSnap?.walletName
    }

    if (coinType) {
      this.coinType = coinType
    } else {
      this.coinType = walletSnap?.coinType
    }

    if (this.coinType) {
      this.chainId = this.isTestNet ? CoinTypeToTestNetChainIdMap[this.coinType] : CoinTypeToChainIdMap[this.coinType]
    }

    if (this.walletName && this.coinType) {
      if (this.walletName === CustomChain.passkey) {
        this.protocol = WalletProtocol.webAuthn
      } else if (this.walletName === CustomChain.torus) {
        this.protocol = WalletProtocol.torus
      } else if (this.walletName === CustomWallet.walletConnect) {
        this.protocol = WalletProtocol.walletConnect
      } else if (this.coinType === CoinType.doge) {
        this.protocol = WalletProtocol.tokenPocketUTXO
      } else if (this.coinType === CoinType.trx) {
        this.protocol = WalletProtocol.tronLink
      } else {
        this.protocol = WalletProtocol.metaMask
      }
    } else {
      this.protocol = walletSnap?.protocol
    }

    switch (this.protocol) {
      case WalletProtocol.metaMask:
        await this.getMetaMaskProvider()
        break
      case WalletProtocol.tronLink:
        await this.getTronLinkProvider()
        break
      case WalletProtocol.torus:
        await this.getTorusProvider()
        break
      case WalletProtocol.tokenPocketUTXO:
        await this.getTokenPocketUTXOProvider()
        break
      case WalletProtocol.webAuthn:
        this.getConnectDIDProvider()
        break
      case WalletProtocol.walletConnect:
        await this.getWalletConnectProvider()
        break
    }
  }

  emitEvent(event: EventKey, data?: any) {
    void this.#emitter.emit(event, data)
  }

  async once(event: EventKey): Promise<any> {
    return await this.#emitter.once(event)
  }

  addEventListener(event: EventKey, callback: (data?: any) => void): void {
    this.#emitter.on(event, callback)
  }

  removeEventListener(event: EventKey, callback: (data?: any) => void): void {
    this.#emitter.off(event, callback)
  }

  clearEventListeners(): void {
    this.#emitter.clearListeners()
  }

  private async getMetaMaskProvider() {
    if (this.torusWallet?.hideTorusButton) {
      this.torusWallet.hideTorusButton()
    }

    if (this.wagmiConfig) {
      this.provider = this.wagmiConfig
    } else {
      throw new CustomError(errno.failedToInitializeWallet, 'getWalletConnectProvider: wagmiConfig is undefined')
    }
  }

  private async getTokenPocketUTXOProvider() {
    if (this.torusWallet?.hideTorusButton) {
      this.torusWallet.hideTorusButton()
    }

    await sleep(1000)
    const { bitcoin } = window
    if (typeof bitcoin !== 'undefined') {
      if (bitcoin.isTokenPocket) {
        this.provider = bitcoin
      } else {
        throw new Error('Please try again after unlocking your TokenPocket wallet')
      }
    } else {
      if (isMobile) {
        if (isAndroid) {
          throw new Error('Please open this page in your crypto wallet App and try again.')
        } else {
          throw new Error('Please download TokenPocket, connect your Dogecoin wallet within the app, and retry.')
        }
      } else {
        throw new Error('Please download TokenPocket, connect your Dogecoin wallet within the app, and retry.')
      }
    }
  }

  private async getTorusProvider() {
    if (!this.torusWallet) {
      this.torusWallet = new Torus({
        buttonPosition: 'bottom-right',
      })
    }

    try {
      let host: string
      if (this.coinType) {
        host = this.isTestNet ? CoinTypeToTorusHostTestNetMap[this.coinType] : CoinTypeToTorusHostMap[this.coinType]
      } else {
        host = this.isTestNet ? CoinTypeToTorusHostTestNetMap[CoinType.eth] : CoinTypeToTorusHostMap[CoinType.eth]
      }

      if (!this.torusWallet.isLoggedIn) {
        await this.torusWallet.init({
          showTorusButton: true,
          network: {
            host,
          },
        })
        await this.torusWallet.login()
      }
      this.provider = this.torusWallet.ethereum
    } catch (error: any) {
      this.torusWallet.hideTorusButton()
      throw error
    }
  }

  private async getWalletConnectProvider() {
    if (this.torusWallet?.hideTorusButton) {
      this.torusWallet.hideTorusButton()
    }

    if (this.wagmiConfig) {
      this.provider = this.wagmiConfig
    } else {
      throw new CustomError(errno.failedToInitializeWallet, 'getWalletConnectProvider: wagmiConfig is undefined')
    }
  }

  private async getTronLinkProvider() {
    if (this.torusWallet?.hideTorusButton) {
      this.torusWallet.hideTorusButton()
    }

    await sleep(1000)
    const { tronWeb } = window
    if (typeof tronWeb !== 'undefined') {
      if (tronWeb.defaultAddress.base58) {
        this.provider = tronWeb
      } else {
        throw Error('Please try again after unlocking your TronLink wallet')
      }
    } else {
      if (isMobile) {
        throw new Error('Please open this page in your crypto wallet App and try again.')
      } else {
        const name = this.coinType && CoinTypeToChainMap[this.coinType].name
        throw new Error(
          `Please ensure that your browser has the ${String(name)} wallet plugin installed and try again.`,
        )
      }
    }
  }

  private getConnectDIDProvider() {
    if (this.torusWallet?.hideTorusButton) {
      this.torusWallet.hideTorusButton()
    }

    let isDebug = false

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      isDebug = urlParams.get('debug') === 'true'
    }

    this.provider = new ConnectDID(this.isTestNet, isDebug)
  }
}

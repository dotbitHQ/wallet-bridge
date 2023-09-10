import {
  CoinTypeToChainIdMap,
  CoinTypeToChainMap,
  CoinTypeToTestNetChainIdMap,
  CoinTypeToTorusHostTestNetMap,
  WalletProtocol,
  ChainId,
  CoinType,
  CoinTypeToTorusHostMap,
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
  // event emitter
  #emitter = new Emittery()

  constructor({ isTestNet, wagmiConfig }: { isTestNet: boolean; wagmiConfig?: any }) {
    this.isTestNet = isTestNet
    this.wagmiConfig = wagmiConfig
  }

  async retrieveProvider({ protocol, coinType }: { protocol: WalletProtocol; coinType: CoinType }) {
    this.chainId = this.isTestNet ? CoinTypeToTestNetChainIdMap[coinType] : CoinTypeToChainIdMap[coinType]
    this.protocol = protocol
    this.coinType = coinType

    const walletSnap = snapshot(walletState)
    if (walletSnap?.address) {
      this.address = walletSnap?.address
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

    await sleep(1000)
    const { ethereum } = window
    if (typeof ethereum !== 'undefined') {
      this.provider = ethereum
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
    this.torusWallet = new Torus({
      buttonPosition: 'bottom-right',
    })
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
    this.provider = new ConnectDID(this.isTestNet)
  }
}

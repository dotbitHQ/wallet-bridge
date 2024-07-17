import {
  CoinTypeToChainIdMap,
  CoinTypeToChainMap,
  CoinTypeToTestNetChainIdMap,
  CoinTypeToTorusHostTestNetMap,
  WalletProtocol,
  CoinType,
  CoinTypeToTorusHostMap,
  CustomChain,
  CustomWallet,
} from '../constant'
import { getConnector, sleep } from '../utils'
import Torus from '@toruslabs/torus-embed'
import Emittery from 'emittery'
import { EventKey } from './WalletEventListenerHandler'
import { isAndroid, isMobile } from 'react-device-detect'
import { ConnectDID } from 'connect-did-sdk'
import CustomError from '../utils/CustomError'
import errno from '../constant/errno'
import { snapshot } from 'valtio'
import { walletState } from '../store'
import { EventOptions } from '../types'
import { reconnect } from '@wagmi/core'
import { t } from '@lingui/macro'

export class WalletContext {
  // sendTrx method
  provider: any
  protocol?: WalletProtocol
  address?: string
  chainId?: number | string
  coinType?: CoinType
  isTestNet = false
  torusWallet?: Torus
  wagmiConfig: any
  walletName?: string
  // event emitter
  #emitter = new Emittery()
  gtag?: any
  event?: any

  constructor({
    isTestNet,
    wagmiConfig,
    gtag,
    event,
  }: {
    isTestNet: boolean
    wagmiConfig?: any
    gtag?: any
    event?: any
  }) {
    this.isTestNet = isTestNet
    this.wagmiConfig = wagmiConfig
    if (gtag) {
      this.gtag = gtag
    }
    if (event) {
      this.event = event
    }
  }

  reportEvent(action: string, options: EventOptions) {
    try {
      if (this.gtag) {
        this.gtag('event', action, {
          event_category: options.category,
          event_label: options.label,
          value: options.value,
          non_interaction: options.nonInteraction,
          user_id: options.userId,
        })
      } else if (this.event) {
        this.event(action, {
          category: options.category,
          label: options.label,
          value: options.value,
          nonInteraction: options.nonInteraction,
          userId: options.userId,
        })
      }
    } catch (error) {
      console.error(error)
    }
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
      } else if (this.coinType === CoinType.btc) {
        this.protocol = WalletProtocol.unisat
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
      case WalletProtocol.unisat:
        await this.getUnisatProvider()
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
    if (this.wagmiConfig && this.walletName) {
      const connector = getConnector(this.wagmiConfig, this.walletName)
      if (connector) {
        await reconnect(this.wagmiConfig, { connectors: [connector] })
      }
      this.provider = await connector?.getProvider()
    } else {
      // eslint-disable-next-line lingui/no-unlocalized-strings
      throw new CustomError(errno.failedToInitializeWallet, 'getMetaMaskProvider: wagmiConfig is undefined')
    }
  }

  private async getWalletConnectProvider() {
    await this.getMetaMaskProvider()
  }

  private async getTokenPocketUTXOProvider() {
    await sleep(1000)
    const { bitcoin } = window
    if (typeof bitcoin !== 'undefined') {
      if (bitcoin.isTokenPocket) {
        this.provider = bitcoin
      } else {
        throw new CustomError(errno.getProviderError, t`Please try again after unlocking your TokenPocket wallet.`)
      }
    } else {
      if (isMobile) {
        if (isAndroid) {
          throw new CustomError(
            errno.getProviderError,
            t`Please open this page in your crypto wallet App and try again.`,
          )
        } else {
          throw new CustomError(
            errno.getProviderError,
            t`Please download TokenPocket, connect your Dogecoin wallet within the app, and retry.`,
          )
        }
      } else {
        throw new CustomError(
          errno.getProviderError,
          t`Please download TokenPocket, connect your Dogecoin wallet within the app, and retry.`,
        )
      }
    }
  }

  private async getUnisatProvider() {
    await sleep(1000)
    const { unisat } = window
    if (typeof unisat !== 'undefined') {
      this.provider = unisat
    } else {
      if (isMobile) {
        throw new CustomError(errno.getProviderError, t`Please open this page in your crypto wallet App and try again.`)
      } else {
        const name = this.coinType && CoinTypeToChainMap[this.coinType].name
        throw new CustomError(
          errno.getProviderError,
          t`Please ensure that your browser has the ${String(name)} wallet plugin installed and try again.`,
        )
      }
    }
  }

  private async getTorusProvider() {
    if (!this.torusWallet) {
      this.torusWallet = new Torus()
    }

    let host: string
    if (this.coinType) {
      host = this.isTestNet ? CoinTypeToTorusHostTestNetMap[this.coinType] : CoinTypeToTorusHostMap[this.coinType]
    } else {
      host = this.isTestNet ? CoinTypeToTorusHostTestNetMap[CoinType.eth] : CoinTypeToTorusHostMap[CoinType.eth]
    }

    if (!this.torusWallet.isInitialized) {
      await this.torusWallet.init({
        showTorusButton: false,
        network:
          host === 'holesky'
            ? {
                host: 'https://rpc.ankr.com/eth_holesky',
                chainId: this.chainId as number,
                networkName: 'Holesky Test Network',
                blockExplorer: 'https://holesky.etherscan.io',
                ticker: 'ETH',
                tickerName: 'Ethereum',
              }
            : host === 'amoy'
            ? {
                host: 'https://rpc.ankr.com/polygon_amoy',
                chainId: this.chainId as number,
                networkName: 'Amoy Test Network',
                blockExplorer: 'https://amoy.polygonscan.com',
                ticker: 'Matic',
                tickerName: 'Polygon',
              }
            : {
                host,
              },
      })
    }
    this.provider = this.torusWallet.ethereum
  }

  private async getTronLinkProvider() {
    await sleep(1000)
    const { tronWeb } = window
    if (typeof tronWeb !== 'undefined') {
      if (tronWeb.defaultAddress.base58) {
        this.provider = tronWeb
      } else {
        throw new CustomError(errno.getProviderError, t`Please try again after unlocking your Tron wallet.`)
      }
    } else {
      if (isMobile) {
        throw new CustomError(errno.getProviderError, t`Please open this page in your crypto wallet App and try again.`)
      } else {
        const name = this.coinType && CoinTypeToChainMap[this.coinType].name
        throw new CustomError(
          errno.getProviderError,
          t`Please ensure that your browser has the ${String(name)} wallet plugin installed and try again.`,
        )
      }
    }
  }

  private getConnectDIDProvider() {
    let isDebug = false

    if (typeof window !== 'undefined') {
      const urlParams = new globalThis.URLSearchParams(window.location.search)
      isDebug = urlParams.get('debug') === 'true'
    }

    this.provider = new ConnectDID(this.isTestNet, isDebug)
  }
}

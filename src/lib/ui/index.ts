import React from 'react'
import { createRoot } from 'react-dom/client'
import { ConnectWallet } from './ConnectWallet'
import WalletSDK from '../wallets'
import { useWalletState, walletState } from '../store'

export default class Wallet {
  walletSDK: WalletSDK
  useWalletState = useWalletState

  constructor({ isTestNet = false }: { isTestNet?: boolean }) {
    this.walletSDK = new WalletSDK({ isTestNet })
  }

  connectWallet(): void {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const connectWalletInstance = React.createElement(ConnectWallet, {
      visible: true,
      walletSDK: this.walletSDK,
    })
    createRoot(container).render(connectWalletInstance)
  }

  onInvolution(involution: boolean): void {
    if (involution) {
      this.connectWallet()
    }
  }

  async initWallet({ involution = false }: { involution?: boolean } = {}): Promise<boolean> {
    try {
      const { protocol, coinType } = walletState

      if (protocol && coinType) {
        await this.walletSDK.init({
          protocol,
          coinType,
        })
        return true
      }
      this.onInvolution(involution)
      return false
    } catch (error) {
      console.error(error)
      this.onInvolution(involution)
      return false
    }
  }
}

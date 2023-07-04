import WalletSDK from '../wallets'
import { useWalletState } from '../store'

export default class Wallet {
  walletSDK: WalletSDK
  useWalletState = useWalletState

  constructor({ isTestNet = false }: { isTestNet?: boolean }) {
    this.walletSDK = new WalletSDK({ isTestNet })
  }

  connectWallet() {
    this.walletSDK.connectWallet()
  }

  connectWalletInfo() {
    this.walletSDK.connectWallet({ initComponent: 'LoggedIn' })
  }

  async initWallet({ involution = true }: { involution?: boolean } = {}): Promise<boolean> {
    return await this.walletSDK.initWallet({ involution })
  }
}

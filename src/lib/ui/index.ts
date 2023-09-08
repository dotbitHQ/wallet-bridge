import WalletSDK from '../wallets'
import { useWalletState, getWalletState, setWalletState } from '../store'
import { InitSignContextRes } from '../types'
import { ISendTrxParams } from '../wallets/WalletTransactionHandler'
import { CustomChain, CustomWallet } from '../constant'

export class Wallet {
  walletSDK: WalletSDK
  useWalletState = useWalletState
  getWalletState = getWalletState

  constructor({
    isTestNet = false,
    loggedInSelectAddress = true,
    customChains = [],
    customWallets = [],
    wagmiConfig,
  }: {
    isTestNet?: boolean
    loggedInSelectAddress?: boolean
    customChains?: CustomChain[]
    customWallets?: CustomWallet[]
    wagmiConfig?: any
  }) {
    setWalletState({ isTestNet, loggedInSelectAddress, customChains, customWallets })
    this.walletSDK = new WalletSDK({ isTestNet, wagmiConfig })
  }

  connectWallet(params: { onlyEth?: boolean } = {}) {
    this.walletSDK.connectWallet(params)
  }

  loggedInfo() {
    this.walletSDK.connectWallet({ initComponent: 'LoggedIn' })
  }

  async sendTransaction(data: ISendTrxParams): Promise<string | undefined> {
    return await this.walletSDK.sendTransaction(data)
  }

  async initWallet({ involution = true }: { involution?: boolean } = {}): Promise<boolean> {
    return await this.walletSDK.initWallet({ involution })
  }

  async initSignContext(): Promise<InitSignContextRes> {
    return await this.walletSDK.initSignContext()
  }

  async _verifyPasskeySignature(params: { message: string; signature: string }): Promise<boolean> {
    return await this.walletSDK._verifyPasskeySignature(params)
  }
}

import WalletSDK from '../wallets'
import { useWalletState, getWalletState, setWalletState } from '../store'
import { InitSignContextRes } from '../types'
import { ISendTrxParams } from '../wallets/WalletTransactionHandler'
import { CustomChain, CustomWallet } from '../constant'
import { SignDataParams } from '../wallets/WalletSignerHandler'

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
    gtag,
    event,
  }: {
    isTestNet?: boolean
    loggedInSelectAddress?: boolean
    customChains?: CustomChain[]
    customWallets?: CustomWallet[]
    wagmiConfig?: any
    gtag?: any
    event?: any
  }) {
    setWalletState({ isTestNet, loggedInSelectAddress, customChains, customWallets })
    this.walletSDK = new WalletSDK({ isTestNet, wagmiConfig, gtag, event })
  }

  connectWallet(params: { onlyEth?: boolean } = {}) {
    this.walletSDK.connectWallet(params)
  }

  async connectWalletAndSignData(params: { signData: SignDataParams }): Promise<{ signature: string } | undefined> {
    return await this.walletSDK.connectWalletAndSignData(params)
  }

  loggedInfo() {
    // eslint-disable-next-line lingui/no-unlocalized-strings
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

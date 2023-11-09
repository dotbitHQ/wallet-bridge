import WalletSDK from '../wallets'
import { useWalletState, getWalletState, setWalletState } from '../store'
import { InitSignContextRes } from '../types'
import { ISendTrxParams } from '../wallets/WalletTransactionHandler'
import { CustomChain, CustomWallet } from '../constant'
import { SignDataParams } from '../wallets/WalletSignerHandler'
import { detect, fromNavigator, fromStorage, fromUrl } from '@lingui/detect-locale'

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
    locale
  }: {
    isTestNet?: boolean
    loggedInSelectAddress?: boolean
    customChains?: CustomChain[]
    customWallets?: CustomWallet[]
    wagmiConfig?: any
    gtag?: any
    event?: any
    locale?: string
  }) {
    let detectedLocale = locale
    if (detectedLocale === undefined) {
      detectedLocale = detect(fromUrl("lang"), fromStorage("lang"), fromNavigator(), () => 'en')!
    }
    if (['zh-HK', 'zh-TW', 'zh-MO'].includes(detectedLocale)) detectedLocale = 'zh-HK'
    setWalletState({ isTestNet, loggedInSelectAddress, customChains, customWallets, locale: detectedLocale })
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

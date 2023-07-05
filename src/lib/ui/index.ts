import WalletSDK from '../wallets'
import { useWalletState, getWalletState } from '../store'
import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'
import { ISendTrxParams } from '../wallets/WalletTransactionHandler'

export default class Wallet {
  walletSDK: WalletSDK
  useWalletState = useWalletState
  getWalletState = getWalletState

  constructor({ isTestNet = false }: { isTestNet?: boolean }) {
    this.walletSDK = new WalletSDK({ isTestNet })
  }

  connectWallet() {
    this.walletSDK.connectWallet()
  }

  loggedInfo() {
    this.walletSDK.connectWallet({ initComponent: 'LoggedIn' })
  }

  async signData(
    data: TypedMessage<MessageTypes> | string,
    options?: Record<string, any>,
  ): Promise<string | undefined> {
    return await this.walletSDK.signData(data, options)
  }

  async sendTransaction(data: ISendTrxParams): Promise<string | undefined> {
    return await this.walletSDK.sendTransaction(data)
  }

  async initWallet({ involution = true }: { involution?: boolean } = {}): Promise<boolean> {
    return await this.walletSDK.initWallet({ involution })
  }
}

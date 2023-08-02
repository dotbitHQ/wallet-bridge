import WalletSDK from '../wallets'
import { useWalletState, getWalletState, setWalletState } from '../store'
import { TxsSignedOrUnSigned, TxsWithMMJsonSignedOrUnSigned } from '../types'
import { ISendTrxParams } from '../wallets/WalletTransactionHandler'
import { SignDataType } from '../wallets/WalletSignerHandler'

export class Wallet {
  walletSDK: WalletSDK
  useWalletState = useWalletState
  getWalletState = getWalletState

  constructor({
    isTestNet = false,
    loggedInSelectAddress = true,
  }: {
    isTestNet?: boolean
    loggedInSelectAddress?: boolean
  }) {
    setWalletState({ isTestNet, loggedInSelectAddress })
    this.walletSDK = new WalletSDK({ isTestNet })
  }

  connectWallet(params: { onlyEth?: boolean } = {}) {
    this.walletSDK.connectWallet(params)
  }

  loggedInfo() {
    this.walletSDK.connectWallet({ initComponent: 'LoggedIn' })
  }

  async signData(data: SignDataType, options?: Record<string, any>): Promise<string | undefined> {
    return await this.walletSDK.signData(data, options)
  }

  async sendTransaction(data: ISendTrxParams): Promise<string | undefined> {
    return await this.walletSDK.sendTransaction(data)
  }

  async initWallet({ involution = true }: { involution?: boolean } = {}): Promise<boolean> {
    return await this.walletSDK.initWallet({ involution })
  }

  async signTxList(txs: TxsSignedOrUnSigned): Promise<TxsSignedOrUnSigned>
  async signTxList(txs: TxsWithMMJsonSignedOrUnSigned): Promise<TxsWithMMJsonSignedOrUnSigned>
  async signTxList(
    txs: TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned,
  ): Promise<TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned> {
    return await this.walletSDK.signTxList(txs as any)
  }

  async getSignMethod(): Promise<Record<string, any> | undefined> {
    return await this.walletSDK.getSignMethod()
  }
}

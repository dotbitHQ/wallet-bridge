import { WalletConnector } from './WalletConnector'
import { TronLinkRequestAccountsResponseCode } from '../../constant'
import { resetWalletState } from '../../store'
import CustomError from '../../utils/CustomError'

// source: https://developers.tron.network/docs/introduction
export interface ITronLinkRequestAccountsResponse {
  code: TronLinkRequestAccountsResponseCode
  message: string
}

export class TronLinkConnector extends WalletConnector {
  async connect(): Promise<void> {
    try {
      const { provider } = this.context
      if (provider.request) {
        const res: ITronLinkRequestAccountsResponse = await provider.request({
          method: 'tron_requestAccounts',
        })

        if (res.code === TronLinkRequestAccountsResponseCode.ok) {
          this.context.address = provider.defaultAddress.base58
        } else {
          throw new CustomError(res.code, res.message)
        }
      } else {
        this.context.address = provider.defaultAddress.base58
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  disconnect() {
    this.context.address = undefined
    this.context.chainId = undefined
    this.context.coinType = undefined
    resetWalletState()
  }

  async switchNetwork(chainId: number): Promise<void> {}
}

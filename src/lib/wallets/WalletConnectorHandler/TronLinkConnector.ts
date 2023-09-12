import { WalletConnector } from './WalletConnector'
import { TronLinkRequestAccountsResponseCode } from '../../constant'
import { resetWalletState, setWalletState } from '../../store'
import CustomError from '../../utils/CustomError'
import { EventEnum } from '../WalletEventListenerHandler'

// source: https://developers.tron.network/docs/introduction
export interface ITronLinkRequestAccountsResponse {
  code: TronLinkRequestAccountsResponseCode
  message: string
}

export class TronLinkConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    const { provider } = this.context
    if (provider.request) {
      const res: ITronLinkRequestAccountsResponse = await provider.request({
        method: 'tron_requestAccounts',
      })

      if (res.code === TronLinkRequestAccountsResponseCode.ok) {
        this.context.address = provider.defaultAddress.base58
        setWalletState({
          protocol: this.context.protocol,
          address: this.context.address,
          coinType: this.context.coinType,
          walletName: this.context.walletName,
        })
        if (!ignoreEvent) {
          this.context.emitEvent(EventEnum.Connect)
        }
      } else {
        throw new CustomError(res.code, res.message)
      }
    } else {
      this.context.address = provider.defaultAddress.base58
      setWalletState({
        protocol: this.context.protocol,
        address: this.context.address,
        coinType: this.context.coinType,
        walletName: this.context.walletName,
      })
      if (!ignoreEvent) {
        this.context.emitEvent(EventEnum.Connect)
      }
    }
  }

  async disconnect(): Promise<void> {
    this.context.address = undefined
    this.context.chainId = undefined
    this.context.coinType = undefined
    resetWalletState()
    this.context.emitEvent(EventEnum.Disconnect)
  }

  async switchNetwork(chainId: number): Promise<void> {}
}

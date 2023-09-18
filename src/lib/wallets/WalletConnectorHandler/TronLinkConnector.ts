import { WalletConnector } from './WalletConnector'
import { TronLinkRequestAccountsResponseCode } from '../../constant'
import { resetWalletState, setWalletState } from '../../store'
import CustomError from '../../utils/CustomError'
import { EventEnum } from '../WalletEventListenerHandler'
import { snapshot } from 'valtio'
import { loginCacheState } from '../../store/loginCache'
import { SignDataType, TronLinkSigner } from '../WalletSignerHandler'

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
        const { signDataParams } = snapshot(loginCacheState)
        if (signDataParams) {
          const signature = await this.signData(signDataParams.data as SignDataType)
          this.context.emitEvent(EventEnum.Signature, signature)
        } else if (!ignoreEvent) {
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
      const { signDataParams } = snapshot(loginCacheState)
      if (signDataParams) {
        const signature = await this.signData(signDataParams.data as SignDataType)
        this.context.emitEvent(EventEnum.Signature, signature)
      } else if (!ignoreEvent) {
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

  async signData(data: SignDataType): Promise<string | undefined> {
    try {
      const signer = new TronLinkSigner(this.context)
      return await signer.signData(data)
    } catch (err) {
      console.error(err)
      return undefined
    }
  }
}

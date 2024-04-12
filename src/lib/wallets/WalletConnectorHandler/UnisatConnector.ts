import { WalletConnector } from './WalletConnector'
import { resetWalletState, setWalletState } from '../../store'
import { EventEnum } from '../WalletEventListenerHandler'
import { snapshot } from 'valtio'
import { loginCacheState } from '../../store/loginCache'
import { SignDataType, TokenPocketUTXOSigner } from '../WalletSignerHandler'

export class UnisatConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    const { provider, chainId } = this.context
    const res = await provider.requestAccounts()
    const network = await provider.getNetwork()

    if (chainId && chainId !== network?.toLowerCase()) {
      await this.switchNetwork(chainId as string)
    }

    if (res?.[0]) {
      this.context.address = res[0]
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

  async switchNetwork(chainId: string): Promise<void> {
    try {
      const { provider } = this.context
      await provider.switchNetwork(chainId)
    } catch (err) {
      console.error(err)
    }
  }

  async signData(data: SignDataType): Promise<string | undefined> {
    const signer = new TokenPocketUTXOSigner(this.context)
    return await signer.signData(data)
  }
}

import { WalletConnector } from './WalletConnector'
import { chainIdHexToNumber, toChecksumAddress } from '../../utils'
import { ChainIdToCoinTypeMap, ChainIdToCoinTypeTestNetMap } from '../../constant'
import { resetWalletState, setWalletState } from '../../store'
import { EventEnum } from '../WalletEventListenerHandler'
import { snapshot } from 'valtio'
import { loginCacheState } from '../../store/loginCache'
import { SignDataType, TorusSigner } from '../WalletSignerHandler'

export class TorusConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    const { provider, isTestNet, torusWallet } = this.context
    if (!torusWallet?.isLoggedIn && torusWallet?.isInitialized) {
      await torusWallet?.login()
    }
    const netVersion = await provider.request({ method: 'net_version' })
    const ethChainId = await provider.request({ method: 'eth_chainId' })
    const res = await provider.request({ method: 'eth_requestAccounts' })
    if (res?.[0]) {
      this.context.address = toChecksumAddress(res[0])
      this.context.chainId = chainIdHexToNumber(netVersion || ethChainId)
      this.context.coinType = isTestNet
        ? ChainIdToCoinTypeTestNetMap[this.context.chainId]
        : ChainIdToCoinTypeMap[this.context.chainId]
      setWalletState({
        protocol: this.context.protocol,
        address: this.context.address,
        coinType: this.context.coinType,
        walletName: this.context.walletName,
      })
      const { signDataParams } = snapshot(loginCacheState)
      if (signDataParams) {
        const signature = await this.signData(signDataParams.data as SignDataType, signDataParams.isEIP712)
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
    if (this.context.torusWallet?.isLoggedIn) {
      await this.context.torusWallet?.logout?.()
    }
    this.context.emitEvent(EventEnum.Disconnect)
  }

  async switchNetwork(chainId: number): Promise<void> {}

  async signData(data: SignDataType, isEIP712?: boolean): Promise<string | undefined> {
    const signer = new TorusSigner(this.context)
    return await signer.signData(data, {
      isEIP712,
    })
  }
}

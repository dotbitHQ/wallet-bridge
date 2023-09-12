import { WalletConnector } from './WalletConnector'
import { chainIdHexToNumber, toChecksumAddress } from '../../utils'
import { ChainIdToCoinTypeMap, ChainIdToCoinTypeTestNetMap } from '../../constant'
import { resetWalletState, setWalletState } from '../../store'
import { EventEnum } from '../WalletEventListenerHandler'

export class TorusConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    const { provider, isTestNet } = this.context
    const netVersion = provider.networkVersion
    const ethChainId = provider.chainId
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
      if (!ignoreEvent) {
        this.context.emitEvent(EventEnum.Connect)
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.context.torusWallet?.hideTorusButton) {
      this.context.torusWallet?.hideTorusButton()
    }
    this.context.address = undefined
    this.context.chainId = undefined
    this.context.coinType = undefined
    resetWalletState()
    this.context.emitEvent(EventEnum.Disconnect)
  }

  async switchNetwork(chainId: number): Promise<void> {}
}

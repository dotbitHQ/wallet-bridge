import { WalletConnector } from './WalletConnector'
import { chainIdHexToNumber, toChecksumAddress } from '../../utils'
import { ChainIdToCoinTypeMap } from '../../constant'
import { resetWalletState } from '../../store'

export class TorusConnector extends WalletConnector {
  async connect(): Promise<void> {
    const { provider } = this.context
    const netVersion = provider.networkVersion
    const ethChainId = provider.chainId
    const res = await provider.request({ method: 'eth_requestAccounts' })
    this.context.address = toChecksumAddress(res[0])
    this.context.chainId = chainIdHexToNumber(netVersion || ethChainId)
    this.context.coinType = ChainIdToCoinTypeMap[this.context.chainId]
  }

  disconnect() {
    this.context.address = undefined
    this.context.chainId = undefined
    this.context.coinType = undefined
    resetWalletState()
  }

  async switchNetwork(chainId: number): Promise<void> {}
}

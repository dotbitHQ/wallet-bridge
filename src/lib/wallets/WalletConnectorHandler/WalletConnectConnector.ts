import { WalletConnector } from './WalletConnector'
import { toChecksumAddress } from '../../utils'
import { connect, Connector, disconnect, switchNetwork, getAccount, getNetwork } from '@wagmi/core'
import { ChainIdToCoinTypeMap, ChainIdToCoinTypeTestNetMap } from '../../constant'

export class WalletConnectConnector extends WalletConnector {
  async connect(): Promise<void> {
    const { provider, chainId, isTestNet } = this.context
    const connector = provider.connectors.find((item: Connector) => {
      return item.id === 'walletConnect'
    })
    if (provider && provider.status === 'disconnected' && connector) {
      const { chain } = await connect({
        connector,
        chainId,
      })
      const { address } = getAccount()
      const network = getNetwork()
      if (address && network && network.chain) {
        this.context.address = toChecksumAddress(String(address))
        this.context.chainId = network.chain.id
        this.context.coinType = isTestNet ? ChainIdToCoinTypeTestNetMap[chain.id] : ChainIdToCoinTypeMap[chain.id]
      }
    }
  }

  async disconnect(): Promise<void> {
    await disconnect()
  }

  async switchNetwork(chainId: number): Promise<void> {
    await switchNetwork({
      chainId,
    })
  }
}

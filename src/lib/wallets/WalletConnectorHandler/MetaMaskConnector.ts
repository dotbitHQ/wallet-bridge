import { WalletConnector } from './WalletConnector'
import { toChecksumAddress } from '../../utils'
import { connect, Connector, disconnect, switchNetwork, getNetwork } from '@wagmi/core'
import { EventEnum } from '../WalletEventListenerHandler'
import { resetWalletState, setWalletState } from '../../store'
import { isMobile } from 'react-device-detect'
import { CoinTypeToChainMap } from '../../constant'

export class MetaMaskConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    try {
      const { provider, chainId } = this.context
      const metaMaskConnector = provider.connectors.find((item: Connector) => {
        return item.id === 'metaMask'
      })

      if (provider && provider.status !== 'connected' && metaMaskConnector) {
        const { chain, account } = await connect({
          connector: metaMaskConnector,
          chainId,
        })

        if (chainId && chainId !== chain.id) {
          await this.switchNetwork(chainId)
        }

        const network = getNetwork()

        if (account && network.chain && network.chain.id === chainId) {
          this.context.address = toChecksumAddress(account)
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
    } catch (err) {
      console.error(err)
      if (isMobile) {
        throw new Error('Please open this page in your crypto wallet App and try again.')
      } else {
        const name = this.context.coinType && CoinTypeToChainMap[this.context.coinType].name
        throw new Error(
          `Please ensure that your browser has the ${String(name)} wallet plugin installed and try again.`,
        )
      }
    }
  }

  async disconnect(): Promise<void> {
    await disconnect()
    this.context.address = undefined
    this.context.chainId = undefined
    this.context.coinType = undefined
    resetWalletState()
    this.context.emitEvent(EventEnum.Disconnect)
  }

  async switchNetwork(chainId: number): Promise<void> {
    await switchNetwork({
      chainId,
    })
  }
}

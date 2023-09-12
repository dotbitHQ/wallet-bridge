import { WalletConnector } from './WalletConnector'
import { toChecksumAddress } from '../../utils'
import { connect, Connector, disconnect, switchNetwork } from '@wagmi/core'
import { EventEnum } from '../WalletEventListenerHandler'
import { resetWalletState, setWalletState } from '../../store'
import { setLoginCacheState } from '../../store/loginCache'

export class WalletConnectConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    console.log('WalletConnect connect')
    const { provider, chainId } = this.context
    const walletConnectConnector = provider.connectors.find((item: Connector) => {
      return item.id === 'walletConnect'
    })

    if (provider && provider.status !== 'connected' && walletConnectConnector) {
      if (!walletConnectConnector.options.showQrModal) {
        const walletConnectProvider = await walletConnectConnector.getProvider()
        walletConnectProvider.once('display_uri', async (uri: string) => {
          console.log('WalletConnect display_uri', uri)
          setLoginCacheState({ walletConnectDisplayUri: uri })
        })
      }
      const { chain, account } = await connect({
        connector: walletConnectConnector,
        chainId,
      })

      if (account && chain && chain.id === chainId) {
        this.context.address = toChecksumAddress(account)
        setWalletState({
          protocol: this.context.protocol,
          address: this.context.address,
          coinType: this.context.coinType,
          walletName: this.context.walletName,
        })
        setLoginCacheState({ walletConnectDisplayUri: '', walletName: '' })
        if (!ignoreEvent) {
          this.context.emitEvent(EventEnum.Connect)
        }
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

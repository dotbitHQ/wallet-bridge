import { WalletConnector } from './WalletConnector'
import { toChecksumAddress } from '../../utils'
import { connect, Connector, disconnect, switchNetwork } from '@wagmi/core'
import { EventEnum } from '../WalletEventListenerHandler'
import { resetWalletState, setWalletState } from '../../store'
import { loginCacheState, setLoginCacheState } from '../../store/loginCache'
import { snapshot } from 'valtio'
import { WalletConnectSigner } from '../WalletSignerHandler/WalletConnectSigner'
import { SignDataType } from '../WalletSignerHandler'

export class WalletConnectConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    console.log('WalletConnect connect')
    const { provider, chainId } = this.context
    const walletConnectConnector = provider.connectors.find((item: Connector) => {
      return item.id === 'walletConnect'
    })

    const walletStateLocalStorage = localStorage.getItem('WalletState')
    if (walletStateLocalStorage && provider.status === 'connected') {
      await disconnect()
      localStorage.removeItem('WalletState')
    }

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
        const { signDataParams } = snapshot(loginCacheState)
        if (signDataParams) {
          const signature = await this.signData(signDataParams.data as SignDataType, signDataParams.isEIP712)
          this.context.emitEvent(EventEnum.Signature, signature)
        } else if (!ignoreEvent) {
          this.context.emitEvent(EventEnum.Connect)
        }
      }
    } else if (provider.status === 'connected') {
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

  async signData(data: SignDataType, isEIP712?: boolean): Promise<string | undefined> {
    try {
      const signer = new WalletConnectSigner(this.context)
      return await signer.signData(data, {
        isEIP712,
      })
    } catch (err) {
      console.error(err)
      return undefined
    }
  }
}

import { WalletConnector } from './WalletConnector'
import { sleep, toChecksumAddress } from '../../utils'
import { connect, Connector, disconnect, switchNetwork } from '@wagmi/core'
import { EventEnum } from '../WalletEventListenerHandler'
import { resetWalletState, setWalletState } from '../../store'
import { loginCacheState, setLoginCacheState } from '../../store/loginCache'
import { snapshot } from 'valtio'
import { WalletConnectSigner } from '../WalletSignerHandler/WalletConnectSigner'
import { SignDataType } from '../WalletSignerHandler'
import { isMobile } from 'react-device-detect'

export class WalletConnectConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    console.log('WalletConnect connect')
    const { wagmiConfig, chainId, provider } = this.context

    let walletConnectConnector
    if (isMobile) {
      walletConnectConnector = wagmiConfig.connectors.find((item: Connector) => {
        return item.id === 'walletConnect' && item.options.showQrModal === true
      })
    } else {
      walletConnectConnector = wagmiConfig.connectors.find((item: Connector) => {
        return item.id === 'walletConnect' && item.options.showQrModal === false
      })
    }

    // eslint-disable-next-line lingui/no-unlocalized-strings
    const walletStateLocalStorage = globalThis.localStorage.getItem('WalletState')
    if (walletStateLocalStorage && wagmiConfig.status === 'connected') {
      await disconnect()
      // eslint-disable-next-line lingui/no-unlocalized-strings
      globalThis.localStorage.removeItem('WalletState')
    }

    if (wagmiConfig && wagmiConfig.status !== 'connected' && walletConnectConnector) {
      if (!walletConnectConnector.options.showQrModal) {
        provider.once('display_uri', async (uri: string) => {
          // eslint-disable-next-line lingui/no-unlocalized-strings
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
    } else if (wagmiConfig.status === 'connected') {
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
      await sleep(1000)
      return await signer.signData(data, {
        isEIP712,
      })
    } catch (err) {
      console.error(err)
      return undefined
    }
  }
}

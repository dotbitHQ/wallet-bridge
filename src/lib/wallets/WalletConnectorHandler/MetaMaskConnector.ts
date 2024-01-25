import { WalletConnector } from './WalletConnector'
import { getWalletDeepLink, openDeepLink, shouldUseWalletConnect, sleep, toChecksumAddress } from '../../utils'
import { connect, Connector, disconnect, getNetwork, switchNetwork, getAccount } from '@wagmi/core'
import { EventEnum } from '../WalletEventListenerHandler'
import { resetWalletState, setWalletState } from '../../store'
import { isMobile } from 'react-device-detect'
import { snapshot } from 'valtio'
import { loginCacheState, setLoginCacheState } from '../../store/loginCache'
import { MetaMaskSigner, SignDataType } from '../WalletSignerHandler'

export class MetaMaskConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    const { wagmiConfig, chainId, provider, walletName } = this.context

    let connector
    if (shouldUseWalletConnect()) {
      connector = wagmiConfig.connectors.find((item: Connector) => {
        return item.id === 'walletConnect' && item.options.showQrModal === false
      })
    } else {
      connector = wagmiConfig.connectors.find((item: Connector) => {
        return item.id === 'injected'
      })
    }

    // eslint-disable-next-line lingui/no-unlocalized-strings
    const walletStateLocalStorage = globalThis.localStorage.getItem('WalletState')
    if (walletStateLocalStorage && wagmiConfig.status === 'connected') {
      await disconnect()
      // eslint-disable-next-line lingui/no-unlocalized-strings
      globalThis.localStorage.removeItem('WalletState')
    }

    if (wagmiConfig && wagmiConfig.status !== 'connected' && connector) {
      if (shouldUseWalletConnect()) {
        provider.once('display_uri', async (uri: string) => {
          if (isMobile) {
            if (walletName) {
              const deepLink = getWalletDeepLink(walletName, uri)
              openDeepLink(deepLink)
            }
          } else {
            // eslint-disable-next-line lingui/no-unlocalized-strings
            console.log('WalletConnect display_uri', uri)
            setLoginCacheState({ walletConnectDisplayUri: uri })
          }
        })
      }

      const { chain, account } = await connect({
        connector,
        chainId,
      })

      if (chainId && chainId !== chain.id && !shouldUseWalletConnect()) {
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
        const { signDataParams } = snapshot(loginCacheState)
        if (signDataParams) {
          const signature = await this.signData(signDataParams.data as SignDataType, signDataParams.isEIP712)
          this.context.emitEvent(EventEnum.Signature, signature)
        } else if (!ignoreEvent) {
          this.context.emitEvent(EventEnum.Connect)
        }
      }
    } else if (wagmiConfig.status === 'connected') {
      const network = getNetwork()
      if (chainId && chainId !== network.chain?.id && !shouldUseWalletConnect()) {
        await this.switchNetwork(chainId)
      }
      const { address } = getAccount()

      if (address && network.chain && network.chain.id === chainId) {
        this.context.address = toChecksumAddress(address)
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
    const signer = new MetaMaskSigner(this.context)
    await sleep(1000)
    return await signer.signData(data, {
      isEIP712,
    })
  }
}

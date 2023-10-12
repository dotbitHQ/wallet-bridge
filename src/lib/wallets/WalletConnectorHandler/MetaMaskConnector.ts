import { WalletConnector } from './WalletConnector'
import { shouldUseWalletConnect, toChecksumAddress } from '../../utils'
import { connect, Connector, disconnect, getNetwork, switchNetwork } from '@wagmi/core'
import { EventEnum } from '../WalletEventListenerHandler'
import { resetWalletState, setWalletState } from '../../store'
import { isAndroid, isIOS, isMobile } from 'react-device-detect'
import { CoinTypeToChainMap } from '../../constant'
import { snapshot } from 'valtio'
import { loginCacheState } from '../../store/loginCache'
import { MetaMaskSigner, SignDataType } from '../WalletSignerHandler'

export class MetaMaskConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    try {
      const { wagmiConfig, chainId, provider } = this.context

      let connector
      if (shouldUseWalletConnect()) {
        connector = wagmiConfig.connectors.find((item: Connector) => {
          return item.id === 'walletConnect'
        })
      } else {
        connector = wagmiConfig.connectors.find((item: Connector) => {
          return item.id === 'metaMask'
        })
      }

      const walletStateLocalStorage = localStorage.getItem('WalletState')
      if (walletStateLocalStorage && wagmiConfig.status === 'connected') {
        await disconnect()
        localStorage.removeItem('WalletState')
      }

      if (wagmiConfig && wagmiConfig.status !== 'connected' && connector) {
        if (shouldUseWalletConnect()) {
          provider.once('display_uri', async (uri: string) => {
            const uriStr = isAndroid
              ? uri
              : isIOS
              ? // currently broken in MetaMask v6.5.0 https://github.com/MetaMask/metamask-mobile/issues/6457
                `metamask://wc?uri=${encodeURIComponent(uri)}`
              : `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`
            if (uriStr.startsWith('http')) {
              const link = document.createElement('a')
              link.href = uriStr
              link.target = '_blank'
              link.rel = 'noreferrer noopener'
              link.click()
            } else {
              window.location.href = uriStr
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
        const { signDataParams } = snapshot(loginCacheState)
        if (signDataParams) {
          const signature = await this.signData(signDataParams.data as SignDataType, signDataParams.isEIP712)
          this.context.emitEvent(EventEnum.Signature, signature)
        } else if (!ignoreEvent) {
          this.context.emitEvent(EventEnum.Connect)
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

  async signData(data: SignDataType, isEIP712?: boolean): Promise<string | undefined> {
    try {
      const signer = new MetaMaskSigner(this.context)
      return await signer.signData(data, {
        isEIP712,
      })
    } catch (err) {
      console.error(err)
      return undefined
    }
  }
}

import { WalletConnector } from './WalletConnector'
import {
  getConnector,
  getWalletDeepLink,
  openDeepLink,
  removeWalletConnectQrModal,
  sleep,
  toChecksumAddress,
} from '../../utils'
import { connect, disconnect, getChainId, switchChain, getAccount } from '@wagmi/core'
import { EventEnum } from '../WalletEventListenerHandler'
import { resetWalletState, setWalletState } from '../../store'
import { loginCacheState, setLoginCacheState } from '../../store/loginCache'
import { snapshot } from 'valtio'
import { WalletConnectSigner } from '../WalletSignerHandler/WalletConnectSigner'
import { SignDataType } from '../WalletSignerHandler'
import { isMobile } from 'react-device-detect'
import { CustomWallet } from '../../constant'

export class WalletConnectConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    const { wagmiConfig, chainId: contextChainId, provider, walletName } = this.context
    const connector = getConnector(wagmiConfig, walletName!)

    const handleUri = async (uri: string) => {
      if (isMobile) {
        if (walletName === CustomWallet.walletConnect) return
        openDeepLink(getWalletDeepLink(walletName!, uri))
      } else {
        setLoginCacheState({ walletConnectDisplayUri: uri })
      }
    }

    let recoveryWalletConnectQrModal
    if (wagmiConfig?.state?.status !== 'connected' && connector) {
      if (connector.id === 'walletConnect') {
        provider.once('display_uri', handleUri)
        recoveryWalletConnectQrModal = removeWalletConnectQrModal(provider, walletName!)
      }

      let address: string
      try {
        const { accounts, chainId } = await connect(wagmiConfig, {
          connector,
          chainId: contextChainId,
        })
        address = accounts[0]
        if (contextChainId && contextChainId !== chainId) {
          void this.switchNetwork(contextChainId)
        }
      } catch (err) {
        console.log(err)
        throw err
      } finally {
        recoveryWalletConnectQrModal?.()
        if (connector.id === 'walletConnect') {
          provider.off('display_uri', handleUri)
        }
      }

      if (address) {
        this.context.address = toChecksumAddress(address)
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
    } else if (wagmiConfig.state.status === 'connected') {
      const chainId = getChainId(wagmiConfig)
      if (contextChainId && contextChainId !== chainId) {
        void this.switchNetwork(contextChainId)
      }

      const { address } = getAccount(wagmiConfig)

      if (address) {
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
    await disconnect(this.context.wagmiConfig)
    this.context.address = undefined
    this.context.chainId = undefined
    this.context.coinType = undefined
    resetWalletState()
    this.context.emitEvent(EventEnum.Disconnect)
  }

  async switchNetwork(chainId: number): Promise<void> {
    try {
      await switchChain(this.context.wagmiConfig, {
        chainId,
      })
    } catch (err) {
      console.error(err)
    }
  }

  async signData(data: SignDataType, isEIP712?: boolean): Promise<string | undefined> {
    const signer = new WalletConnectSigner(this.context)
    await sleep(1000)
    return await signer.signData(data, {
      isEIP712,
    })
  }
}

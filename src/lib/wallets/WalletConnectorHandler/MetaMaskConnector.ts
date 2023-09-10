import { WalletConnector } from './WalletConnector'
import { chainIdHexToNumber, numberToHex, toChecksumAddress } from '../../utils'
import { ChainId, ChainIdToChainInfoMap } from '../../constant'
import errno from '../../constant/errno'
import { resetWalletState, setWalletState } from '../../store'
import { EventEnum } from '../WalletEventListenerHandler'

export class MetaMaskConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    const { provider, chainId } = this.context
    const netVersion = provider.networkVersion
    const ethChainId = provider.chainId
    const _chainId = chainIdHexToNumber(netVersion || ethChainId)
    if (chainId && chainId !== _chainId) {
      await this.switchNetwork(chainId)
    }
    const res = await provider.request({ method: 'eth_requestAccounts' })
    if (res?.[0]) {
      this.context.address = toChecksumAddress(res[0])
      setWalletState({
        protocol: this.context.protocol,
        address: this.context.address,
        coinType: this.context.coinType,
      })
      if (!ignoreEvent) {
        this.context.emitEvent(EventEnum.Connect)
      }
    }
  }

  async disconnect(): Promise<void> {
    this.context.address = undefined
    this.context.chainId = undefined
    this.context.coinType = undefined
    resetWalletState()
    this.context.emitEvent(EventEnum.Disconnect)
  }

  async switchNetwork(chainId: ChainId): Promise<void> {
    const chainIdHex = numberToHex(chainId)
    const info = ChainIdToChainInfoMap[chainId]
    info.chainId = chainIdHex
    const provider = this.context.provider

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: chainIdHex,
          },
        ],
      })
    } catch (error: any) {
      console.error(error)
      if (error.code === errno.metaMaskUserDeniedMessageSignature) {
        throw error
      } else if (error.code === errno.metaMaskWalletRequestPermissions) {
        throw error
      } else {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName: info.networkName,
                nativeCurrency: {
                  name: info.symbol,
                  symbol: info.symbol,
                  decimals: info.decimals,
                },
                rpcUrls: [info.rpcUrl],
                blockExplorerUrls: [info.blockExplorerUrl],
              },
            ],
          })
        } catch (addError) {
          console.error(addError)
          throw addError
        }
      }
    }
  }
}

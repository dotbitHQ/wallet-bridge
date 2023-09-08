import { EventEnum, WalletEventListener } from './WalletEventListener'
import { watchAccount, watchNetwork } from '@wagmi/core'
import { resetWalletState, setWalletState } from '../../store'
import { chainIdHexToNumber, toChecksumAddress } from '../../utils'
import { ChainIdToCoinTypeMap, ChainIdToCoinTypeTestNetMap, CoinType } from '../../constant'
import { createTips } from '../../components'

export class WalletConnectEventListener extends WalletEventListener {
  unwatchAccount: (() => void) | undefined
  unwatchNetwork: (() => void) | undefined

  listenEvents(): void {
    this.unwatchAccount = watchAccount((account) => {
      const { address: oldAddress } = this.context
      const { address, isConnected, isDisconnected } = account
      if (address && oldAddress?.toLowerCase() !== address.toLowerCase() && isConnected) {
        this.context.address = toChecksumAddress(address)
        setWalletState({
          address: toChecksumAddress(address),
        })
        if (oldAddress) {
          this.context.emitEvent(EventEnum.Change)
        }
      } else if (isDisconnected) {
        this.removeEvents()
        this.context.address = undefined
        this.context.chainId = undefined
        this.context.coinType = undefined
        resetWalletState()
        this.context.emitEvent(EventEnum.Disconnect)
      }
    })

    this.unwatchNetwork = watchNetwork((network) => {
      const { chain } = network
      if (!chain) {
        return
      }
      const chainId = chain?.id
      const { isTestNet, coinType } = this.context
      const _chainId = chainIdHexToNumber(chainId)
      const _coinType = isTestNet ? ChainIdToCoinTypeTestNetMap[_chainId] : ChainIdToCoinTypeMap[_chainId]

      if (coinType === _coinType && this.context.chainId === _chainId) {
        return
      }

      if (_coinType) {
        this.context.chainId = _chainId
        this.context.coinType = _coinType
        setWalletState({
          coinType: _coinType,
        })
        this.context.emitEvent(EventEnum.Change)
      } else {
        let message
        switch (coinType) {
          case CoinType.eth:
            message = isTestNet
              ? 'Please switch your wallet to the Goerli test network before connecting'
              : 'Please switch your wallet to the Ethereum main network before connecting'
            break
          case CoinType.bsc:
            message = isTestNet
              ? 'Please switch your wallet to the BSC Testnet before connecting'
              : 'Please switch your wallet to the BSC main network before connecting'
            break
          case CoinType.matic:
            message = isTestNet
              ? 'Please switch your wallet to the Polygon Testnet before connecting'
              : 'Please switch your wallet to the Polygon Mainnet before connecting'
            break
        }

        if (message) {
          this.context.emitEvent(EventEnum.Error, message)
          createTips({
            title: 'Tips',
            content: message,
          })
        }
      }
    })
  }

  removeEvents(): void {
    this.unwatchAccount?.()
    this.unwatchNetwork?.()
  }
}

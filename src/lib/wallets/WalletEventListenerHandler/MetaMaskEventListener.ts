import { EventEnum, WalletEventListener } from './WalletEventListener'
import { chainIdHexToNumber, toChecksumAddress } from '../../utils'
import { ChainIdToCoinTypeMap, ChainIdToCoinTypeTestNetMap, CoinType } from '../../constant'
import { setWalletState } from '../../store'
import { createTips } from '../../components'

export class MetaMaskEventListener extends WalletEventListener {
  listenEvents(): void {
    const { provider } = this.context

    provider.on('accountsChanged', async (accounts: string[]) => {
      const { address } = this.context
      const account = accounts?.[0]

      if (account && address && account.toLowerCase() === address.toLowerCase()) {
        return
      }

      if (account) {
        this.context.address = toChecksumAddress(account)
        setWalletState({
          address: toChecksumAddress(account),
        })
        this.context.emitEvent(EventEnum.Change)
      }
    })

    provider.on('chainChanged', (chainId: string) => {
      const { isTestNet, coinType } = this.context
      const _chainId = chainIdHexToNumber(chainId)
      const _coinType = isTestNet ? ChainIdToCoinTypeTestNetMap[_chainId] : ChainIdToCoinTypeMap[_chainId]

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
    const { provider } = this.context
    provider.removeAllListeners('accountsChanged')
    provider.removeAllListeners('chainChanged')
  }
}

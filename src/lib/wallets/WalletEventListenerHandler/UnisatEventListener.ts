import { EventEnum, WalletEventListener } from './WalletEventListener'
import { setWalletState } from '../../store'
import { ChainIdToCoinTypeMap, ChainIdToCoinTypeTestNetMap, CoinType } from '../../constant'
import { t } from '@lingui/macro'
import { createTips } from '../../components'
import { WalletContext } from '../WalletContext'

export class UnisatEventListener extends WalletEventListener {
  watchAccountChange: (accounts: string[]) => void
  watchChainIdChange: (network: string) => void

  constructor(context: WalletContext) {
    super(context)
    this.watchAccountChange = this.watchAccountChangeFunc.bind(this)
    this.watchChainIdChange = this.watchChainIdChangeFunc.bind(this)
  }

  watchAccountChangeFunc(accounts: string[]): void {
    console.log('watchAccountChangeFunc: ', accounts)
    const { address: contextAddress } = this.context
    const address = accounts?.[0]

    if (!contextAddress || !address) {
      return
    }

    if (address && contextAddress && contextAddress.toLowerCase() === address.toLowerCase()) {
      return
    }

    if (address && contextAddress) {
      this.context.address = address
      setWalletState({
        address: this.context.address,
      })
      this.context.emitEvent(EventEnum.Change)
    }
  }

  watchChainIdChangeFunc(network: string): void {
    console.log('watchChainIdChangeFunc: ', network)

    if (!network) {
      return
    }

    network = network.toLowerCase()

    const { isTestNet, coinType, chainId: contextChainId } = this.context
    const _coinType = isTestNet ? ChainIdToCoinTypeTestNetMap[network] : ChainIdToCoinTypeMap[network]

    if (coinType === _coinType && contextChainId === network) {
      return
    }

    if (_coinType) {
      this.context.chainId = network
      this.context.coinType = _coinType
      setWalletState({
        coinType: _coinType,
      })
      this.context.emitEvent(EventEnum.Change)
    } else {
      let message
      switch (coinType) {
        case CoinType.btc:
          message = isTestNet
            ? t`Please switch your wallet to the Bitcoin testnet before connecting`
            : t`Please switch your wallet to the Bitcoin livenet before connecting`
          break
      }

      if (message) {
        this.context.emitEvent(EventEnum.Error, message)
        createTips({
          title: t`Tips`,
          content: message,
        })
      }
    }
  }

  listenEvents(): void {
    console.log('UnisatEventListener')
    const { provider } = this.context

    provider.on('accountsChanged', this.watchAccountChange)
    provider.on('networkChanged', this.watchChainIdChange)
  }

  removeEvents(): void {
    console.log('removeEvents')
    const { provider } = this.context

    provider.removeListener('accountsChanged', this.watchAccountChange)
    provider.removeListener('networkChanged', this.watchChainIdChange)
  }
}

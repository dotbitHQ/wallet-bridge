import { EventEnum, WalletEventListener } from './WalletEventListener'
import { chainIdHexToNumber, toChecksumAddress } from '../../utils'
import { ChainIdToCoinTypeMap, CoinType, ChainIdToCoinTypeTestNetMap } from '../../constant'
import { setWalletState } from '../../store'
import { createTips } from '../../components'
import { t } from '@lingui/macro'
import { debounce } from 'lodash-es'

export class TorusEventListener extends WalletEventListener {
  listenEvents(): void {
    this.removeEvents()
    const { provider } = this.context

    provider.on('accountsChanged', async (accounts: string[]) => {
      const { address } = this.context
      const account = accounts?.[0]

      if (account && address && account.toLowerCase() === address.toLowerCase()) {
        return
      }

      this.context.address = toChecksumAddress(account)
      setWalletState({
        address: toChecksumAddress(account),
      })
      this.context.emitEvent(EventEnum.Change)
    })

    provider.on('chainChanged', (chainId: string) => {
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
              ? t`Please switch your wallet to the Holesky test network before connecting`
              : t`Please switch your wallet to the Ethereum main network before connecting`
            break
          case CoinType.bsc:
            message = isTestNet
              ? t`Please switch your wallet to the BSC Testnet before connecting`
              : t`Please switch your wallet to the BSC main network before connecting`
            break
          case CoinType.matic:
            message = isTestNet
              ? t`Please switch your wallet to the Polygon Testnet before connecting`
              : t`Please switch your wallet to the Polygon Mainnet before connecting`
            break
        }

        if (message) {
          this.context.emitEvent(EventEnum.Error, message)
          debounce(() => {
            createTips({
              title: t`Tips`,
              content: message,
            })
          }, 1000)
        }
      }
    })
  }

  removeEvents(): void {
    const { provider } = this.context
    provider?.removeAllListeners?.('accountsChanged')
    provider?.removeAllListeners?.('chainChanged')
  }
}

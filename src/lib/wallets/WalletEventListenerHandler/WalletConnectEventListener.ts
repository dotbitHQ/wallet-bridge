import { EventEnum, WalletEventListener } from './WalletEventListener'
import { GetAccountReturnType, watchAccount } from '@wagmi/core'
import { resetWalletState, setWalletState } from '../../store'
import { chainIdHexToNumber, toChecksumAddress } from '../../utils'
import { ChainIdToCoinTypeMap, ChainIdToCoinTypeTestNetMap, CoinType } from '../../constant'
import { createTips } from '../../components'
import { t } from '@lingui/macro'
import { GetChainIdReturnType } from 'viem'

export class WalletConnectEventListener extends WalletEventListener {
  unwatchAccount: (() => void) | undefined
  unwatchChainId: (() => void) | undefined

  watchAccountChangeFunc(account: GetAccountReturnType, prevAccount: GetAccountReturnType): void {
    console.log('watchAccountChangeFunc: ', account)
    const { address: contextAddress } = this.context
    const { address, isConnected, isDisconnected } = account

    this.watchChainIdChangeFunc(account.chainId as number, prevAccount.chainId as number)

    if (isConnected) {
      if (!contextAddress) {
        return
      }

      if (address && contextAddress && contextAddress.toLowerCase() === address.toLowerCase()) {
        return
      }

      if (address && contextAddress) {
        this.context.address = toChecksumAddress(String(address))
        setWalletState({
          address: this.context.address,
        })
        this.context.emitEvent(EventEnum.Change)
      }
    } else if (isDisconnected && prevAccount.isConnected) {
      this.removeEvents()
      this.context.address = undefined
      this.context.chainId = undefined
      this.context.coinType = undefined
      resetWalletState()
      this.context.emitEvent(EventEnum.Disconnect)
    }
  }

  watchChainIdChangeFunc(chainId: GetChainIdReturnType, prevChainId: GetChainIdReturnType): void {
    console.log('watchChainIdChangeFunc: ', chainId)

    if (!chainId) {
      return
    }

    const { isTestNet, coinType, chainId: contextChainId } = this.context
    const _chainId = chainIdHexToNumber(chainId)
    const _coinType = isTestNet ? ChainIdToCoinTypeTestNetMap[_chainId] : ChainIdToCoinTypeMap[_chainId]

    if (coinType === _coinType && contextChainId === _chainId) {
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
        case CoinType.pol:
          message = isTestNet
            ? t`Please switch your wallet to the Polygon Testnet before connecting`
            : t`Please switch your wallet to the Polygon Mainnet before connecting`
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
    console.log('WalletConnectEventListener')
    const { wagmiConfig } = this.context

    this.unwatchAccount = watchAccount(wagmiConfig, {
      onChange: this.watchAccountChangeFunc.bind(this),
    })

    // this.unwatchChainId = watchChainId(wagmiConfig, {
    //   onChange: this.watchChainIdChangeFunc.bind(this),
    // })
  }

  removeEvents(): void {
    console.log('removeEvents: ', this.unwatchAccount, this.unwatchChainId)
    this.unwatchAccount?.()
    this.unwatchChainId?.()
  }
}

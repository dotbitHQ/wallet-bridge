import { EventEnum, WalletEventListener } from './WalletEventListener'
import { WalletContext } from '../WalletContext'
import { chainIdHexToNumber } from '../../utils'
import { setWalletState } from '../../store'
import { ChainIdToCoinTypeMap, CoinType, ChainIdToCoinTypeTestNetMap } from '../../constant'
import { debounce } from 'lodash-es'
import { createTips } from '../../components'
import { t } from '@lingui/macro'

export class TronLinkEventListener extends WalletEventListener {
  async messageEvent(event: MessageEvent, context: WalletContext) {
    if (!event?.data?.isTronLink) {
      return
    }

    if (event.data?.message?.action === 'setAccount') {
      const { address } = context
      const account = event.data?.message?.data?.address

      if (account && address && account.toLowerCase() === address.toLowerCase()) {
        return
      }

      if (account) {
        context.address = account
        setWalletState({
          address: account,
        })
        context.emitEvent(EventEnum.Change)
      }
    }

    if (event.data?.message?.action === 'setNode') {
      const { isTestNet, coinType } = context
      let _chainId = event.data?.message?.data?.node?.chainId
      if (_chainId) {
        _chainId = chainIdHexToNumber(_chainId)
      }
      const _coinType = isTestNet ? ChainIdToCoinTypeTestNetMap[_chainId] : ChainIdToCoinTypeMap[_chainId]

      if (coinType === _coinType && this.context.chainId === _chainId) {
        return
      }

      if (_coinType) {
        context.chainId = _chainId
        context.coinType = _coinType
        setWalletState({
          coinType: _coinType,
        })
        context.emitEvent(EventEnum.Change)
      } else {
        let message: string = ''
        switch (coinType) {
          case CoinType.trx:
            message = isTestNet
              ? t`Please switch your wallet to the TRON Nile test network before connecting`
              : t`Please switch your wallet to the TRON main network before connecting`
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
    }
  }

  handleMessageEvent = async (event: MessageEvent) => {
    await this.messageEvent(event, this.context)
  }

  listenEvents(): void {
    window.addEventListener('message', this.handleMessageEvent)
  }

  removeEvents(): void {
    window.removeEventListener('message', this.handleMessageEvent)
  }
}

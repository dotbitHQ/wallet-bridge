import { EventEnum, WalletEventListener } from './WalletEventListener'
import { resetWalletState, setWalletState } from '../../store'
import { ChainIdToCoinTypeMap, CoinType, ChainIdToCoinTypeTestNetMap } from '../../constant'
import { createTips } from '../../components'
import { t } from '@lingui/macro'
import { WalletContext } from '../WalletContext'

let eventTabReplyDebounce = false

export class TronLinkEventListener extends WalletEventListener {
  messageEvent: (event: MessageEvent) => Promise<void>

  constructor(context: WalletContext) {
    super(context)
    this.messageEvent = this.messageEventFun.bind(this)
  }

  async messageEventFun(event: MessageEvent) {
    if (!event?.data?.isTronLink) {
      return
    }

    if (event.data?.message?.action === 'tabReply') {
      const { isTestNet, coinType } = this.context
      const _chainId = event.data?.message?.data?.data?.chainId
      const isAuth = event.data?.message?.data?.data?.isAuth

      if (!_chainId || !isAuth || eventTabReplyDebounce) {
        if (_chainId && isAuth === false) {
          this.removeEvents()
          this.context.address = undefined
          this.context.chainId = undefined
          this.context.coinType = undefined
          resetWalletState()
          this.context.emitEvent(EventEnum.Disconnect)
        }
        return
      }

      eventTabReplyDebounce = true
      globalThis.setTimeout(() => {
        eventTabReplyDebounce = false
      }, 1000)

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
          createTips({
            title: t`Tips`,
            content: message,
          })
        }
      }
    }

    if (event.data?.message?.action === 'setAccount') {
      const { address } = this.context
      const account = event.data?.message?.data?.address

      if (account && address && account.toLowerCase() === address.toLowerCase()) {
        return
      }

      if (account && address) {
        this.context.address = account
        setWalletState({
          address: account,
        })
        this.context.emitEvent(EventEnum.Change)
      }
    }

    if (event.data?.message?.action === 'setNode') {
      const { isTestNet, coinType } = this.context
      const _chainId = event.data?.message?.data?.node?.chainId
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
          createTips({
            title: t`Tips`,
            content: message,
          })
        }
      }
    }

    if (event.data?.message?.action === 'disconnect') {
      this.removeEvents()
      this.context.address = undefined
      this.context.chainId = undefined
      this.context.coinType = undefined
      resetWalletState()
      this.context.emitEvent(EventEnum.Disconnect)
    }
  }

  listenEvents(): void {
    window.addEventListener('message', this.messageEvent)
  }

  removeEvents(): void {
    window.removeEventListener('message', this.messageEvent)
  }
}

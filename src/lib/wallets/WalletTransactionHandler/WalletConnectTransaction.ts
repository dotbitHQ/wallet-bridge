import { ISendTrxParams, WalletTransaction } from './WalletTransaction'
import { getWalletDeepLink, openDeepLink, shouldUseWalletConnect, utf8ToHex } from '../../utils'
import { sendTransaction } from '@wagmi/core'
import { parseUnits } from 'viem'

export class WalletConnectTransaction extends WalletTransaction {
  async sendTrx(data: ISendTrxParams): Promise<string> {
    const { chainId, walletName, provider } = this.context
    let _data: string = ''
    if (data.data != null) {
      _data = utf8ToHex(data.data)
    }
    if (shouldUseWalletConnect()) {
      const sessionTopic: string = provider.session.pairingTopic
      if (walletName && sessionTopic) {
        const deepLink = getWalletDeepLink(walletName, `wc:${sessionTopic}@2`)
        openDeepLink(deepLink)
      }
    }
    console.log('sendTransaction: ', chainId, data.to, data.value, _data)
    const { hash } = await sendTransaction({
      chainId,
      to: data.to,
      value: parseUnits(data.value, 0),
      data: _data as any,
    })
    return hash
  }
}

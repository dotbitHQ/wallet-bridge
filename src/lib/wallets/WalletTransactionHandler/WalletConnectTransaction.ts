import { ISendTrxParams, WalletTransaction } from './WalletTransaction'
import { getWalletDeepLink, openDeepLink, utf8ToHex } from '../../utils'
import { sendTransaction } from '@wagmi/core'
import { type Address, parseUnits } from 'viem'
import { isMobile } from 'react-device-detect'
import { CustomWallet } from '../../constant'

export class WalletConnectTransaction extends WalletTransaction {
  async sendTrx(data: ISendTrxParams): Promise<string> {
    const { walletName, provider, wagmiConfig } = this.context

    let _data: string = ''
    if (data.data) {
      _data = utf8ToHex(data.data)
    }

    if (provider?.isWalletConnect && isMobile && walletName !== CustomWallet.walletConnect) {
      const session = provider.session
      if (walletName && session) {
        const deepLink = getWalletDeepLink(
          walletName,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `wc:${session?.pairingTopic}@2?expiryTimestamp=${session?.expiry}&relay-protocol=${session?.relay?.protocol}`,
        )
        openDeepLink(deepLink)
      }
    }

    const hash = await sendTransaction(wagmiConfig, {
      to: data.to as Address,
      value: parseUnits(data.value, 0),
      data: _data as any,
    })
    return hash
  }
}

import { SignDataOptions, SignDataType, WalletSigner } from './WalletSigner'
import { getWalletDeepLink, isHexStrict, openDeepLink } from '../../utils'
import { signMessage, signTypedData } from '@wagmi/core'
import { CustomWallet } from '../../constant'
import { isMobile } from 'react-device-detect'

export class WalletConnectSigner extends WalletSigner {
  async signData(data: SignDataType, options?: SignDataOptions): Promise<string> {
    const { walletName, provider, wagmiConfig } = this.context

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

    let res
    if (options?.isEIP712) {
      res = await signTypedData(wagmiConfig, data as any)
    } else {
      let _data = data
      // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-plus-operands
      if (isHexStrict('0x' + data)) {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-plus-operands
        _data = '0x' + data
      }

      res = await signMessage(wagmiConfig, {
        message: String(_data),
      })
    }
    return res
  }
}

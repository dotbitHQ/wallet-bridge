import { Header, SwapChildProps } from '../../components'
import { QRCode } from '../../components/QRCode'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { setLoginCacheState, useLoginCacheState } from '../../store/loginCache'
import { CustomWallet } from '../../constant'
import { t } from '@lingui/macro'

export function WalletConnectQrCode({ transitionRef, transitionStyle }: SwapChildProps) {
  const { onClose, goBack } = useSimpleRouter()!
  const { loginCacheSnap } = useLoginCacheState()

  const close = () => {
    setLoginCacheState({ walletName: '', walletConnectDisplayUri: '' })
    onClose?.()
  }

  const back = () => {
    setLoginCacheState({ walletName: '', walletConnectDisplayUri: '' })
    goBack?.()
  }

  return (
    <>
      <Header
        title={loginCacheSnap.walletName}
        onClose={close}
        goBack={back}
        className="bg-blur z-10 mt-0.5 w-full-4px bg-white p-6"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div
        className="flex w-full flex-col items-center justify-start px-6 pb-6 pt-[76px]"
        ref={transitionRef}
        style={transitionStyle}
      >
        <div className="text-center text-[14px] leading-tight text-neutral-700">
          {loginCacheSnap.walletName === CustomWallet.walletConnect
            ? t`Scan with your phone`
            : // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              t`Scan with ${loginCacheSnap.walletName}`}
        </div>
        <div className="relative my-3 mb-9 size-[260px] rounded-2xl border border-stone-300/20 p-2">
          <QRCode data={loginCacheSnap.walletConnectDisplayUri} />
        </div>
      </div>
    </>
  )
}

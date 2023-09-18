import { Header, SwapChildProps } from '../../components'
import { QRCode } from '../../components/QRCode'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { setLoginCacheState, useLoginCacheState } from '../../store/loginCache'

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
        title="WalletConnect"
        onClose={close}
        goBack={back}
        className="bg-blur z-10 w-full bg-white p-6"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div
        className="flex w-full flex-col items-center justify-start px-6 pb-6 pt-[76px]"
        ref={transitionRef}
        style={transitionStyle}
      >
        <div className="text-center text-[14px] leading-tight text-neutral-700">Scan with your phone</div>
        <div className="relative my-3 mb-9 h-[260px] w-[260px] rounded-2xl border border-stone-300/20 p-2">
          <QRCode data={loginCacheSnap.walletConnectDisplayUri} />
        </div>
      </div>
    </>
  )
}

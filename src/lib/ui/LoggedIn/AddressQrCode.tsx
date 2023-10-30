import { t } from '@lingui/macro'
import { Header, SwapChildProps } from '../../components'
import { QRCode } from '../../components/QRCode'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { useWalletState } from '../../store'

export function AddressQRCode({ transitionRef, transitionStyle }: SwapChildProps) {
  const { walletSnap } = useWalletState()
  const { onClose, goBack } = useSimpleRouter()!

  const close = () => {
    onClose?.()
  }

  const back = () => {
    goBack?.()
  }

  return (
    <>
      <Header
        title={t`QR Code`}
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
        <div className="relative my-3 mb-9 h-[270px] w-[270px]">
          <QRCode data={walletSnap.address} />
        </div>
      </div>
    </>
  )
}

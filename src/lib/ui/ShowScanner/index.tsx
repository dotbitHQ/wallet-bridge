import clsx from 'clsx'
import { QrCodeScanner } from '../../components/QrCodeScanner'
import { setQrCodeData, useWebAuthnState } from '../../store/webAuthnState'
import { useCallback } from 'react'
import { Result } from '@zxing/library'
import { Header, SwapChildProps } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'

export function ShowScanner({ transitionRef, transitionStyle }: SwapChildProps) {
  const webAuthnState = useWebAuthnState()
  const { goBack, onClose } = useSimpleRouter()!
  const onSuccess = useCallback(
    (result: Result) => {
      setQrCodeData(result.getText())
      goBack!()
    },
    [goBack],
  )

  return (
    <>
      <Header
        goBack={goBack}
        onClose={onClose}
        title="Scan QR Code"
        className="z-10 w-full bg-white p-6"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div className="w-full px-6 pb-6 pt-[76px]" ref={transitionRef} style={transitionStyle}>
        <QrCodeScanner
          stream={webAuthnState.mediaStream.inner!}
          className={clsx('h-[400px] w-full rounded-xl bg-black')}
          onSuccess={onSuccess}
        />
      </div>
    </>
  )
}

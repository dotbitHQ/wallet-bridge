import clsx from 'clsx'
import { QrCodeScanner } from '../../components/QrCodeScanner'
import { setQrCodeData, useWebAuthnState } from '../../store/webAuthnState'
import { useCallback } from 'react'
import { Header, SwapChildProps } from '../../components'
import { Result } from '../../../deps/zxing/dist/esnext'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { t } from '@lingui/macro'

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
        title={t`Scan QR Code`}
        className="z-10 mt-0.5 w-full-4px bg-white p-6"
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

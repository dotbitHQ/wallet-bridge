import clsx from 'clsx'
import { QrCodeScanner } from '../../components/QrCodeScanner'
import { setQrCodeData, useWebAuthnState } from '../../store/webAuthnState'
import { useCallback } from 'react'
import { Result } from '@zxing/library'
import { Header } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'

export function ShowScanner() {
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
      <Header className="p-6" goBack={goBack} onClose={onClose} title="Scan QR Code" />
      <div className="w-full px-6 pb-6">
        <QrCodeScanner
          stream={webAuthnState.mediaStream.inner!}
          className={clsx('h-[400px] w-full rounded-xl bg-black')}
          onSuccess={onSuccess}
        />
      </div>
    </>
  )
}

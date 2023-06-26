import clsx from 'clsx'
import { Html5Qrcode, Html5QrcodeCameraScanConfig, QrcodeSuccessCallback } from 'html5-qrcode'
import { Html5QrcodeErrorTypes } from 'html5-qrcode/esm/core'
import { useEffect } from 'react'

interface QrCodeScannerProps {
  className?: string
  onSuccess: QrcodeSuccessCallback
  onNotPermitted: () => void
  onClose: () => void
  onStart: () => void
  media: MediaTrackConstraints
  config: Html5QrcodeCameraScanConfig
}

export function QrCodeScanner(props: QrCodeScannerProps) {
  const { onStart, onClose, onSuccess, onNotPermitted, media, config } = props
  useEffect(() => {
    const scannerInstance = new Html5Qrcode('scanner')
    ;(async () => {
      onStart()
      try {
        await scannerInstance.start(
          media,
          config,
          (text, result) => {
            onSuccess(text, result)
            scannerInstance.stop().then(onClose)
          },
          (_, e) => {},
        )
      } catch (e) {
        console.error(e)
        onNotPermitted()
      }
    })()
    return () => scannerInstance.clear()
  }, [onStart, onClose, onSuccess, onNotPermitted])

  return (
    <div id="scanner" className={clsx('[&>video]:h-full [&>video]:w-full [&>video]:object-cover', props.className)} />
  )
}

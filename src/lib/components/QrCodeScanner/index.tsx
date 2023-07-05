import { useEffect, useMemo, useRef } from 'react'
import { BrowserQRCodeReader, IBrowserCodeReaderOptions } from '@zxing/browser'
import { Result } from '@zxing/library'
import clsx from 'clsx'

export async function getCamera(constraints: MediaStreamConstraints) {
  constraints.audio = false
  return await navigator.mediaDevices.getUserMedia(constraints)
}

interface QrCodeScannerProps {
  stream: MediaStream
  config?: IBrowserCodeReaderOptions
  onSuccess: (res: Result) => void
  onError?: (err: any) => void
  className?: string
}

export function QrCodeScanner(props: QrCodeScannerProps) {
  const nodeRef = useRef<HTMLVideoElement>(null)
  const { stream, config, onSuccess, onError = console.error, className } = props
  const codeReader = useMemo(() => new BrowserQRCodeReader(undefined, config), [config])
  useEffect(() => {
    if (nodeRef.current == null) return
    codeReader.decodeOnceFromStream(stream, nodeRef.current).then(onSuccess, onError)
    return () => {
      stream.getTracks().forEach((track) => {
        track.stop()
      })
    }
  }, [stream, nodeRef, codeReader, onSuccess, onError])
  return <video className={clsx('object-cover', className)} ref={nodeRef} />
}

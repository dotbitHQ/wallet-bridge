import { useEffect, useRef, useState } from 'react'
import { BrowserCodeReader, BrowserQRCodeReader, IBrowserCodeReaderOptions } from '@zxing/browser'
import { Result } from '@zxing/library'
import clsx from 'clsx'

export function getCamera(constraints: MediaStreamConstraints) {
  constraints.audio = false
  return navigator.mediaDevices.getUserMedia(constraints)
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
  const codeReader = new BrowserQRCodeReader(undefined, config)
  useEffect(() => {
    if (!nodeRef.current) return
    codeReader.decodeOnceFromStream(stream, nodeRef.current).then(onSuccess, onError)
    return () => {
      stream.getTracks().forEach((track) => track.stop())
    }
  }, [stream, nodeRef])
  return <video className={clsx('object-cover', className)} ref={nodeRef} />
}

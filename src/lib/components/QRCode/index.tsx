import { useEffect, useState } from 'react'
import QR, { Options } from 'styled-qr-code'

export function QRCode(props: Omit<Options, 'type'>) {
  const {
    width = 300,
    height = 300,
    dotsOptions = { color: '#000000', type: 'dots' },
    cornersSquareOptions = { color: '#000000', type: 'extra-rounded' },
    cornersDotOptions = { color: '#000000', type: 'dot' },
    qrOptions = { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'L' },
    ...rest
  } = props

  const [blobUrl, setBlobUrl] = useState<string>()

  useEffect(() => {
    const qr = new QR({
      width,
      height,
      dotsOptions,
      cornersDotOptions,
      cornersSquareOptions,
      qrOptions,
      ...rest,
    })

    qr.getRawData()
      .then((blob) => {
        setBlobUrl(window.URL.createObjectURL(blob!))
      })
      .catch(console.error)
    // eslint-disable-next-line
  }, [])

  return <img width={width} height={height} src={blobUrl} />
}

import { Button, ButtonShape, ButtonSize } from '../../components'
import { QRCode } from '../../components/QRCode'
import { useSimpleRouter } from '../../components/SimpleRouter'
export function ShowQRCode() {
  const goNext = useSimpleRouter()?.goNext
  return (
    <div className="flex flex-col items-center justify-start px-6 py-20">
      <div className="text-center text-[14px] leading-tight text-neutral-700">
        Scan the QR code (or access the link) below with your another device, and follow the instructions provided.
      </div>
      <div className="my-3 h-[130px] w-[130px] rounded-2xl border-stone-300 border-opacity-20 p-5">
        <QRCode data="https://10.143.1.26:20203/DID" />
      </div>
      <a className="text-[14px] text-blue-800">https://10.143.1.26:20203/DID</a>
      <Button className="m-6 min-w-[130px] px-5" size={ButtonSize.middle} shape={ButtonShape.round} onClick={goNext}>
        Next
      </Button>
    </div>
  )
}

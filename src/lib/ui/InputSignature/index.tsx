import { ChangeEvent, useCallback, useState } from 'react'
import {
  Button,
  ButtonShape,
  ButtonSize,
  Header,
  LoadingIcon,
  PasteIcon,
  ScanIcon,
  WarningOutlineIcon,
} from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'
import clsx from 'clsx'
import { getCamera } from '../../components/QrCodeScanner'
import { ConnectDID } from 'connect-did-sdk'
import { setBackupDeviceData, setMediaStream, setQrCodeData, useWebAuthnState } from '../../store/webAuthnState'

function exceptionToMessage(err: DOMException) {
  if (err.name === 'NotAllowedError') {
    return {
      title: 'No Camera Permission',
      desc: 'Scanning QR code requires access to the camera. Please enable camera permission.',
    }
  } else if (err.name === 'NotFoundError') {
    return {
      title: 'No Camera Found',
      desc: 'No available camera was found to scan QR code. Please try pasting the data directly.',
    }
  } else {
    return {
      title: 'Unknown Error',
      desc: 'Unknown error happened. Please try again or paste the data directly.',
    }
  }
}

function DomException({ err, className }: { err: DOMException; className?: string }) {
  const { title, desc } = exceptionToMessage(err)
  return (
    <div
      className={clsx(
        'flex w-full flex-row items-start justify-start gap-2 rounded-xl border border-amber-300/40 bg-amber-300/5 p-3',
        className,
      )}
    >
      <WarningOutlineIcon className="h-5 w-5 flex-none text-yellow-500" />

      <div className="flex-1">
        <div className="text-[16px] leading-[20px] text-yellow-700">{title}</div>
        <div className="shrink grow basis-0 text-[14px] font-normal text-yellow-700">{desc}</div>
      </div>
    </div>
  )
}

const connectDID = new ConnectDID()

function verifyData(data: string) {
  let result = true
  try {
    connectDID.decodeQRCode(data)
  } catch (err) {
    result = false
  }
  return result
}

export function InputSignature() {
  const { goNext, goBack, goTo, onClose } = useSimpleRouter()!
  // const [data, setData] = useState('')
  const [permissionError, setPermissionError] = useState<DOMException | undefined>(undefined)
  const [requiringPermission, setRequiringPermission] = useState(false)
  const { qrCodeData: data } = useWebAuthnState()
  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setQrCodeData(e.target.value)
  }, [])

  const onPaste = useCallback(() => {
    navigator.clipboard.readText().then(setQrCodeData, console.error)
  }, [])

  const onClickScan = useCallback(async () => {
    try {
      setRequiringPermission(true)
      const media = await getCamera({ video: { facingMode: 'environment' } })
      setMediaStream(media)
      goTo('ShowScanner')
    } catch (err) {
      if (err instanceof DOMException) {
        setPermissionError(err)
      } else {
        console.error(err)
      }
    } finally {
      setRequiringPermission(false)
    }
  }, [setPermissionError, setRequiringPermission, goTo])

  const isValidData = verifyData(data)

  return (
    <>
      <Header className="p-6" title="Add Device" goBack={goBack} onClose={onClose} />
      <div className={clsx('flex w-full flex-col items-center justify-start p-6')}>
        <div className="text-center text-[14px] leading-tight text-neutral-700">
          Scan the QR code generated by your another device using this device, or paste the data here.
        </div>
        <div className="relative mt-6 w-full">
          <textarea
            className="block h-[108px] w-full resize-none rounded-xl border border-stone-300/20 bg-neutral-100 py-3 pl-4 pr-3 text-[16px] text-neutral-700 focus:border-emerald-400 focus:bg-white focus:outline-offset-1 focus:outline-emerald-400/20 focus:ring-0"
            placeholder="Paste data or scan QR code"
            value={data}
            onChange={onChange}
          />
          <div className="absolute bottom-0 right-0 inline-block p-3">
            <PasteIcon onClick={onPaste} className="w-[21px] cursor-pointer" />
            {requiringPermission ? (
              <LoadingIcon className="animation-rotate-360-deg ml-4 w-[23px] cursor-pointer" />
            ) : (
              <ScanIcon onClick={onClickScan} className="ml-4 w-[23px] cursor-pointer" />
            )}
          </div>
        </div>
        {data.length > 0 && !isValidData && (
          <div className="mt-1 w-full text-[14px] font-normal text-red-400">Incorrect data</div>
        )}
        {permissionError != null && <DomException className="mt-6" err={permissionError} />}
        <Button
          disabled={data.length === 0 || !isValidData}
          className="m-6 w-full px-5"
          size={ButtonSize.middle}
          shape={ButtonShape.round}
          onClick={() => {
            setBackupDeviceData(connectDID.decodeQRCode(data))
            goNext?.()
          }}
        >
          Next
        </Button>
      </div>
    </>
  )
}
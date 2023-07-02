import { useEffect, useMemo, useRef } from 'react'
import Clipboard from 'clipboard'
import { ConnectDID } from 'connect-did-sdk'
import { Button, ButtonShape, ButtonSize, CopyIcon, Header } from '../../components'
import { QRCode } from '../../components/QRCode'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { useWalletState } from '../../store'

const connectDID = new ConnectDID(true)

export function ShowQRCode() {
  const { goNext, onClose, goBack } = useSimpleRouter()!
  const nodeRef = useRef(null)
  useEffect(() => {
    if (!nodeRef.current) return
    new Clipboard(nodeRef.current)
  }, [nodeRef])
  const { walletSnap } = useWalletState()
  const url = useMemo(
    () => connectDID.requestBackupData({ ckbAddr: walletSnap.address!, isOpen: false }),
    [walletSnap.address],
  )
  return (
    <>
      <Header className="p-6" title="Add Device" onClose={onClose} goBack={goBack} />
      <div className="flex w-full flex-col items-center justify-start px-6 py-20">
        <div className="text-center text-[14px] leading-tight text-neutral-700">
          Scan the QR code (or access the link) below with your another device, and follow the instructions provided.
        </div>
        <div className="my-3 h-[130px] w-[130px] rounded-2xl border-stone-300 border-opacity-20 p-5">
          <QRCode data="https://10.143.1.26:20203/DID" />
        </div>
        <span className="inline-block cursor-pointer whitespace-nowrap" ref={nodeRef} data-clipboard-target="#copy-url">
          <a
            id="copy-url"
            className="inline-block w-[141px] overflow-auto overflow-ellipsis align-middle text-[14px] text-blue-800"
          >
            {url}
          </a>
          <CopyIcon className="ml-1 inline-block h-[13px] w-3 align-middle text-[#B0B8BF]" />
        </span>
        <Button
          className="m-6 min-w-[130px] px-5"
          size={ButtonSize.middle}
          shape={ButtonShape.round}
          onClick={() => goNext && goNext()}
        >
          Next
        </Button>
      </div>
    </>
  )
}

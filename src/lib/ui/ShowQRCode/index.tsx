import { useCallback, useEffect, useMemo, useRef } from 'react'
import Clipboard from 'clipboard'
import { ConnectDID } from 'connect-did-sdk'
import { Button, ButtonShape, ButtonSize, CopyIcon, Header, SwapChildProps } from '../../components'
import { QRCode } from '../../components/QRCode'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { useWalletState } from '../../store'
import { createToast } from '../../components/Toast'

const connectDID = new ConnectDID(true)

export function ShowQRCode({ transitionRef, transitionStyle }: SwapChildProps) {
  const { goNext, onClose, goBack } = useSimpleRouter()!
  const nodeRef = useRef(null)
  const handleCopied = useCallback(() => {
    createToast({
      message: '👌 Copied',
    })
  }, [])
  useEffect(() => {
    if (!nodeRef.current) return
    const clipboard = new Clipboard(nodeRef.current)

    clipboard.on('success', handleCopied)
    clipboard.on('error', (e) => {
      console.error(e)
    })
    return () => {
      clipboard.destroy()
    }
  }, [nodeRef, handleCopied])
  const { walletSnap } = useWalletState()
  const url = useMemo(
    () => connectDID.requestBackupData({ ckbAddr: walletSnap.address!, isOpen: false }),
    [walletSnap.address],
  )
  return (
    <>
      <Header
        title="Add Device"
        onClose={onClose}
        goBack={goBack}
        className="z-10 w-full bg-white p-6"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div
        className="flex w-full flex-col items-center justify-start px-6 pb-4 pt-[76px]"
        ref={transitionRef}
        style={transitionStyle}
      >
        <div className="text-center text-[14px] leading-tight text-neutral-700">
          Scan the QR code (or access the link) below with your another device, and follow the instructions provided.
        </div>
        <div className="relative my-3 h-[260px] w-[260px] rounded-2xl border border-stone-300/20 p-2">
          <QRCode data={url} />
        </div>
        <span
          className="inline-block cursor-pointer whitespace-nowrap leading-none hover:opacity-60"
          ref={nodeRef}
          data-clipboard-text={url}
        >
          <a
            id="copy-url"
            className="inline-block w-[141px] overflow-auto text-ellipsis align-middle text-[14px] leading-none text-blue-800"
          >
            {url}
          </a>
          <CopyIcon className="ml-1 inline-block h-[13px] w-3 select-none align-middle leading-none text-[#B0B8BF]" />
        </span>
        <Button className="mt-6 min-w-[130px] px-5" size={ButtonSize.middle} shape={ButtonShape.round} onClick={goNext}>
          Next
        </Button>
      </div>
    </>
  )
}

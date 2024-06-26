import { useCallback, useMemo } from 'react'
import { ConnectDID } from 'connect-did-sdk'
import { Button, ButtonShape, ButtonSize, Header, SwapChildProps } from '../../components'
import { QRCode } from '../../components/QRCode'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { useWalletState } from '../../store'
import { createToast } from '../../components/Toast'
import { copyText } from '../../utils'
import { t } from '@lingui/macro'

export function ShowQRCode({ transitionRef, transitionStyle }: SwapChildProps) {
  const { goNext, onClose, goBack } = useSimpleRouter()!
  const { walletSnap } = useWalletState()
  const connectDID = useMemo(() => new ConnectDID(walletSnap.isTestNet), [walletSnap.isTestNet])
  const url = useMemo(
    () => connectDID.requestBackupData({ ckbAddr: walletSnap.address!, isOpen: false }),
    [walletSnap.address, connectDID],
  )
  const handleCopy = useCallback(() => {
    copyText(url)
      .then(() => {
        createToast({
          message: t`👌 Copied`,
        })
      })
      .catch(console.error)
  }, [url])
  return (
    <>
      <Header
        title={t`Add Trusted Device`}
        onClose={onClose}
        goBack={goBack}
        className="bg-blur z-10 mt-0.5 w-full-4px bg-white p-6"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div
        className="flex w-full flex-col items-center justify-start px-6 pb-6 pt-[76px]"
        ref={transitionRef}
        style={transitionStyle}
      >
        <div className="text-center text-[14px] leading-tight text-neutral-700">
          {t`Use the QR code or link below on your other trusted devices and follow the instructions inside.`}
        </div>
        <div className="relative my-3 size-[260px] rounded-2xl border border-stone-300/20 p-2">
          <QRCode data={url} />
        </div>
        <div
          id="copy-url"
          className="inline-flex w-[260px] items-center gap-1 rounded-md border border-slate-300/40 bg-gray-50 p-1 pl-3"
        >
          <span className="scrollbar-hide flex-1 overflow-x-scroll whitespace-nowrap text-sm font-normal leading-tight text-gray-500">
            {url}
          </span>
          <Button className="flex-none" onClick={handleCopy} size={ButtonSize.small}>
            {t`Copy`}
          </Button>
        </div>
        <Button className="mt-6 w-full" size={ButtonSize.middle} shape={ButtonShape.round} onClick={goNext}>
          {t`Next`}
        </Button>
      </div>
    </>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { Button, ButtonShape, ButtonSize, Header, SwapChildProps, createTips, DeviceIcon } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'
import clsx from 'clsx'
import { emojis } from './png'
import { setSelectedEmoji, setSignData, useWebAuthnState } from '../../store/webAuthnState'
import { useQuery } from '@tanstack/react-query'
import { useWalletState } from '../../store'
import { useWebAuthnService } from '../../services'

type EmojiProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
  name: string
}

export function Emoji({ name, ...rest }: EmojiProps) {
  return <img {...rest} src={emojis[name as any as keyof typeof emojis] || ''} />
}

export function ChooseEmoji({ transitionRef, transitionStyle }: SwapChildProps) {
  const { goNext, goBack, onClose } = useSimpleRouter()!
  const { walletSnap } = useWalletState()
  const webAuthnState = useWebAuthnState()
  const [selected, setSelected] = useState<string>()
  const onClick = useCallback(
    (k: string) => () => {
      setSelected(k)
    },
    [setSelected],
  )

  const webAuthnService = useWebAuthnService(walletSnap.isTestNet)

  const signDataQuery = useQuery({
    queryKey: [
      'FetchSignData',
      {
        master: walletSnap.address,
        slave: webAuthnState.backupDeviceData?.ckbAddr,
        notes: webAuthnState.backupDeviceData?.name,
      },
    ],
    enabled: false,
    retry: false,
    queryFn: async () => {
      if (
        walletSnap.address === undefined ||
        webAuthnState.backupDeviceData?.ckbAddr === undefined ||
        selected === undefined ||
        webAuthnState.backupDeviceData?.name === undefined
      )
        throw new Error('unreachable')
      const res = await webAuthnService.buildTransaction({
        master_ckb_address: walletSnap.address,
        slave_ckb_address: webAuthnState.backupDeviceData.ckbAddr,
        operation: 'add',
        avatar: parseInt(selected),
        notes: webAuthnState.backupDeviceData?.name,
        master_notes:
          walletSnap.address === walletSnap.deviceData?.ckbAddr ? walletSnap.deviceData.name : walletSnap.masterNotes,
      })
      if (res.err_no !== 0) throw new Error(res.err_msg)
      return res.data
    },
  })

  useEffect(() => {
    if (signDataQuery.isError) {
      createTips({
        title: 'Error',
        content: (
          <div className="mt-2 w-full break-words text-[14px] font-normal leading-normal text-red-400">
            {(signDataQuery?.error as any)?.toString()}{' '}
          </div>
        ),
      })
    }
  }, [signDataQuery.isError, signDataQuery.error])
  return (
    <>
      <Header
        title="Add Trusted Device"
        goBack={goBack}
        onClose={onClose}
        className="bg-blur z-10 w-full bg-white p-6"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div
        className="flex w-full flex-col items-center justify-start px-6 pb-6 pt-20"
        ref={transitionRef}
        style={transitionStyle}
      >
        <div className="w-full text-center text-[16px] leading-normal text-neutral-700">
          Choose a emoji to label the device.
        </div>
        <div className="mt-6 grid w-full grid-cols-6 rounded-2xl border border-stone-300/20 bg-gray-50 p-2">
          {Object.keys(emojis)?.map((k) => (
            <div
              onClick={onClick(k)}
              key={k}
              className={clsx(
                'relative box-border h-12 w-12 cursor-pointer select-none rounded-xl transition-none active:bg-slate-600/20',
                selected === k ? 'border-2 border-emerald-400 bg-white' : 'hover:bg-slate-600/10',
              )}
            >
              {k === '0' ? (
                <DeviceIcon className="absolute left-1/2 top-1/2 w-8 max-w-none -translate-x-1/2 -translate-y-1/2" />
              ) : (
                <Emoji
                  className="absolute left-1/2 top-1/2 w-8 max-w-none -translate-x-1/2 -translate-y-1/2"
                  name={k}
                />
              )}
            </div>
          ))}
        </div>
        <Button
          disabled={selected === undefined}
          shape={ButtonShape.round}
          size={ButtonSize.middle}
          className="mt-7 w-full"
          onClick={() => {
            setSelectedEmoji(selected)
            signDataQuery
              .refetch()
              .then((res) => {
                if (res.isSuccess) {
                  setSignData(res.data)
                  goNext?.()
                }
              })
              .catch(console.error)
          }}
          loading={signDataQuery.isInitialLoading}
        >
          Next
        </Button>
      </div>
    </>
  )
}

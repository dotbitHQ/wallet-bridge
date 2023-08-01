import { useContext, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button, ButtonShape, ButtonSize, Header, SwapChildProps, createTips } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { useWalletState } from '../../store'
import { Emoji } from '../ChooseEmoji'
import { collapseString } from '../../utils'
import { WalletSDKContext } from '../ConnectWallet'
import { setPendingTx, useWebAuthnState } from '../../store/webAuthnState'
import { TxsWithMMJsonSignedOrUnSigned } from '../../../types'

function setNameAndEmojiToLocalStorage(address: string, name?: string, emoji?: string) {
  const memos = JSON.parse(globalThis.localStorage.getItem('.bit-memos') ?? '{}')
  memos[address] = { name, emoji }
  globalThis.localStorage.setItem('.bit-memos', JSON.stringify(memos))
}

export function FinalConfirm({ transitionRef, transitionStyle }: SwapChildProps) {
  const { goNext, goBack, onClose } = useSimpleRouter()!
  const { walletSnap } = useWalletState()
  const webAuthnState = useWebAuthnState()
  const [checked, setChecked] = useState(false)
  const walletSDK = useContext(WalletSDKContext)

  const sendTransactionMutation = useMutation({
    retry: false,
    mutationFn: async (signData: TxsWithMMJsonSignedOrUnSigned) => {
      const signList = await walletSDK?.signTxList({
        ...signData,
        // eslint-disable-next-line
        sign_list: signData.sign_list.map(({ sign_type, sign_msg }) => ({
          sign_type,
          sign_msg: sign_msg.replace('0x', ''),
        })),
      })
      const res = await fetch('https://test-webauthn-api.did.id/v1/transaction/send', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sign_key: signData.sign_key,
          sign_list: signList?.sign_list,
          sign_address: walletSnap.deviceData?.ckbAddr,
        }),
      }).then(async (res) => await res.json())
      if (res.err_no !== 0) throw new Error(res.err_msg)
      return res.data
    },
  })

  const onClickNext = async () => {
    const signData = webAuthnState.signData
    sendTransactionMutation.mutate(signData)
  }

  useEffect(() => {
    if (sendTransactionMutation.data?.hash) {
      setPendingTx(sendTransactionMutation.data.hash)
      setNameAndEmojiToLocalStorage(
        webAuthnState.backupDeviceData!.ckbAddr,
        webAuthnState.backupDeviceData?.name,
        webAuthnState.selectedEmoji,
      )
      goNext?.()
    }
    // eslint-disable-next-line
  }, [sendTransactionMutation.data?.hash])

  useEffect(() => {
    if (sendTransactionMutation.isError) {
      createTips({
        title: 'Error',
        content: (
          <div className="mt-2 w-full break-words text-[14px] font-normal leading-normal text-red-400">
            {(sendTransactionMutation?.error as any)?.toString()}{' '}
          </div>
        ),
      })
    }
  }, [sendTransactionMutation.error, sendTransactionMutation.isError])
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
        className="relative flex w-full flex-col items-center justify-start px-6 pb-6 pt-[76px]"
        ref={transitionRef}
        style={transitionStyle}
      >
        <div className="w-full text-center text-[16px] leading-normal text-neutral-700">
          You are associating the following devices with {collapseString(walletSnap.address, 6, 3)}
        </div>
        <div className="mt-6 flex w-full items-stretch justify-between gap-4 rounded-2xl border border-slate-300/40 bg-gray-50 p-6">
          <div className="h-[44px] flex-none text-center text-[44px] leading-[44px] text-neutral-700">
            <Emoji name={webAuthnState.selectedEmoji!} className="w-8" />
          </div>
          <div className="flex flex-auto flex-col items-start justify-between gap-2">
            <div className="h-[19px] text-[16px] font-semibold leading-[19px] text-neutral-700">
              {webAuthnState.backupDeviceData?.name}
            </div>
            <div className="h-[18px] rounded-md bg-amber-500/10 px-1 py-0.5 text-[12px] leading-[18px] text-yellow-600">
              New device
            </div>
          </div>
        </div>
        <div className="mt-16 inline-flex w-full items-center justify-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 cursor-pointer rounded-md border-2 border-slate-300/40 text-emerald-400 focus:ring-transparent"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked)
            }}
          />
          <div className="text-[14px] text-neutral-700">I Trust This Device.</div>
        </div>
        <Button
          disabled={!checked}
          className="m-6 w-full px-5"
          size={ButtonSize.middle}
          shape={ButtonShape.round}
          loading={sendTransactionMutation.isLoading}
          onClick={onClickNext}
        >
          Next
        </Button>
      </div>
    </>
  )
}

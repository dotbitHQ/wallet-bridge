import { useContext, useEffect, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button, ButtonShape, ButtonSize, Header, SwapChildProps, createTips } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { useWalletState } from '../../store'
import { Emoji } from '../ChooseEmoji'
import { WalletSDKContext } from '../ConnectWallet'
import { setPendingTx, useWebAuthnState } from '../../store/webAuthnState'
import { SignTxListParams } from '../../types'
import handleError from '../../utils/handleError'
import { useWebAuthnService } from '../../services'
import { t } from '@lingui/macro'

// function setNameAndEmojiToLocalStorage(address: string, name?: string, emoji?: string) {
//   const memos = JSON.parse(globalThis.localStorage.getItem('.bit-memos') ?? '{}')
//   memos[address] = { name, emoji }
//   globalThis.localStorage.setItem('.bit-memos', JSON.stringify(memos))
// }

export function FinalConfirm({ transitionRef, transitionStyle }: SwapChildProps) {
  const { goNext, goBack, onClose } = useSimpleRouter()!
  const { walletSnap } = useWalletState()
  const webAuthnState = useWebAuthnState()
  const [checked, setChecked] = useState(false)
  const walletSDK = useContext(WalletSDKContext)
  const webAuthnService = useWebAuthnService(walletSnap.isTestNet)

  const sendTransactionMutation = useMutation({
    retry: false,
    mutationFn: async (signData: SignTxListParams) => {
      if (walletSDK) {
        const signList = await walletSDK.signTxList({
          ...signData,
          // eslint-disable-next-line
          sign_list: signData.sign_list?.map(({ sign_type, sign_msg }) => ({
            sign_type,
            sign_msg: sign_msg.replace('0x', ''),
          })),
        })
        const res = await webAuthnService.sendTransaction(signList)
        if (res.err_no !== 0) throw new Error(res.err_msg)
        return res.data
      }
    },
  })

  const onClickNext = async () => {
    const signData = webAuthnState.signData
    sendTransactionMutation.mutate(signData)
  }

  const deviceEmoji = useMemo(() => {
    return webAuthnState.backupDeviceData?.device || webAuthnState.backupDeviceData?.name.split('-')[0] || ''
  }, [webAuthnState.backupDeviceData])

  useEffect(() => {
    if (sendTransactionMutation.data?.hash) {
      setPendingTx(sendTransactionMutation.data.hash)
      // setNameAndEmojiToLocalStorage(
      //   webAuthnState.backupDeviceData!.ckbAddr,
      //   webAuthnState.backupDeviceData?.name,
      //   webAuthnState.selectedEmoji,
      // )
      goNext?.()
    }
    // eslint-disable-next-line
  }, [sendTransactionMutation.data?.hash])

  useEffect(() => {
    if (sendTransactionMutation.isError) {
      const error: any = sendTransactionMutation.error
      const handleErrorRes = handleError(error)
      if (handleErrorRes.isHandle) {
        if (handleErrorRes.title && handleErrorRes.message) {
          createTips({
            title: handleErrorRes.title,
            content: handleErrorRes.message,
          })
        }
      } else {
        createTips({
          title: t`Tips`,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          content: error.code ? `${error.code}: ${error.message}` : error.message ? error.message : error.toString(),
        })
      }
    }
  }, [sendTransactionMutation.error, sendTransactionMutation.isError])
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
        className="relative flex w-full flex-col items-center justify-start px-6 pb-6 pt-[76px]"
        ref={transitionRef}
        style={transitionStyle}
      >
        <div className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-slate-300/40 bg-gray-50 p-6">
          <div className="flex-none text-center text-neutral-700">
            <Emoji name={deviceEmoji} className="w-8" />
          </div>
          <div className="h-[19px] text-[16px] font-semibold leading-[19px] text-neutral-700">
            {webAuthnState.backupDeviceData?.name}
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
          <div className="text-[14px] text-neutral-700">{t`I Trust This Device.`}</div>
        </div>
        <Button
          disabled={!checked}
          className="mt-6 w-full"
          size={ButtonSize.middle}
          shape={ButtonShape.round}
          loading={sendTransactionMutation.isLoading}
          onClick={onClickNext}
        >
          {t`Next`}
        </Button>
      </div>
    </>
  )
}

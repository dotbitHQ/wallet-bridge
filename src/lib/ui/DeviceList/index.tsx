import {
  DeviceIcon,
  Header,
  MoreIcon,
  NervosIcon,
  PlusIcon,
  RevokeIcon,
  SafeIcon,
  SwapChildProps,
} from '../../components'
import { Menu, Transition } from '@headlessui/react'
import { emojis } from '../ChooseEmoji/png'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { setWalletState, useWalletState } from '../../store'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LetterAvatar } from '../../components/LetterAvatar'
import { collapseString } from '../../utils'
import { TxsWithMMJsonSignedOrUnSigned } from '../../types'
import { WalletSDKContext } from '../ConnectWallet'

interface MoreProps {
  address: string
  onRevoke: () => Promise<void>
}

function More({ address, onRevoke }: MoreProps) {
  return (
    <Menu as="div" className="relative inline-block flex-none">
      <Menu.Button>
        <MoreIcon className="h-[16px] w-[16px] flex-none cursor-pointer text-zinc-300 active:opacity-60" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute -right-4 z-10 mt-2 h-[60px] w-[150px] origin-top-right rounded-xl border border-slate-300/40 bg-white p-3 shadow">
          <Menu.Item>
            <div
              className="relative h-full w-full cursor-pointer rounded-lg px-3 py-2 text-center text-gray-700 hover:bg-red-100 hover:text-red-500 active:text-red-500"
              onClick={onRevoke}
            >
              <RevokeIcon className="absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[14px] font-medium leading-tight">
                Revoke
              </div>
            </div>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

interface DeviceProps {
  address: string
  managingAddress: string
}

function ThisDevice({ address, managingAddress }: DeviceProps) {
  const { walletSnap } = useWalletState()
  return (
    <li
      key={address}
      className="flex h-[60px] w-full flex-row items-center justify-between gap-4 rounded-2xl border border-stone-300/20 bg-white p-4"
    >
      <DeviceIcon className="h-7 w-7" />
      <div className="flex-1 text-[14px] font-semibold text-neutral-700">
        <div className="font-mono">{walletSnap.deviceData?.name}</div>
        <span className="flex-none rounded bg-green-100 px-1 py-0.5 text-[12px] text-emerald-600">This device</span>
      </div>
    </li>
  )
}

function Device({ address, managingAddress }: DeviceProps) {
  const { walletSnap } = useWalletState()
  const walletSDK = useContext(WalletSDKContext)
  const signDataQuery = useQuery({
    queryKey: ['FetchSignDataDelete', { master: walletSnap.address, slave: address }],
    retry: false,
    queryFn: async () => {
      if (walletSnap.address === undefined) throw new Error('unreachable')
      const res = await fetch('https://test-webauthn-api.did.id/v1/webauthn/authorize', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          master_ckb_address: walletSnap.address,
          slave_ckb_address: address,
          operation: 'delete',
        }),
      }).then(async (res) => await res.json())
      if (res.err_no !== 0) throw new Error(res.err_msg)
      return res.data
    },
  })

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

  const [statusConverged, setStatusConverged] = useState(false)

  const transactionStatusQuery = useQuery({
    enabled: sendTransactionMutation.isSuccess && !statusConverged,
    networkMode: 'always',
    queryKey: ['RevokingTransactionStatus', sendTransactionMutation.data?.hash],
    cacheTime: 0,
    refetchInterval: 10000,
    queryFn: async () => {
      const res = await fetch(`https://test-webauthn-api.did.id/v1/transaction/status`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          tx_hash: sendTransactionMutation.data?.hash,
        }),
      }).then(async (res) => await res.json())
      if (res.err_no !== 0) throw new Error(res.err_msg)
      return res.data
    },
  })

  const onRevoke = async () => {
    const signData = signDataQuery.data
    sendTransactionMutation.mutate(signData)
  }

  const revoking =
    signDataQuery.isInitialLoading ||
    sendTransactionMutation.isLoading ||
    transactionStatusQuery.isInitialLoading ||
    transactionStatusQuery.data?.status === 0
  const [revokeError, setRevokeError] = useState(false)
  const isRevokingError = signDataQuery.isError || sendTransactionMutation.isError || revokeError
  useEffect(() => {
    if (revoking) return
    if (transactionStatusQuery.data?.status === 1) {
      setWalletState({
        deviceList: walletSnap.deviceList?.filter((a) => a !== address),
      })
      removeNameAndEmojiFromLocalStorage(address)
      setStatusConverged(true)
    } else if (transactionStatusQuery.data?.status === -1) {
      setRevokeError(true)
      setStatusConverged(true)
    }
  }, [
    transactionStatusQuery.data?.status,
    revoking,
    setRevokeError,
    address,
    sendTransactionMutation.data?.hash,
    walletSnap.deviceList,
  ])
  if (signDataQuery.isInitialLoading) {
    return (
      <li
        key={address}
        className="flex h-[60px] w-full flex-row items-center justify-start gap-4 rounded-2xl border border-stone-300/20 bg-slate-600/5 p-4"
      >
        <div className="h-7 w-7 rounded-full bg-slate-600/5 opacity-60" />
        <div className="h-4 w-[156px] rounded bg-slate-600/5 opacity-60" />
      </li>
    )
  }
  return (
    <li
      key={address}
      className="flex h-[60px] w-full flex-row items-center justify-between gap-4 rounded-2xl border border-stone-300/20 bg-white p-4"
    >
      <LeadingIcon {...getNameAndEmojiFromLocalStorage(address)} address={address} />
      <div className="flex-1 text-[14px] font-semibold text-neutral-700">
        <div className="font-mono">
          {getNameAndEmojiFromLocalStorage(address)?.name ?? collapseString(address, 8, 14)}
        </div>
        {revoking ? (
          <span className="text-[12px] font-medium text-red-500">Revoking...</span>
        ) : isRevokingError ? (
          <span className="text-[12px] font-medium text-red-500">Revoke Failed</span>
        ) : null}
      </div>
      <More address={address} onRevoke={onRevoke} />
    </li>
  )
}

interface LeadingIconProps {
  name?: string
  emoji?: string
  address: string
}
function LeadingIcon({ name, emoji, address }: LeadingIconProps) {
  const selectedEmoji = (emojis as Record<string, string>)[emoji as any]
  if (selectedEmoji) {
    return <img className="h-[28px] w-[28px] flex-none" src={selectedEmoji} />
  } else if (name) {
    return <LetterAvatar data={name} className="h-[28px] w-[28px] flex-none" />
  } else {
    return <NervosIcon className="h-[28px] w-[28px] flex-none rounded-full border border-stone-300/20" />
  }
}

function getNameAndEmojiFromLocalStorage(address: string) {
  return JSON.parse(globalThis.localStorage.getItem('.bit-memos') ?? '{}')[address]
}

function removeNameAndEmojiFromLocalStorage(address: string) {
  const data = JSON.parse(globalThis.localStorage.getItem('.bit-memos') ?? '{}')
  // eslint-disable-next-line
  delete data[address]
  globalThis.localStorage.setItem('.bit-memos', JSON.stringify(data))
}

export function DeviceList({ transitionStyle, transitionRef }: SwapChildProps) {
  const { goBack, onClose, goTo } = useSimpleRouter()!
  const { walletSnap } = useWalletState()
  return (
    <>
      <Header
        className="z-10 w-full bg-white p-6"
        title="Devices"
        goBack={goBack}
        onClose={onClose}
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div
        className="relative flex w-full select-none flex-col items-center justify-start px-6 pb-6 pt-[76px]"
        style={transitionStyle}
        ref={transitionRef}
      >
        <div className="flex w-full flex-row items-start justify-between gap-1 rounded-xl border border-amber-300/40 bg-amber-300/5 p-3">
          <SafeIcon className="h-[20px] w-[20px] flex-none text-amber-500" />
          <div className="flex-1 text-[14px] font-normal leading-[17px] text-yellow-700">
            You can back up to more devices to enhance security.
          </div>
        </div>
        <div className="mt-6 text-[13px] font-normal text-zinc-500">
          Full control over the address belongs to the device/address.
        </div>
        <ul className="mt-2 flex w-full flex-col items-stretch justify-start gap-2">
          {walletSnap.deviceData?.ckbAddr ? (
            <ThisDevice
              key={walletSnap.deviceData.ckbAddr}
              address={walletSnap.deviceData.ckbAddr}
              managingAddress={walletSnap.deviceData.ckbAddr}
            />
          ) : null}
          {walletSnap.deviceList?.map((address) => (
            <Device key={address} address={address} managingAddress={walletSnap.address!} />
          ))}
        </ul>
        <div
          onClick={() => {
            goTo('EnhanceSecurity')
          }}
          className="mt-2 flex h-[60px] w-full cursor-pointer flex-row items-center justify-between gap-4 rounded-2xl border border-dashed border-stone-300/20 bg-white p-4 hover:bg-slate-600/10 active:bg-slate-600/20"
        >
          <PlusIcon className="h-[24px] w-[24px] flex-none" />
          <div className="flex-1 text-[14px] font-semibold text-neutral-700">Add New Device</div>
        </div>
      </div>
    </>
  )
}

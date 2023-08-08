import { DeviceIcon, MoreIcon, NervosIcon, PlusIcon, RevokeIcon } from '../../components'
import { Menu, Transition } from '@headlessui/react'
import { emojis } from '../ChooseEmoji/png'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { setWalletState, useWalletState } from '../../store'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LetterAvatar } from '../../components/LetterAvatar'
import { collapseString } from '../../utils'
import { TxsWithMMJsonSignedOrUnSigned } from '../../types'
import { WalletSDKContext } from '../ConnectWallet'
import clsx from 'clsx'

interface MoreProps {
  address: string
  onRevoke: () => Promise<void>
}

function More({ address, onRevoke }: MoreProps) {
  return (
    <Menu as="div" className="relative inline-block flex-none">
      <Menu.Button className="flex">
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
        <Menu.Items className="fixed right-6 z-10 mt-2 w-[150px] origin-top-right rounded-xl border border-slate-300/40 bg-white p-3 shadow">
          <Menu.Item>
            <div
              className="relative h-[36px] w-full cursor-pointer rounded-lg px-3 py-2 text-center text-gray-700 hover:bg-red-100 hover:text-red-500 active:text-red-500"
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
  onDisconnect?: () => void
}

function ThisDevice({ address, managingAddress }: DeviceProps) {
  const { walletSnap } = useWalletState()
  return (
    <li key={address} className="flex h-[48px] items-center gap-4 pl-3 pr-4">
      <DeviceIcon className="h-6 w-6" />
      <div className="flex-1 text-[14px] font-semibold text-neutral-700">{walletSnap.deviceData?.name}</div>
    </li>
  )
}

function Device({ address, managingAddress, onDisconnect }: DeviceProps) {
  const { walletSnap } = useWalletState()
  const walletSDK = useContext(WalletSDKContext)
  const signDataQuery = useQuery({
    queryKey: ['FetchSignDataDelete', { master: walletSnap.address, slave: address }],
    retry: false,
    enabled: false,
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
        body: JSON.stringify(signData),
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
    const { signTxList, onFailed } = await walletSDK!.getSignMethod()
    try {
      const { data, isError } = await signDataQuery.refetch()
      if (isError) {
        await onFailed()
      } else {
        const res = await signTxList({
          ...data,
          // eslint-disable-next-line
          sign_list: data.sign_list.map(({ sign_type, sign_msg }: SignInfo) => ({
            sign_type,
            sign_msg: sign_msg.replace('0x', ''),
          })),
        })
        await sendTransactionMutation.mutateAsync(res as TxsWithMMJsonSignedOrUnSigned)
      }
    } catch (err) {
      console.error(err)
      await onFailed()
      createTips({
        title: 'Error',
        content: (
          <div className="mt-2 w-full break-words text-[14px] font-normal leading-normal text-red-400">
            {(err as any).toString()}{' '}
          </div>
        ),
      })
    }
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
      if (address === walletSnap.deviceData?.ckbAddr) {
        onDisconnect?.()
      }
    } else if (transactionStatusQuery.data?.status === -1) {
      setRevokeError(true)
      setStatusConverged(true)
    }
  }, [
    transactionStatusQuery.data?.status,
    revoking,
    setRevokeError,
    address,
    onDisconnect,
    walletSnap.deviceData?.ckbAddr,
    sendTransactionMutation.data?.hash,
    walletSnap.deviceList,
  ])
  if (signDataQuery.isInitialLoading) {
    return (
      <li key={address} className="flex h-[48px] items-center gap-4 bg-slate-600/5 pl-3 pr-4">
        <div className="h-7 w-7 rounded-full bg-slate-600/5 opacity-60" />
        <div className="h-4 w-[156px] rounded bg-slate-600/5 opacity-60" />
      </li>
    )
  }
  return (
    <li key={address} className="flex h-[48px] items-center gap-4 pl-3 pr-4">
      <LeadingIcon {...getNameAndEmojiFromLocalStorage(address)} address={address} />
      <div className="flex-1 text-[14px] font-semibold text-neutral-700">
        <div>{getNameAndEmojiFromLocalStorage(address)?.name ?? collapseString(address, 8, 4)}</div>
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
    return <img className="h-6 w-6" src={selectedEmoji} />
  } else if (name) {
    return <LetterAvatar data={name} className="h-[28px] w-[28px] flex-none" />
  } else {
    return <NervosIcon className="h-6 w-6 flex-none rounded-full border border-stone-300/20" />
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

interface DeviceListProps {
  onShowQRCode: () => void
  onDisconnect: () => void
  className?: string
}

export function DeviceList({ onShowQRCode, className, onDisconnect }: DeviceListProps) {
  const { walletSnap } = useWalletState()

  return (
    <div className={clsx('select-none', className)}>
      <div className="mb-3 text-base font-medium leading-[normal] text-[#5F6570]">Trusted Devices of CKB Address</div>
      <ul className="overflow-hidden rounded-2xl border border-[#B6C4D966]">
        {walletSnap.deviceData?.ckbAddr ? (
          <ThisDevice
            key={walletSnap.deviceData.ckbAddr}
            address={walletSnap.deviceData.ckbAddr}
            managingAddress={walletSnap.deviceData.ckbAddr}
          />
        ) : null}
        <hr className="mx-3 border-[#B6C4D966]" />
        {walletSnap.deviceList?.map((address) => (
          <div key={address}>
            <Device key={address} address={address} managingAddress={walletSnap.address!} onDisconnect={onDisconnect} />
            <hr className="mx-3 border-[#B6C4D966]" />
          </div>
        ))}
        <div
          onClick={onShowQRCode}
          className="flex h-[48px] cursor-pointer items-center gap-4 pl-3 pr-4 hover:bg-secondary-5 active:bg-secondary"
        >
          <PlusIcon className="h-6 w-6" />
          <div className="flex-1 text-[14px] font-semibold text-success">Add New</div>
        </div>
      </ul>
      <div className="mt-3 leading-[normal] text-[#5F6570]">
        Every trusted device can access the assets on the CKB address.
      </div>
    </div>
  )
}

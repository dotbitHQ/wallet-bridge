import { MoreIcon, NervosIcon, PlusIcon, RevokeIcon, createTips } from '../../components'
import { Menu, Transition } from '@headlessui/react'
import { emojis } from '../ChooseEmoji/png'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { setWalletState, useWalletState } from '../../store'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LetterAvatar } from '../../components/LetterAvatar'
import { collapseString } from '../../utils'
import { SignInfo, TxsWithMMJsonSignedOrUnSigned } from '../../types'
import { WalletSDKContext } from '../ConnectWallet'
import clsx from 'clsx'
import handleError from '../../utils/handleError'
import { useWebAuthnService } from '../../services'

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

function Device({ address, managingAddress, onDisconnect }: DeviceProps) {
  const { walletSnap } = useWalletState()
  const walletSDK = useContext(WalletSDKContext)
  const webAuthnService = useWebAuthnService(walletSnap.isTestNet)
  const signDataQuery = useQuery({
    queryKey: ['FetchSignDataDelete', { master: walletSnap.address, slave: address }],
    retry: false,
    enabled: false,
    queryFn: async () => {
      if (walletSnap.address === undefined) throw new Error('unreachable')
      const res = await webAuthnService.buildTransaction({
        master_ckb_address: walletSnap.address,
        slave_ckb_address: address,
        operation: 'delete',
      })
      if (res.err_no !== 0) throw new Error(res.err_msg)
      return res.data
    },
  })

  const sendTransactionMutation = useMutation({
    retry: false,
    mutationFn: async (signData: TxsWithMMJsonSignedOrUnSigned) => {
      const res = await webAuthnService.sendTransaction(signData)
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
      const res = await webAuthnService.getTransactionStatus(sendTransactionMutation.data.hash)
      if (res.err_no !== 0) throw new Error(res.err_msg)
      return res.data
    },
  })

  const isMasterDevice = walletSnap.address === address
  const isCurrentDevice = walletSnap.deviceData?.ckbAddr === address

  const onRevoke = async () => {
    if (isMasterDevice) {
      createTips({
        title: 'Info',
        content: 'For safety concerns, you can not revoke the master device.',
      })
      return
    }

    const { signTxList, onFailed } = await walletSDK!.getSignMethod()
    try {
      const { data, isError } = await signDataQuery.refetch()
      if (isError) {
        onFailed().catch(console.error)
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
    } catch (error: any) {
      onFailed().catch(console.error)
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
          title: `Tips`,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          content: error.code ? `${error.code}: ${error.message}` : error.message ? error.message : error.toString(),
        })
      }
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

  return (
    <li className="flex h-[48px] items-center gap-4 pl-3 pr-4">
      <LeadingIcon {...getNameAndEmojiFromLocalStorage(address)} address={address} />
      <div className="flex-1 text-[14px] font-semibold text-neutral-700">
        <div>
          {isCurrentDevice
            ? walletSnap.deviceData.name
            : getNameAndEmojiFromLocalStorage(address)?.name ?? collapseString(address, 8, 4)}
        </div>
        {revoking ? (
          <span className="text-[12px] font-medium text-red-500">Revoking...</span>
        ) : isRevokingError ? (
          <span className="text-[12px] font-medium text-red-500">Revoke Failed</span>
        ) : isCurrentDevice ? (
          <span className="rounded bg-green-100 px-1 py-0.5 text-xs font-medium text-emerald-600">Current Device</span>
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

  const mergedList = [...walletSnap.deviceList!]
  if (!mergedList.find((addr) => addr === walletSnap.address!)) mergedList.unshift(walletSnap.address!)

  return (
    <div className={clsx('select-none', className)}>
      <div className="mb-3 text-base font-medium leading-[normal] text-[#5F6570]">Trusted Devices of CKB Address</div>
      <ul className="overflow-hidden rounded-2xl border border-[#B6C4D966]">
        {mergedList.map((address) => (
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

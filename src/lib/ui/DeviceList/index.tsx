import { Header, MoreIcon, PlusIcon, RevokeIcon, SafeIcon } from '../../components'
import { Menu, Transition } from '@headlessui/react'
import { emojis } from '../ChooseEmoji/png'
import { Fragment } from 'react'
import { useSimpleRouter } from '../../components/SimpleRouter'

function More() {
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
        <Menu.Items className="absolute -right-4 z-10 mt-2 h-[60px] w-[150px] origin-top-right rounded-xl border border-slate-300 border-opacity-40 bg-white p-3 shadow">
          <Menu.Item>
            <div className="relative h-full w-full cursor-pointer rounded-lg px-3 py-2 text-center text-gray-700 hover:bg-red-100 hover:text-red-500 active:text-red-500">
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

export function DeviceList() {
  const { goBack, onClose, goTo } = useSimpleRouter()!
  return (
    <>
      <Header className="p-6" title="Devices" goBack={goBack} onClose={onClose} />
      <div className="relative flex w-full select-none flex-col items-center justify-start p-6">
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
          <li className="flex h-[60px] w-full flex-row items-center justify-between gap-4 rounded-2xl border border-stone-300/20 bg-white p-4">
            <img className="h-[28px] w-[28px] flex-none" src={emojis['laptop']} />
            <div className="flex-1 text-[14px] font-semibold text-neutral-700">
              <div>Chrome-dotbit-1217</div>
              <span className="flex-none rounded bg-green-100 px-1 py-0.5 text-[12px] text-emerald-600">
                This device
              </span>
            </div>
          </li>
          <li className="flex h-[60px] w-full flex-row items-center justify-between gap-4 rounded-2xl border border-stone-300/20 bg-white p-4">
            <img className="h-[28px] w-[28px] flex-none" src={emojis['fire']} />
            <div className="flex-1 text-[14px] font-semibold text-neutral-700">
              <div>Chrome-dotbit-1217</div>
            </div>
            <More />
          </li>
        </ul>
        <div
          onClick={() => goTo('EnhanceSecurity')}
          className="mt-2 flex h-[60px] w-full cursor-pointer flex-row items-center justify-between gap-4 rounded-2xl border border-dashed border-stone-300/20 bg-white p-4 hover:bg-slate-600/10 active:bg-slate-600/20"
        >
          <PlusIcon className="h-[24px] w-[24px] flex-none" />
          <div className="flex-1 text-[14px] font-semibold text-neutral-700">Add New Device</div>
        </div>
      </div>
    </>
  )
}

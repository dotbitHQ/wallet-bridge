import { ReactNode, useState } from 'react'
import WalletSDK from '../wallets'
import { Modal } from '../components/Modal'
import clsx from 'clsx'
import { ChainList } from './Login/ChainList'
import { WalletList } from './Login/WalletList'
import { Sheet } from '../components/Sheet'
import { LoggedIn } from './LoggedIn/LoggedIn'
import { AddressList } from './LoggedIn/AddressList'

interface ConnectWalletProps {
  visible: boolean
  walletSDK: WalletSDK
  initComponent?: string
}

type IComponents = Record<string, ReactNode>

export const ConnectWallet = ({ visible, walletSDK, initComponent = 'ChainList' }: ConnectWalletProps) => {
  const [isOpen, setIsOpen] = useState(visible)
  const [showComponent, setShowComponent] = useState(initComponent)

  const onClose = () => {
    setIsOpen(false)
  }

  const components: IComponents = {
    ChainList: (
      <ChainList
        walletSDK={walletSDK}
        showWalletList={() => {
          setShowComponent('WalletList')
        }}
        onClose={onClose}
      ></ChainList>
    ),
    WalletList: (
      <WalletList
        walletSDK={walletSDK}
        goBack={() => {
          setShowComponent('ChainList')
        }}
        onClose={onClose}
      ></WalletList>
    ),
    LoggedIn: (
      <LoggedIn
        walletSDK={walletSDK}
        onDisconnect={() => {
          setShowComponent('ChainList')
        }}
        onSwitchAddress={() => {
          setShowComponent('AddressList')
        }}
        onDevices={() => {
          setShowComponent('Devices')
        }}
        onEnhanceSecurity={() => {
          setShowComponent('EnhanceSecurity')
        }}
        onClose={onClose}
      ></LoggedIn>
    ),
    AddressList: (
      <AddressList
        walletSDK={walletSDK}
        goBack={() => {
          setShowComponent('LoggedIn')
        }}
        onClose={onClose}
      ></AddressList>
    ),
  }

  return (
    <>
      <Sheet isOpen={isOpen} customRootId="ConnectWalletSheet" className="md:hidden">
        <div
          className={clsx(
            'box-border w-full overflow-x-hidden rounded-t-[32px] border-2 border-solid border-[#5262791A] bg-white',
            isOpen ? 'animation-fade-in-up' : 'animation-fade-out-down',
          )}
        >
          {components[showComponent]}
        </div>
      </Sheet>
      <Modal isOpen={isOpen} customRootId="ConnectWalletModal" className="max-md:hidden">
        <div
          className={clsx(
            'box-border w-[92%] max-w-[400px] overflow-x-hidden rounded-[32px] border-2 border-solid border-[#5262791A] bg-white',
            isOpen ? 'animation-fade-in-up' : 'animation-fade-out-down',
          )}
        >
          {components[showComponent]}
        </div>
      </Modal>
    </>
  )
}

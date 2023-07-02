import { ReactNode, createContext, useState } from 'react'
import WalletSDK from '../wallets'
import { Modal } from '../components/Modal'
import clsx from 'clsx'
import { ChainList } from './Login/ChainList'
import { WalletList } from './Login/WalletList'
import { Sheet } from '../components/Sheet'
import { LoggedIn } from './LoggedIn/LoggedIn'
import { AddressList } from './LoggedIn/AddressList'
import { SimpleRouter } from '../components/SimpleRouter'
import { EnhanceSecurity } from './EnhanceSecurity'
import { ShowQRCode } from './ShowQRCode'
import { InputSignature } from './InputSignature'
import { ChooseEmoji } from './ChooseEmoji'
import { FinalConfirm } from './FinalConfirm'
import { TransactionStatus } from './TransactionStatus'
import { TransactionSucceeded } from './TransactionSucceeded'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DeviceList } from './DeviceList'
import { ShowScanner } from './ShowScanner'

interface ConnectWalletProps {
  visible: boolean
  walletSDK: WalletSDK
  initComponent?: string
}

type IComponents = Record<string, ReactNode>

export const WalletSDKContext = createContext<WalletSDK | null>(null)
const queryClient = new QueryClient()

export const ConnectWallet = ({ visible, walletSDK, initComponent = 'ChainList' }: ConnectWalletProps) => {
  const [isOpen, setIsOpen] = useState(visible)

  const onClose = () => {
    setIsOpen(false)
  }

  const routes = {
    ChainList: {
      el: <ChainList />,
    },
    WalletList: {
      el: <WalletList />,
      prev: 'ChainList',
    },
    AddressList: {
      el: <AddressList />,
      prev: 'ChainList',
    },
    LoggedIn: {
      el: <LoggedIn />,
    },
    EnhanceSecurity: {
      el: <EnhanceSecurity />,
      prev: 'LoggedIn',
      next: 'ShowQRCode',
    },
    ShowQRCode: {
      el: <ShowQRCode />,
      prev: 'EnhanceSecurity',
      next: 'InputSignature',
    },
    InputSignature: {
      el: <InputSignature />,
      prev: 'ShowQRCode',
      next: 'ChooseEmoji',
    },
    ChooseEmoji: {
      el: <ChooseEmoji />,
      prev: 'InputSignature',
      next: 'FinalConfirm',
    },
    FinalConfirm: {
      el: <FinalConfirm />,
      prev: 'ChooseEmoji',
      next: 'TransactionStatus',
    },
    TransactionStatus: {
      el: <TransactionStatus />,
      next: 'TransactionSucceeded',
    },
    TransactionSucceeded: {
      el: <TransactionSucceeded />,
      next: 'LoggedIn',
    },
    DeviceList: {
      el: <DeviceList />,
    },
    ShowScanner: {
      el: <ShowScanner />,
    },
  }

  const el = <SimpleRouter routes={routes} initialRouteName={initComponent} onClose={onClose} />

  return (
    <WalletSDKContext.Provider value={walletSDK}>
      <QueryClientProvider client={queryClient}>
        <>
          <Sheet isOpen={isOpen} customRootId="ConnectWalletSheet" className="md:hidden">
            <div
              className={clsx(
                'box-border w-full overflow-x-hidden rounded-t-[32px] border-2 border-solid border-[#5262791A] bg-white',
                isOpen ? 'animation-fade-in-up' : 'animation-fade-out-down',
              )}
            >
              {el}
            </div>
          </Sheet>
          <Modal isOpen={isOpen} customRootId="ConnectWalletModal" className="max-md:hidden">
            <div
              className={clsx(
                'box-border w-[92%] max-w-[400px] overflow-x-hidden rounded-[32px] border-2 border-solid border-[#5262791A] bg-white',
                isOpen ? 'animation-fade-in-up' : 'animation-fade-out-down',
              )}
            >
              {el}
            </div>
          </Modal>
        </>
      </QueryClientProvider>
    </WalletSDKContext.Provider>
  )
}

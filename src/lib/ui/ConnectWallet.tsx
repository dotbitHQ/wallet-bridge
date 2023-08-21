import { createContext, useState } from 'react'
import WalletSDK from '../wallets'
import { Modal } from '../components/Modal'
import clsx from 'clsx'
import { ChainList } from './Login/ChainList'
import { WalletList } from './Login/WalletList'
import { LoggedIn } from './LoggedIn/LoggedIn'
import { AddressList } from './LoggedIn/AddressList'
import { SimpleRouter } from '../components/SimpleRouter'
import { ShowQRCode } from './ShowQRCode'
import { InputSignature } from './InputSignature'
import { ChooseEmoji } from './ChooseEmoji'
import { FinalConfirm } from './FinalConfirm'
import { TransactionStatus } from './TransactionStatus'
import { TransactionSucceeded } from './TransactionSucceeded'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ShowScanner } from './ShowScanner'
import { TransactionFailed } from './TransactionFailed'
import { Sheet } from '../components/Sheet'

interface ConnectWalletProps {
  visible: boolean
  walletSDK: WalletSDK
  initComponent?: string
}

const routes = {
  ChainList: {
    el: <ChainList key="ChainList" />,
  },
  WalletList: {
    el: <WalletList key="WalletList" />,
    prev: 'ChainList',
  },
  AddressList: {
    el: <AddressList key="AddressList" />,
    prev: 'ChainList',
  },
  LoggedIn: {
    el: <LoggedIn key="LoggedIn" />,
  },
  ShowQRCode: {
    el: <ShowQRCode key="ShowQRCode" />,
    prev: 'LoggedIn',
    next: 'InputSignature',
  },
  InputSignature: {
    el: <InputSignature key="InputSignature" />,
    prev: 'ShowQRCode',
    next: 'ChooseEmoji',
  },
  ChooseEmoji: {
    el: <ChooseEmoji key="ChooseEmoji" />,
    prev: 'InputSignature',
    next: 'FinalConfirm',
  },
  FinalConfirm: {
    el: <FinalConfirm key="FinalConfirm" />,
    prev: 'ChooseEmoji',
    next: 'TransactionStatus',
  },
  TransactionStatus: {
    el: <TransactionStatus key="TransactionStatus" />,
    next: 'TransactionSucceeded',
  },
  TransactionSucceeded: {
    el: <TransactionSucceeded key="TransactionSucceeded" />,
    next: 'LoggedIn',
  },
  TransactionFailed: {
    el: <TransactionFailed key="TransactionFailed" />,
  },
  ShowScanner: {
    el: <ShowScanner key="ShowScanner" />,
  },
}

export const WalletSDKContext = createContext<WalletSDK | null>(null)
const queryClient = new QueryClient()

export const ConnectWallet = ({ visible, walletSDK, initComponent = 'ChainList' }: ConnectWalletProps) => {
  const [isOpen, setIsOpen] = useState(visible)

  const onClose = () => {
    setIsOpen(false)
  }

  const el = <SimpleRouter routes={routes} initialRouteName={initComponent} onClose={onClose} />

  return (
    <WalletSDKContext.Provider value={walletSDK}>
      <QueryClientProvider client={queryClient}>
        <Sheet isOpen={isOpen}>
          <div
            className={clsx(
              'box-border w-full overflow-hidden rounded-t-[32px] border-2 border-solid border-[#5262791A] bg-white',
              isOpen ? 'animation-fade-in-up' : 'animation-fade-out-down',
            )}
          >
            {el}
          </div>
        </Sheet>
        <Modal isOpen={isOpen}>
          <div
            className={clsx(
              'box-border w-[92%] max-w-[400px] overflow-hidden rounded-[32px] border-2 border-solid border-[#5262791A] bg-white',
              isOpen ? 'animation-fade-in-up' : 'animation-fade-out-down',
            )}
          >
            {el}
          </div>
        </Modal>
      </QueryClientProvider>
    </WalletSDKContext.Provider>
  )
}

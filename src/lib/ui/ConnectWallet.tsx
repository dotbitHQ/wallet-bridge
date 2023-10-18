import { createContext, useCallback, useEffect, useState } from 'react'
import WalletSDK from '../wallets'
import { Modal } from '../components/Modal'
import clsx from 'clsx'
import { ChainList } from './Login/ChainList'
import { WalletList } from './Login/WalletList'
import { WalletConnectQrCode } from './Login/WalletConnectQrCode'
import { LoggedIn } from './LoggedIn/LoggedIn'
import { AddressList } from './LoggedIn/AddressList'
import { SimpleRouter } from '../components/SimpleRouter'
import { ShowQRCode } from './ShowQRCode'
import { InputSignature } from './InputSignature'
import { FinalConfirm } from './FinalConfirm'
import { TransactionStatus } from './TransactionStatus'
import { TransactionSucceeded } from './TransactionSucceeded'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ShowScanner } from './ShowScanner'
import { TransactionFailed } from './TransactionFailed'
import { Sheet } from '../components/Sheet'
import { Connect } from './Login/Connect'
import { AddressQRCode } from './LoggedIn/AddressQrCode'

interface ConnectWalletProps {
  visible: boolean
  walletSDK: WalletSDK
  initComponent?: string
}

const routes = {
  Connect: {
    el: <Connect key="Connect" />,
    next: 'ChainList',
  },
  ChainList: {
    el: <ChainList key="ChainList" />,
    prev: 'Connect',
    next: 'WalletList',
  },
  WalletList: {
    el: <WalletList key="WalletList" />,
    prev: 'ChainList',
    next: 'WalletConnectQrCode',
  },
  WalletConnectQrCode: {
    el: <WalletConnectQrCode key="WalletConnectQrCode" />,
    prev: 'WalletList',
  },
  AddressList: {
    el: <AddressList key="AddressList" />,
    prev: 'ChainList',
  },
  LoggedIn: {
    el: <LoggedIn key="LoggedIn" />,
  },
  AddressQRCode: {
    el: <AddressQRCode key="AddressQRCode" />,
    prev: 'LoggedIn',
  },
  ShowQRCode: {
    el: <ShowQRCode key="ShowQRCode" />,
    prev: 'LoggedIn',
    next: 'InputSignature',
  },
  InputSignature: {
    el: <InputSignature key="InputSignature" />,
    prev: 'ShowQRCode',
    next: 'FinalConfirm',
  },
  FinalConfirm: {
    el: <FinalConfirm key="FinalConfirm" />,
    prev: 'InputSignature',
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

export const ConnectWallet = ({ visible, walletSDK, initComponent = 'Connect' }: ConnectWalletProps) => {
  const [isOpen, setIsOpen] = useState(visible)

  const onClose = () => {
    setIsOpen(false)
  }

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768) // 假设768px以下为移动设备
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  const el = <SimpleRouter routes={routes} initialRouteName={initComponent} onClose={onClose} />

  return (
    <WalletSDKContext.Provider value={walletSDK}>
      <QueryClientProvider client={queryClient}>
        {isMobile ? (
          <Sheet isOpen={isOpen} customRootId="ConnectWalletSheet" className="md:hidden">
            <div
              className={clsx(
                'relative box-border w-full overflow-hidden rounded-t-[32px] bg-[unset]',
                isOpen ? 'animation-fade-in-up' : 'animation-fade-out-down',
              )}
            >
              <div className="box-border w-full overflow-hidden rounded-t-[32px] border-2 border-b-0 border-solid border-[#5262791A] bg-white">
                {el}
              </div>
            </div>
          </Sheet>
        ) : (
          <Modal isOpen={isOpen} customRootId="ConnectWalletModal" className="max-md:hidden">
            <div
              className={clsx(
                'relative box-border w-[92%] max-w-[400px] overflow-hidden rounded-[32px] bg-[unset]',
                isOpen ? 'animation-fade-in-up' : 'animation-fade-out-down',
              )}
            >
              <div className="box-border w-full overflow-hidden rounded-[32px] border-2 border-solid border-[#5262791A] bg-white">
                {el}
              </div>
            </div>
          </Modal>
        )}
      </QueryClientProvider>
    </WalletSDKContext.Provider>
  )
}

import { ReactNode, useState } from 'react'
import WalletSDK from '../wallets'
import { Modal } from '../components/Modal'
import clsx from 'clsx'
import { ChainList } from './Login/ChainList'
import { WalletList } from './Login/WalletList'

interface ConnectWalletProps {
  visible: boolean
  walletSDK: WalletSDK
}

type IComponents = Record<string, ReactNode>

export const ConnectWallet = ({ visible, walletSDK }: ConnectWalletProps) => {
  const [isOpen, setIsOpen] = useState(visible)
  const [showComponent, setShowComponent] = useState('ChainList')

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
  }

  return (
    <Modal isOpen={isOpen} customRootId="ConnectWallet">
      <div
        className={clsx(
          'box-border w-[92%] max-w-[400px] overflow-hidden rounded-[32px] border-2 border-solid border-[#5262791A] bg-white',
          isOpen ? 'animation-fade-in-up' : 'animation-fade-out-down',
        )}
      >
        {components[showComponent]}
      </div>
    </Modal>
  )
}

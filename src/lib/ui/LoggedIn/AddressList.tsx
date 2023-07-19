import { Header, SwapChildProps } from '../../components'
import { useWalletState, setWalletState } from '../../store'
import { AddressItem } from '../../components/AddressItem'
import { collapseString } from '../../utils'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { useContext } from 'react'
import { WalletSDKContext } from '../ConnectWallet'
import { EventEnum } from '../../wallets/WalletEventListenerHandler'

export const AddressList = ({ transitionRef, transitionStyle }: SwapChildProps) => {
  const router = useSimpleRouter()!
  const walletSDK = useContext(WalletSDKContext)!
  const { goBack, onClose, prevRouteName: fromOldComponent } = router
  const { walletSnap } = useWalletState()

  const back = () => {
    if (fromOldComponent === 'ChainList') {
      onClose()
    } else {
      goBack?.()
    }
  }

  const onSwitchAddress = (address: string) => {
    if (address.toLowerCase() !== String(walletSnap.address).toLowerCase()) {
      setWalletState({ address })
      walletSDK.context.emitEvent(EventEnum.Change)
    }
    back()
  }

  return (
    <>
      <Header
        title="Switch Address"
        goBack={back}
        onClose={onClose}
        className="z-10 w-full bg-white p-6"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div className="w-full px-6 pb-6 pt-[76px]" ref={transitionRef} style={transitionStyle}>
        <label className="mb-2 block text-[13px] text-[#5F6570]">Generated by this device</label>
        <ul className="mb-3">
          <AddressItem
            address={collapseString(walletSnap.deviceData?.ckbAddr, 8, 4)}
            isCurrent={walletSnap.deviceData?.ckbAddr === walletSnap.address}
            onClick={() => {
              onSwitchAddress(walletSnap.deviceData?.ckbAddr as string)
            }}
          ></AddressItem>
        </ul>
        {walletSnap.ckbAddresses && walletSnap.ckbAddresses?.length > 0 ? (
          <label className="mb-2 block text-[13px] text-[#5F6570]">Associated with this device</label>
        ) : null}
        <ul className="mb-6">
          {walletSnap.ckbAddresses?.map((address) => {
            return (
              <AddressItem
                key={address}
                className="mb-2"
                address={collapseString(address, 8, 4)}
                isCurrent={address === walletSnap.address}
                onClick={() => {
                  onSwitchAddress(address)
                }}
              ></AddressItem>
            )
          })}
        </ul>
      </div>
    </>
  )
}

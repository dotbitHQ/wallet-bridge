import {
  BscIcon,
  DeviceIcon,
  DisconnectIcon,
  DogecoinIcon,
  EthIcon,
  Header,
  PolygonIcon,
  SwitchIcon,
  SwapChildProps,
  TronIcon,
  Button,
  ButtonSize,
  ButtonVariant,
} from '../../components'
import { WalletProtocol, CoinType } from '../../constant'
import { getAuthorizeInfo, getMastersAddress, useWalletState } from '../../store'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { collapseString, copyText } from '../../utils'
import { WalletSDKContext } from '../ConnectWallet'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { createToast } from '../../components/Toast'
import { BackupTips } from './BackupTips'
import { DeviceList } from './DeviceList'

export const LoggedIn = ({ transitionRef, transitionStyle }: SwapChildProps) => {
  const { walletSnap } = useWalletState()
  const [isAddDevice, setIsAddDevice] = useState(false)
  const walletSDK = useContext(WalletSDKContext)!
  const { goTo, onClose } = useSimpleRouter()!
  const onDisconnect = () => {
    goTo('ChainList')
  }
  const onSwitchAddress = () => {
    goTo('AddressList')
  }
  const onShowQRCode = () => {
    goTo('ShowQRCode')
  }

  const icons: Record<CoinType, ReactNode> = {
    [CoinType.btc]: <DeviceIcon className="h-[68px] w-[68px]"></DeviceIcon>,
    [CoinType.ckb]: <DeviceIcon className="h-[68px] w-[68px]"></DeviceIcon>,
    [CoinType.eth]: <EthIcon className="h-[68px] w-[68px]"></EthIcon>,
    [CoinType.bsc]: <BscIcon className="h-[68px] w-[68px]"></BscIcon>,
    [CoinType.matic]: <PolygonIcon className="h-[68px] w-[68px]"></PolygonIcon>,
    [CoinType.trx]: <TronIcon className="h-[68px] w-[68px]"></TronIcon>,
    [CoinType.doge]: <DogecoinIcon className="h-[68px] w-[68px]"></DogecoinIcon>,
  }

  const close = () => {
    onClose()
  }

  const disconnect = () => {
    onDisconnect()
    void walletSDK.disconnect()
  }

  const onSwitch = () => {
    onSwitchAddress()
  }

  const onCopy = (text: string) => {
    void copyText(text).then(() => {
      createToast({
        message: '👌 Copied',
      })
    })
  }

  const addDevice = () => {
    setIsAddDevice(true)
  }

  useEffect(() => {
    void getAuthorizeInfo()
    void getMastersAddress()
  }, [])

  return (
    <>
      <Header
        onClose={close}
        className="z-10 w-full bg-white p-6"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div className="w-full px-6 pb-6 pt-[76px]" ref={transitionRef} style={transitionStyle}>
        <div className="mb-10 text-center">
          {walletSnap.coinType && icons[walletSnap.coinType]}
          <h2 className="my-2 text-2xl font-extrabold leading-7">
            {walletSnap.protocol === WalletProtocol.webAuthn
              ? walletSnap.deviceData?.name
              : collapseString(walletSnap.address)}
          </h2>
          {walletSnap.protocol === WalletProtocol.webAuthn ? (
            <div className="flex items-center justify-center">
              <span
                className="cursor-pointer text-base font-medium text-[#B0B8BF]"
                onClick={() => {
                  walletSnap.address && onCopy(walletSnap.address)
                }}
              >
                {collapseString(walletSnap.address, 8, 4)}
              </span>
              <SwitchIcon
                onClick={onSwitch}
                className="ml-3 h-4 w-4 cursor-pointer text-[#5F6570] hover:text-font-tips active:text-font-primary"
              ></SwitchIcon>
            </div>
          ) : null}
        </div>
        {walletSnap.protocol === WalletProtocol.webAuthn ? (
          isAddDevice || (walletSnap.deviceList && walletSnap.deviceList.length > 0) ? (
            <DeviceList onShowQRCode={onShowQRCode}></DeviceList>
          ) : (
            <BackupTips addDevice={addDevice}></BackupTips>
          )
        ) : null}
        <Button className="mt-6 w-full" size={ButtonSize.large} variant={ButtonVariant.secondary} onClick={disconnect}>
          <DisconnectIcon className="mr-2 h-4 w-4 text-font-disconnect"></DisconnectIcon>Disconnect
        </Button>
      </div>
    </>
  )
}

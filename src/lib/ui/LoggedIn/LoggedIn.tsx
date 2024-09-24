import {
  CopyIcon,
  DeviceIcon,
  DisconnectIcon,
  Header,
  QRCodeIcon,
  SwapChildProps,
  SwitchIcon,
  TorusIcon,
} from '../../components'
import { CoinType, WalletProtocol } from '../../constant'
import { backupDeviceData, getAuthorizeInfo, getDotbitAlias, getMastersAddress, useWalletState } from '../../store'
import { ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { collapseString, copyText } from '../../utils'
import { WalletSDKContext } from '../ConnectWallet'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { createToast } from '../../components/Toast'
import { BackupTips } from './BackupTips'
import { DeviceList } from './DeviceList'
import EthIcon from '../Login/icon/eth-icon.svg'
import BscIcon from '../Login/icon/bsc-icon.svg'
import PolygonIcon from '../Login/icon/polygon-icon.svg'
import TronIcon from '../Login/icon/tron-icon.svg'
import DogecoinIcon from '../Login/icon/dogecoin-icon.svg'
import BtcIcon from '../Login/icon/btc-icon.svg'
import BscBg from './bg/bsc.svg'
import DeviceBg from './bg/device.svg'
import DogeBg from './bg/doge.svg'
import BtcBg from './bg/btc.svg'
import EthBg from './bg/eth.svg'
import PolygonBg from './bg/polygon.svg'
import TronBg from './bg/tron.svg'
import { LoggedInButton } from '../../components/LoggedInButton'
import clsx from 'clsx'
import { t } from '@lingui/macro'

export const LoggedIn = ({ transitionRef, transitionStyle }: SwapChildProps) => {
  const { walletSnap } = useWalletState()
  const walletSDK = useContext(WalletSDKContext)!
  const { goTo, onClose } = useSimpleRouter()!
  const [disconnectLoading, setDisconnectLoading] = useState(false)

  const onSwitchAddress = () => {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    goTo('AddressList')
  }

  const onShowAddressQRCode = () => {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    goTo('AddressQRCode')
  }

  const onShowQRCode = () => {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    goTo('ShowQRCode')
  }

  const icons: Record<CoinType, ReactNode> = {
    [CoinType.ckb]: <DeviceIcon className="inline-flex size-[68px]"></DeviceIcon>,
    [CoinType.eth]: <img className="inline-flex size-[68px]" src={EthIcon} alt="ETH" />,
    [CoinType.bsc]: <img className="inline-flex size-[68px]" src={BscIcon} alt="BSC" />,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    [CoinType.pol]: <img className="inline-flex size-[68px]" src={PolygonIcon} alt="Polygon" />,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    [CoinType.trx]: <img className="inline-flex size-[68px]" src={TronIcon} alt="Tron" />,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    [CoinType.doge]: <img className="inline-flex size-[68px]" src={DogecoinIcon} alt="Dogecoin" />,
    [CoinType.btc]: <img className="inline-flex size-[68px]" src={BtcIcon} alt="BTC" />,
  }

  const bgImage: Record<CoinType, ReactNode> = {
    [CoinType.ckb]: <img className="absolute top-0 w-full-4px rounded-t-[32px]" src={DeviceBg} alt="" />,
    [CoinType.eth]: <img className="absolute top-0 w-full-4px rounded-t-[32px]" src={EthBg} alt="" />,
    [CoinType.bsc]: <img className="absolute top-0 w-full-4px rounded-t-[32px]" src={BscBg} alt="" />,
    [CoinType.pol]: <img className="absolute top-0 w-full-4px rounded-t-[32px]" src={PolygonBg} alt="" />,
    [CoinType.trx]: <img className="absolute top-0 w-full-4px rounded-t-[32px]" src={TronBg} alt="" />,
    [CoinType.doge]: <img className="absolute top-0 w-full-4px rounded-t-[32px]" src={DogeBg} alt="" />,
    [CoinType.btc]: <img className="absolute top-0 w-full-4px rounded-t-[32px]" src={BtcBg} alt="" />,
  }

  const close = () => {
    onClose()
  }

  const disconnect = async () => {
    setDisconnectLoading(true)
    await walletSDK.disconnect()
    // eslint-disable-next-line lingui/no-unlocalized-strings
    goTo('Connect')
    setDisconnectLoading(false)
  }

  const onCopy = (text: string) => {
    void copyText(text).then(() => {
      createToast({
        message: t`👌 Copied`,
      })
    })
  }

  const openTorus = () => {
    walletSDK?.context?.torusWallet?.showWallet?.('home')
  }

  const showOpenTorusButton = useMemo(() => {
    return !!walletSDK?.context?.torusWallet?.isLoggedIn
  }, [walletSDK?.context?.torusWallet?.isLoggedIn])

  useEffect(() => {
    void getMastersAddress()
    void getAuthorizeInfo().then(() => {
      void backupDeviceData()
    })
    void getDotbitAlias()
  }, [])

  return (
    <div className={clsx('bg-[#F6F7F9]')}>
      {walletSnap.coinType && bgImage[walletSnap.coinType]}
      <Header
        onClose={close}
        className="z-10 mt-0.5 w-full-4px p-6 pb-0"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div className="relative w-full px-6 pb-6 pt-[52px]" ref={transitionRef} style={transitionStyle}>
        <div className="text-center">
          {walletSnap.protocol === WalletProtocol.webAuthn ? (
            <>
              {walletSnap.alias ? (
                <div>
                  <div className="break-all text-2xl font-extrabold leading-[normal] text-font-tips">
                    {walletSnap.alias}
                  </div>
                  <div className="mb-6 mt-2 text-base font-extrabold leading-[normal] text-[#31465C]">
                    {collapseString(walletSnap.address)}
                  </div>
                </div>
              ) : (
                <div className="mx-auto mb-6 w-[180px] break-all text-2xl font-extrabold leading-[normal] text-font-tips">
                  {collapseString(walletSnap.address, 26, 4)}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <LoggedInButton
                  className="flex-loggedin-button"
                  icon={<CopyIcon className="size-5 text-[#5F6570]"></CopyIcon>}
                  onClick={() => {
                    walletSnap.address && onCopy(walletSnap.address)
                  }}
                >
                  {t`Copy Address`}
                </LoggedInButton>
                <LoggedInButton
                  className="flex-loggedin-button"
                  icon={<QRCodeIcon className="size-5 text-[#5F6570]"></QRCodeIcon>}
                  onClick={onShowAddressQRCode}
                >
                  {t`QR Code`}
                </LoggedInButton>
                {walletSnap.ckbAddresses && walletSnap.ckbAddresses?.length > 0 ? (
                  <LoggedInButton
                    className="flex-loggedin-button"
                    icon={<SwitchIcon className="size-5 text-[#5F6570]"></SwitchIcon>}
                    onClick={onSwitchAddress}
                  >
                    {t`Switch`}
                  </LoggedInButton>
                ) : null}
                <LoggedInButton
                  className="flex-loggedin-button"
                  icon={<DisconnectIcon className="size-5 text-[#5F6570]"></DisconnectIcon>}
                  loading={disconnectLoading}
                  onClick={disconnect}
                >
                  {t`Disconnect`}
                </LoggedInButton>
              </div>
            </>
          ) : (
            <>
              {walletSnap.coinType && icons[walletSnap.coinType]}
              {walletSnap.alias ? (
                <div>
                  <div className="mt-4 break-all text-[32px] font-extrabold leading-[normal] text-font-tips">
                    {walletSnap.alias}
                  </div>
                  <div className="mb-8 mt-2 text-base font-bold leading-[normal] text-[#31465C]">
                    {collapseString(walletSnap.address)}
                  </div>
                </div>
              ) : (
                <div className="mb-8 mt-4 text-[32px] font-extrabold leading-[normal] text-font-tips">
                  {collapseString(walletSnap.address)}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <LoggedInButton
                  className="flex-loggedin-button"
                  icon={<CopyIcon className="size-5 text-[#5F6570]"></CopyIcon>}
                  onClick={() => {
                    walletSnap.address && onCopy(walletSnap.address)
                  }}
                >
                  {t`Copy Address`}
                </LoggedInButton>
                <LoggedInButton
                  className="flex-loggedin-button"
                  icon={<QRCodeIcon className="size-5 text-[#5F6570]"></QRCodeIcon>}
                  onClick={onShowAddressQRCode}
                >
                  {t`QR Code`}
                </LoggedInButton>
                {showOpenTorusButton && (
                  <LoggedInButton
                    className="flex-loggedin-button"
                    icon={<TorusIcon className="size-4 text-[#5F6570]"></TorusIcon>}
                    onClick={openTorus}
                  >
                    {t`Open Torus`}
                  </LoggedInButton>
                )}
                <LoggedInButton
                  className="flex-loggedin-button"
                  icon={<DisconnectIcon className="size-5 text-[#5F6570]"></DisconnectIcon>}
                  loading={disconnectLoading}
                  onClick={disconnect}
                >
                  {t`Disconnect`}
                </LoggedInButton>
              </div>
            </>
          )}
        </div>
        {walletSnap.protocol === WalletProtocol.webAuthn && walletSnap.canAddDevice ? (
          walletSnap.deviceList && walletSnap.deviceList.length > 0 ? (
            <DeviceList className="mt-8" onShowQRCode={onShowQRCode} onDisconnect={disconnect}></DeviceList>
          ) : (
            <BackupTips className="mt-8" onShowQRCode={onShowQRCode}></BackupTips>
          )
        ) : null}
      </div>
    </div>
  )
}

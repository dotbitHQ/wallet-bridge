import {
  ArrowLeftIcon,
  ArrowRightTopIcon,
  BscIcon,
  DeviceIcon,
  DevicesIcon,
  DisconnectIcon,
  DogecoinIcon,
  DotbitBalanceIcon,
  EthIcon,
  Header,
  InfoIcon,
  PolygonIcon,
  SwitchIcon,
  TronIcon,
  WarningIcon,
} from '../../components'
import { WalletProtocol, CoinType, DotbitBalanceUrl, DotbitBalanceTestUrl } from '../../constant'
import { useWalletState } from '../../store'
import WalletSDK from '../../wallets'
import { ReactNode, useContext } from 'react'
import { collapseString, smartOpen } from '../../utils'
import { WalletSDKContext } from '../ConnectWallet'
import { useSimpleRouter } from '../../components/SimpleRouter'

interface LoggedInProps {
  walletSDK: WalletSDK
  onDisconnect: () => void
  onSwitchAddress: () => void
  onDevices: () => void
  onEnhanceSecurity: () => void
  onClose: () => void
}

export const LoggedIn = () => {
  const { walletSnap } = useWalletState()
  const walletSDK = useContext(WalletSDKContext)!
  const { goTo, onClose } = useSimpleRouter()!
  const onDisconnect = () => {
    goTo('ChainList')
  }
  const onSwitchAddress = () => {
    goTo('AddressList')
  }
  const onDevices = () => {
    goTo('DeviceList')
  }
  const onEnhanceSecurity = () => {
    goTo('EnhanceSecurity')
  }

  const icons: Record<CoinType, ReactNode> = {
    [CoinType.btc]: <DeviceIcon className="h-[72px] w-[72px]"></DeviceIcon>,
    [CoinType.ckb]: <DeviceIcon className="h-[72px] w-[72px]"></DeviceIcon>,
    [CoinType.eth]: <EthIcon className="h-[72px] w-[72px]"></EthIcon>,
    [CoinType.bsc]: <BscIcon className="h-[72px] w-[72px]"></BscIcon>,
    [CoinType.matic]: <PolygonIcon className="h-[72px] w-[72px]"></PolygonIcon>,
    [CoinType.trx]: <TronIcon className="h-[72px] w-[72px]"></TronIcon>,
    [CoinType.doge]: <DogecoinIcon className="h-[72px] w-[72px]"></DogecoinIcon>,
  }

  const close = () => {
    onClose()
  }

  const disconnect = async () => {
    onDisconnect()
    walletSDK.disconnect()
  }

  const onSwitch = () => {
    onSwitchAddress()
  }

  const onDotbitBalance = () => {
    smartOpen(walletSDK.context.isTestNet ? DotbitBalanceTestUrl : DotbitBalanceUrl)
  }

  return (
    <>
      <Header className="p-6" onClose={close} />
      <div className="scrollbar-hide dialog-children-container mx-6 my-0 overflow-y-auto">
        <div className="mb-10 text-center">
          {walletSnap.coinType && icons[walletSnap.coinType]}
          <h2 className="my-2 text-2xl font-extrabold leading-7">
            {walletSnap.protocol === WalletProtocol.webAuthn ? 'This Device' : collapseString(walletSnap.address)}
          </h2>
          <span
            className="inline-flex cursor-pointer items-center rounded-[14px] px-2 py-1 text-base leading-4.5 text-font-disconnect hover:bg-secondary active:bg-secondary-active"
            onClick={disconnect}
          >
            <DisconnectIcon className="mr-1 h-4 w-4 text-font-disconnect"></DisconnectIcon>Disconnect
          </span>
        </div>
        {walletSnap.coinType === CoinType.ckb ? (
          <div className="mb-2 overflow-hidden rounded-3xl border border-[#B6C4D966]">
            <div className="flex items-center justify-between p-5 pb-4 text-font-disconnect">
              <span>{`Current manage CKB address`}</span>
              <InfoIcon className="h-4 w-4 text-font-secondary"></InfoIcon>
            </div>
            <div className="px-5 text-xl font-bold">{collapseString(walletSnap.address, 8, 4)}</div>
            <div
              className="mt-5 flex h-[60px] cursor-pointer items-center justify-center bg-[#F6F8FA] text-center text-font-disconnect hover:bg-[#EBF0F4] active:bg-[#DEE6ED]"
              onClick={onSwitch}
            >
              <SwitchIcon className="mr-4 h-4 w-4 text-font-disconnect"></SwitchIcon>Switch
            </div>
          </div>
        ) : null}
        <ul className="mb-6 overflow-hidden rounded-3xl border border-[#B6C4D966]">
          <li
            className="flex cursor-pointer items-center justify-between p-3 pr-5 hover:bg-secondary active:bg-secondary-active"
            onClick={onDotbitBalance}
          >
            <span className="inline-flex items-center text-base leading-5">
              <DotbitBalanceIcon className="mr-3 h-6 w-6"></DotbitBalanceIcon>CKB Balance
            </span>
            <ArrowRightTopIcon className="h-2.5 w-2.5 text-font-tips"></ArrowRightTopIcon>
          </li>
          {walletSnap.protocol === WalletProtocol.webAuthn ? (
            <>
              <hr className="mx-5 h-px bg-[#B6C4D966]" />
              {walletSnap.enableAuthorize && walletSnap.ckbAddresses && walletSnap.ckbAddresses?.length > 1 ? (
                <li
                  className="flex cursor-pointer items-center justify-between p-3 pr-5 hover:bg-secondary active:bg-secondary-active"
                  onClick={onDevices}
                >
                  <span className="inline-flex items-center text-base leading-5">
                    <DevicesIcon className="mr-3 h-6 w-6"></DevicesIcon>Devices
                  </span>
                  <ArrowLeftIcon className="h-2.5 w-2.5 rotate-180 text-font-tips"></ArrowLeftIcon>
                </li>
              ) : (
                <li
                  className="flex cursor-pointer items-center justify-between p-3 pr-5 hover:bg-secondary active:bg-secondary-active"
                  onClick={onEnhanceSecurity}
                >
                  <span className="inline-flex items-center text-base leading-5">
                    <WarningIcon className="mr-3 h-6 w-6"></WarningIcon>Enhance security
                  </span>
                  <ArrowLeftIcon className="h-2.5 w-2.5 rotate-180 text-font-tips"></ArrowLeftIcon>
                </li>
              )}
            </>
          ) : null}
        </ul>
      </div>
    </>
  )
}

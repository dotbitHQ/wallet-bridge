import { Button } from '../Button'
import Wallet from '../../ui/index'

export default {
  title: 'Components/Wallets',
}

const TemplateConnectWallet = () => {
  const wallet = new Wallet({
    isTestNet: true,
  })
  const { walletSnap } = wallet.useWalletState()

  const onConnect = async () => {
    wallet.connectWallet()
  }

  return (
    <>
      <div>
        <div>protocol: {walletSnap.protocol}</div>
        <div>coinType: {walletSnap.coinType}</div>
        <div>address: {walletSnap.address}</div>
      </div>
      <Button onClick={onConnect}>Connect Wallet</Button>
    </>
  )
}

export const ConnectWallet = TemplateConnectWallet.bind({})

const TemplateInitWallet = () => {
  const initWallet = async () => {
    const wallet = new Wallet({
      isTestNet: true,
    })
    await wallet.initWallet()
  }

  return (
    <>
      <Button onClick={initWallet}>init wallet</Button>
    </>
  )
}

export const InitWallet = TemplateInitWallet.bind({})

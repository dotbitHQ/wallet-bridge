import { Button } from '../../components'
import Wallet from '../index'

export default {
  title: 'UI/Wallets',
}

const wallet = new Wallet({
  isTestNet: true,
})

const TemplateConnectWallet = () => {
  const { walletSnap } = wallet.useWalletState()

  const onConnect = async () => {
    wallet.connectWallet()
  }

  const onLoggedIn = async () => {
    wallet.connectWalletInfo()
  }

  const onSignData = async () => {
    const res = await wallet.walletSDK.signData('0x123abc')
    console.log(res)
  }

  return (
    <>
      <div>
        <div>protocol: {walletSnap.protocol}</div>
        <div>coinType: {walletSnap.coinType}</div>
        <div>address: {walletSnap.address}</div>
      </div>
      <Button onClick={onConnect}>Connect Wallet</Button>
      <br />
      <Button onClick={onLoggedIn}>Logged In</Button>
      <br />
      <Button onClick={onSignData}>Sign data</Button>
    </>
  )
}

export const ConnectWallet = TemplateConnectWallet.bind({})

const TemplateInitWallet = () => {
  const initWallet = async () => {
    await wallet.initWallet()
  }

  return (
    <>
      <Button onClick={initWallet}>init wallet</Button>
    </>
  )
}

export const InitWallet = TemplateInitWallet.bind({})

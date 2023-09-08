import { WalletConnector } from './WalletConnector'
import { resetWalletState, setWalletState } from '../../store'
import CustomError from '../../utils/CustomError'
import errno from '../../constant/errno'

export class ConnectDidConnector extends WalletConnector {
  async connect() {
    const { provider } = this.context
    const res = await provider.requestDeviceData()
    if (res.code !== errno.connectDidSdkSuccess) {
      throw new CustomError(res.code, res.message)
    }
    if (res.data) {
      this.context.address = res.data.ckbAddr
      setWalletState({ deviceData: res.data })
    }
  }

  async disconnect(): Promise<void> {
    this.context.address = undefined
    this.context.chainId = undefined
    this.context.coinType = undefined
    resetWalletState()
  }

  async switchNetwork(chainId: number): Promise<void> {}
}

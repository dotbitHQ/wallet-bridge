import { WalletConnector } from './WalletConnector'
import { resetWalletState, setWalletState } from '../../store'
import { ActionErrorCode } from 'connect-did-sdk'
import CustomError from '../../utils/CustomError'

export class ConnectDidConnector extends WalletConnector {
  async connect() {
    const { provider } = this.context
    const res = await provider.requestNewDeviceData()
    if (res.code !== ActionErrorCode.SUCCESS) {
      throw new CustomError(res.code, res.msg)
    }
    if (res.data) {
      this.context.address = res.data.ckbAddr
      setWalletState({ deviceData: res.data })
    }
  }

  disconnect() {
    this.context.address = undefined
    this.context.chainId = undefined
    this.context.coinType = undefined
    resetWalletState()
  }

  switchNetwork(chainId: number): void {}
}

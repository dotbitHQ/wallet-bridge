import { WalletConnector } from './WalletConnector'
import { getAuthorizeInfo, getMastersAddress, resetWalletState, setWalletState } from '../../store'
import CustomError from '../../utils/CustomError'
import errno from '../../constant/errno'
import { EventEnum } from '../WalletEventListenerHandler'
import { loginCacheState } from '../../store/loginCache'
import { snapshot } from 'valtio'

export class ConnectDidConnector extends WalletConnector {
  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }) {
    const { provider } = this.context
    const { signDataParams } = snapshot(loginCacheState)
    let res
    let signature
    if (signDataParams) {
      res = await provider.requestDeviceSignData({ msg: signDataParams.data })
      signature = res.data.signature
      res.data = res.data.deviceData
    } else {
      res = await provider.requestDeviceData()
    }

    if (res.code !== errno.connectDidSdkSuccess) {
      throw new CustomError(res.code, res.message)
    }
    if (res.data) {
      this.context.address = res.data.ckbAddr
      setWalletState({
        protocol: this.context.protocol,
        address: this.context.address,
        coinType: this.context.coinType,
        walletName: this.context.walletName,
        deviceData: res.data,
      })
      await getMastersAddress()
      await getAuthorizeInfo({ detectAssets: true })
      if (signature) {
        this.context.emitEvent(EventEnum.Signature, signature)
      } else if (!ignoreEvent) {
        this.context.emitEvent(EventEnum.Connect)
      }
    }
  }

  async disconnect(): Promise<void> {
    this.context.address = undefined
    this.context.chainId = undefined
    this.context.coinType = undefined
    resetWalletState()
    this.context.emitEvent(EventEnum.Disconnect)
  }

  async switchNetwork(chainId: number): Promise<void> {}
}

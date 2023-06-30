import { WalletConnector } from './WalletConnector'
import { resetWalletState, setWalletState } from '../../store'
import CustomError from '../../utils/CustomError'
import errno from '../../constant/errno'
import Axios from 'axios'
import { WebAuthnApi, WebAuthnTestApi } from '../../constant'

export class ConnectDidConnector extends WalletConnector {
  async connect() {
    const { provider } = this.context
    const res = await provider.requestDeviceData()
    if (res.code !== errno.connectDidSdkSuccess) {
      throw new CustomError(res.code, res.msg)
    }
    if (res.data) {
      this.context.address = res.data.ckbAddr
      await this.getAuthorizeInfo(res.data.ckbAddr)
      setWalletState({ deviceData: res.data })
    }
  }

  async getAuthorizeInfo(ckbAddress: string) {
    const { isTestNet } = this.context
    const api = isTestNet ? WebAuthnTestApi : WebAuthnApi
    const res = await Axios.post(`${api}/v1/webauthn/authorize-info`, {
      ckb_address: ckbAddress,
    })
    if (res.data?.err_no === errno.success) {
      setWalletState({
        ckbAddresses: res.data.data.ckb_address,
        enableAuthorize: !!res.data.data.enable_authorize,
      })
    } else {
      throw new CustomError(
        res.data?.err_no || res?.statusText || errno.networkError,
        res.statusText || res.data?.err_msg || 'Network Error',
      )
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

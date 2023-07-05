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
      await this.getAuthorizeInfo(res.data.ckbAddr, res.data.credential.rawId)
      setWalletState({ deviceData: res.data })
    }
  }

  async getAuthorizeInfo(ckbAddress: string, cid: string) {
    const { isTestNet } = this.context
    const api = isTestNet ? WebAuthnTestApi : WebAuthnApi

    const [authorizeInfo, mastersAddress] = await Promise.all([
      Axios.post(`${api}/v1/webauthn/authorize-info`, {
        ckb_address: ckbAddress,
      }),
      Axios.post(`${api}/v1/webauthn/get-masters-addr`, {
        cid,
      }),
    ])
    if (authorizeInfo.data?.err_no === errno.success && mastersAddress.data?.err_no === errno.success) {
      setWalletState({
        enableAuthorize: !!authorizeInfo.data.data.enable_authorize,
        ckbAddresses: mastersAddress.data.data.ckb_address,
      })
    } else {
      throw new CustomError(
        authorizeInfo.data?.err_no || mastersAddress.data?.err_no,
        authorizeInfo.data?.err_msg || mastersAddress.data?.err_msg,
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

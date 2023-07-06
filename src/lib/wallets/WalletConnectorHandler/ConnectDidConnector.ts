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
      await this.getMastersAddress(res.data.credential.rawId)
      setWalletState({ deviceData: res.data })
    }
  }

  async getMastersAddress(cid: string) {
    const { isTestNet } = this.context
    const api = isTestNet ? WebAuthnTestApi : WebAuthnApi

    const mastersAddress = await Axios.post(`${api}/v1/webauthn/get-masters-addr`, {
      cid,
    })
    if (mastersAddress.data?.err_no === errno.success) {
      setWalletState({
        ckbAddresses: mastersAddress.data.data.ckb_address,
      })
    } else {
      throw new CustomError(mastersAddress.data?.err_no, mastersAddress.data?.err_msg)
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

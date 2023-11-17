import { CfAccessClient, WebAuthnApi, WebAuthnTestApi } from '../constant'
import { SignTxListRes } from '../types'

export function useWebAuthnService(isTestNet?: boolean) {
  const baseURL = isTestNet ? WebAuthnTestApi : WebAuthnApi

  async function buildTransaction(data: {
    operation: 'add' | 'delete'
    master_ckb_address: string
    slave_ckb_address: string
  }) {
    const cfAccessClient = isTestNet ? CfAccessClient : {}
    const res = await fetch(`${baseURL}/v1/webauthn/authorize`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...cfAccessClient,
      },
      body: JSON.stringify(data),
    }).then(async (res) => await res.json())
    return res
  }

  async function sendTransaction(data: SignTxListRes) {
    const cfAccessClient = isTestNet ? CfAccessClient : {}
    const res = await fetch(`${baseURL}/v1/transaction/send`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...cfAccessClient,
      },
      body: JSON.stringify(data),
    }).then(async (res) => await res.json())
    return res
  }

  async function getTransactionStatus(txHash: string) {
    const cfAccessClient = isTestNet ? CfAccessClient : {}
    const res = await fetch(`${baseURL}/v1/transaction/status`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...cfAccessClient,
      },
      body: JSON.stringify({
        tx_hash: txHash,
      }),
    }).then(async (res) => await res.json())

    return res
  }

  return {
    sendTransaction,
    buildTransaction,
    getTransactionStatus,
  }
}

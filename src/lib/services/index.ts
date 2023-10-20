import { WebAuthnApi, WebAuthnTestApi } from '../constant'
import { SignTxListRes } from '../types'

export function useWebAuthnService(isTestNet?: boolean) {
  const baseURL = isTestNet ? WebAuthnTestApi : WebAuthnApi

  async function buildTransaction(data: {
    operation: 'add' | 'delete'
    master_ckb_address: string
    slave_ckb_address: string
  }) {
    const res = await fetch(`${baseURL}/v1/webauthn/authorize`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(async (res) => await res.json())
    return res
  }

  async function sendTransaction(data: SignTxListRes) {
    const res = await fetch(`${baseURL}/v1/transaction/send`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(async (res) => await res.json())
    return res
  }

  async function getTransactionStatus(txHash: string) {
    const res = await fetch(`${baseURL}/v1/transaction/status`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
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

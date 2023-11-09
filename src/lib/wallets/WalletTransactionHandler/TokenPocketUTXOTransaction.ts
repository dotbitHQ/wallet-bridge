import { ISendTrxParams, WalletTransaction } from './WalletTransaction'
import { toDecimal } from '../../utils'
import { t } from '@lingui/macro'

export class TokenPocketUTXOTransaction extends WalletTransaction {
  async sendTrx(data: ISendTrxParams): Promise<string> {
    const from = this.context.address
    const opReturn = data.data
    const params = { from, to: data.to, amount: data.value, op_return: opReturn }

    if (!params.from || !params.to || !params.amount) {
      // eslint-disable-next-line lingui/no-unlocalized-strings
      throw new Error('missing params; "from", "to", "amount" is required ')
    }

    const balance = await this.getTPUTXOCurrentBalance()
    if (toDecimal(balance.data?.balance || 0).lte(params.amount)) {
      throw new Error(t`insufficient funds for transfer`)
    }

    return await new Promise((resolve, reject) => {
      const random = parseInt(String(Math.random() * 100000))
      const tpCallbackFun = 'tp_callback_' + String(new Date().getTime()) + String(random)

      // @ts-expect-error
      window[tpCallbackFun] = function (result: any) {
        result = result.replace(/\r/gi, '').replace(/\n/gi, '')
        try {
          const res = JSON.parse(result)
          if (res.result) {
            resolve(res.data)
          } else {
            reject(res.message)
          }
        } catch (err) {
          reject(err)
        }
      }
      this.sendTokenPocketRequest('btcTokenTransfer', JSON.stringify(params), tpCallbackFun)
    })
  }

  async getTPUTXOCurrentBalance(): Promise<Record<string, any>> {
    return await new Promise((resolve, reject) => {
      const random = parseInt(String(Math.random() * 100000))
      const tpCallbackFun = 'tp_callback_' + String(new Date().getTime()) + String(random)

      // @ts-expect-error
      window[tpCallbackFun] = function (result: any) {
        result = result.replace(/\r/gi, '').replace(/\n/gi, '')
        try {
          const res = JSON.parse(result)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      }

      this.sendTokenPocketRequest('getCurrentBalance', '', tpCallbackFun)
    })
  }

  sendTokenPocketRequest(methodName: string, params: any, callback?: string) {
    if (window.TPJSBrigeClient) {
      window.TPJSBrigeClient.callMessage(methodName, params, callback)
    }
    // ios
    if (window.webkit) {
      window.webkit.messageHandlers[methodName].postMessage({
        body: {
          params,
          callback,
        },
      })
    }
  }
}

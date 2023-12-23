import React from 'react'
import { createRoot } from 'react-dom/client'
import { snapshot } from 'valtio'
import { WalletConnector } from './WalletConnectorHandler'
import { SignDataOptions, SignDataParams, SignDataType, WalletSigner } from './WalletSignerHandler'
import { ISendTrxParams, WalletTransaction } from './WalletTransactionHandler'
import { WalletContext } from './WalletContext'
import { EventEnum, WalletEventListener } from './WalletEventListenerHandler'
import { WalletHandlerFactory } from './WalletHandlerFactory'
import { CoinType, WalletProtocol, SIGN_TYPE, WebAuthnTestApi, WebAuthnApi, CfAccessClient } from '../constant'
import { InitSignContextRes, SignInfo, SignTxListParams, SignTxListRes } from '../types'
import { cloneDeep } from 'lodash-es'
import { convertTpUTXOSignature, getShadowDomRoot, isDogecoinChain, mmJsonHashAndChainIdHex, sleep } from '../utils'
import { backupDeviceData, getAuthorizeInfo, getMastersAddress, walletState } from '../store'
import { ConnectWallet } from '../ui/ConnectWallet'
import CustomError from '../utils/CustomError'
import errno from '../constant/errno'
import { DeviceAuthError } from 'connect-did-sdk'
import Axios from 'axios'
import { setLoginCacheState } from '../store/loginCache'
import { createTips } from '../components'
import { t } from '@lingui/macro'

Axios.defaults.withCredentials = true

class WalletSDK {
  walletConnector?: WalletConnector
  walletSigner?: WalletSigner
  walletTransaction?: WalletTransaction
  eventListener?: WalletEventListener
  context: WalletContext
  onlyEth = false

  constructor({
    isTestNet,
    wagmiConfig,
    gtag,
    event,
  }: {
    isTestNet: boolean
    wagmiConfig?: any
    gtag?: any
    event?: any
  }) {
    this.context = new WalletContext({ isTestNet, wagmiConfig, gtag, event })
  }

  async init({
    coinType,
    walletName,
  }: {
    coinType?: CoinType
    walletName?: string
  } = {}) {
    try {
      await this.context.retrieveProvider({
        coinType,
        walletName,
      })
    } catch (err) {
      this.walletConnector = WalletHandlerFactory.createConnector(this.context)
      throw err
    }
    this.eventListener?.removeEvents()
    this.walletConnector = WalletHandlerFactory.createConnector(this.context)
    this.walletSigner = WalletHandlerFactory.createSigner(this.context)
    this.walletTransaction = WalletHandlerFactory.createTransaction(this.context)
    this.eventListener = WalletHandlerFactory.createEventListener(this.context)
    this.eventListener?.listenEvents()
  }

  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }): Promise<void> {
    await this.walletConnector?.connect({ ignoreEvent })
    this.context.reportEvent('click', {
      category: 'wallet-bridge',
      // eslint-disable-next-line lingui/no-unlocalized-strings
      label: 'connect wallet',
      coinType: this.context.coinType,
      walletName: this.context.walletName,
      value: 1,
      nonInteraction: true,
    })
  }

  async disconnect() {
    this.eventListener?.removeEvents()
    await this.walletConnector?.disconnect()
  }

  connectWallet(params: { initComponent?: string; onlyEth?: boolean } = {}): void {
    const shadowDomRoot = getShadowDomRoot()
    this.onlyEth = params.onlyEth ?? false
    const connectWalletInstance = React.createElement(ConnectWallet, {
      visible: true,
      walletSDK: this,
      ...params,
    })
    createRoot(shadowDomRoot).render(connectWalletInstance)
  }

  async connectWalletAndSignData(params: { signData: SignDataParams }): Promise<{ signature: string } | undefined> {
    return await new Promise((resolve) => {
      if (params.signData) {
        setLoginCacheState({ signDataParams: params.signData })
        this.connectWallet()
        void this.context.once(EventEnum.Signature).then((res) => {
          if (res !== undefined) {
            setLoginCacheState({ signDataParams: null })
          }
          resolve({ signature: res })
          this.context.emitEvent(EventEnum.Connect)
        })
      }
    })
  }

  onInvolution(involution: boolean): void {
    if (involution) {
      this.connectWallet()
    }
  }

  async initWallet({
    involution = true,
    isDisconnect = false,
  }: { involution?: boolean; isDisconnect?: boolean } = {}): Promise<boolean> {
    try {
      const { protocol, coinType, deviceData, walletName } = snapshot(walletState)

      if (walletName && protocol && coinType) {
        await this.init()
        if (protocol === WalletProtocol.webAuthn && deviceData) {
          if (!isDisconnect) {
            void getAuthorizeInfo().then(() => {
              void backupDeviceData()
            })
            void getMastersAddress()
          }
          return true
        } else {
          if (involution) {
            await this.connect({ ignoreEvent: true })
          }
          return true
        }
      }
      this.onInvolution(involution)
      return false
    } catch (error: any) {
      if (!involution) {
        createTips({
          title: t`Error`,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          content: error.code ? `${error.code}: ${error.message}` : error.message ? error.message : error.toString(),
        })
      }
      this.onInvolution(involution)
      return false
    }
  }

  async signData(data: SignDataType, options?: SignDataOptions): Promise<string | undefined> {
    const isInit = await this.initWallet()
    if (!isInit && !this.walletSigner) {
      // eslint-disable-next-line lingui/no-unlocalized-strings
      throw new CustomError(errno.failedToInitializeWallet, 'signData: Please initialize wallet first')
    }
    return await this.walletSigner?.signData(data, options)
  }

  async sendTransaction(data: ISendTrxParams): Promise<string | undefined> {
    const isInit = await this.initWallet()
    if (!isInit && !this.walletTransaction) {
      // eslint-disable-next-line lingui/no-unlocalized-strings
      throw new CustomError(errno.failedToInitializeWallet, 'sendTransaction: Please initialize wallet first')
    }
    return await this.walletTransaction?.sendTrx(data)
  }

  private async signTx(signInfo: SignInfo, options?: SignDataOptions): Promise<SignInfo> {
    let signDataRes = await this.signData(signInfo.sign_msg, options)
    if (signDataRes && this.context.coinType && isDogecoinChain(this.context.coinType)) {
      signDataRes = convertTpUTXOSignature(signDataRes)
    }
    if (signDataRes) {
      signInfo.sign_msg = signDataRes
    }
    await sleep(1000)
    return signInfo
  }

  async signTxList(txs: SignTxListParams, options?: SignDataOptions): Promise<SignTxListRes> {
    const isInit = await this.initWallet()
    if (!isInit) {
      // eslint-disable-next-line lingui/no-unlocalized-strings
      throw new CustomError(errno.failedToInitializeWallet, 'signTxList: Please initialize wallet first')
    }

    let provider

    if (this.context.protocol === WalletProtocol.webAuthn) {
      if (options?.provider) {
        provider = options?.provider
      } else {
        provider = await this.context.provider.requestWaitingPage((err: DeviceAuthError) => {
          console.error(err)
          throw new CustomError(err.code, err.message)
        })
      }
    }

    for (const signItem of txs.sign_list) {
      if (signItem.sign_msg === '' || signItem.sign_type === SIGN_TYPE.noSign) {
        continue
      }
      if (signItem.sign_type === SIGN_TYPE.eth712 && !!txs.mm_json) {
        const mmJson = cloneDeep(txs.mm_json)
        mmJson.message.digest = signItem.sign_msg
        const signDataRes = await this.signData(mmJson, { isEIP712: true })
        if (signDataRes && mmJson.domain.chainId) {
          signItem.sign_msg = signDataRes + mmJsonHashAndChainIdHex(mmJson, mmJson.domain.chainId)
        }
        await sleep(1000)
      } else {
        await this.signTx(signItem, { provider })
        await sleep(1000)
      }
    }

    delete txs.mm_json
    // @ts-expect-error
    delete txs.list

    const { deviceData } = snapshot(walletState)
    if (deviceData?.ckbAddr) {
      ;(txs as SignTxListRes).sign_address = deviceData.ckbAddr
    }

    return txs
  }

  async initSignContext(): Promise<InitSignContextRes> {
    const isInit = await this.initWallet()
    if (!isInit) {
      // eslint-disable-next-line lingui/no-unlocalized-strings
      throw new CustomError(errno.failedToInitializeWallet, 'initSignContext: Please initialize wallet first')
    }

    let provider: any
    if (this.context.protocol === WalletProtocol.webAuthn) {
      provider = await this.context.provider.requestWaitingPage((err: DeviceAuthError) => {
        console.error(err)
        throw new CustomError(err.code, err.message)
      })
    }

    return {
      signTxList: async (txs: SignTxListParams): Promise<SignTxListRes> => {
        return await this.signTxList(txs, { provider })
      },
      signData: async (data: SignDataType, options?: SignDataOptions): Promise<string | undefined> => {
        return await this.signData(data, { ...options, provider })
      },
      onFailed:
        provider?.onFailed ||
        (async (k: any): Promise<any> => {
          console.log(k)
          return undefined
        }),
      onClose:
        provider?.onClose ||
        (async (): Promise<any> => {
          return undefined
        }),
    }
  }

  async _verifyPasskeySignature({ message, signature }: { message: string; signature: string }): Promise<boolean> {
    const isInit = await this.initWallet()
    if (!isInit) {
      // eslint-disable-next-line lingui/no-unlocalized-strings
      throw new CustomError(errno.failedToInitializeWallet, '_verifyPasskeySignature: Please initialize wallet first')
    }
    const { isTestNet, address, deviceData } = snapshot(walletState)
    const api = isTestNet ? WebAuthnTestApi : WebAuthnApi
    const res = await Axios.post(
      `${api}/v1/webauthn/verify`,
      {
        master_addr: address,
        backup_addr: deviceData?.ckbAddr,
        msg: message,
        signature,
      },
      {
        headers: isTestNet ? { ...CfAccessClient } : {},
      },
    )

    if (res.data?.err_no !== errno.success) {
      throw new CustomError(res.data?.err_no, res.data?.err_msg)
    }

    return res.data?.data?.is_valid
  }
}
export default WalletSDK

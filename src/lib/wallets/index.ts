import React from 'react'
import { createRoot } from 'react-dom/client'
import { snapshot } from 'valtio'
import { WalletConnector } from './WalletConnectorHandler'
import { SignDataType, WalletSigner } from './WalletSignerHandler'
import { ISendTrxParams, WalletTransaction } from './WalletTransactionHandler'
import { WalletContext } from './WalletContext'
import { EventEnum, WalletEventListener } from './WalletEventListenerHandler'
import { WalletHandlerFactory } from './WalletHandlerFactory'
import { CoinType, WalletProtocol, SIGN_TYPE, WebAuthnTestApi, WebAuthnApi } from '../constant'
import { InitSignContextRes, SignInfo, TxsSignedOrUnSigned, TxsWithMMJsonSignedOrUnSigned } from '../types'
import { cloneDeep } from 'lodash-es'
import { convertTpUTXOSignature, getShadowDomRoot, isDogecoinChain, mmJsonHashAndChainIdHex, sleep } from '../utils'
import { getAuthorizeInfo, getMastersAddress, setWalletState, walletState } from '../store'
import { ConnectWallet } from '../ui/ConnectWallet'
import CustomError from '../utils/CustomError'
import errno from '../constant/errno'
import { DeviceAuthError } from 'connect-did-sdk'
import Axios from 'axios'

class WalletSDK {
  walletConnector?: WalletConnector
  walletSigner?: WalletSigner
  walletTransaction?: WalletTransaction
  eventListener?: WalletEventListener
  context: WalletContext
  onlyEth = false

  constructor({ isTestNet }: { isTestNet: boolean }) {
    this.context = new WalletContext({ isTestNet })
  }

  async init({ protocol, coinType }: { protocol: WalletProtocol; coinType: CoinType }) {
    await this.context.retrieveProvider({
      protocol,
      coinType,
    })
    this.walletConnector = WalletHandlerFactory.createConnector(this.context)
    this.walletSigner = WalletHandlerFactory.createSigner(this.context)
    this.walletTransaction = WalletHandlerFactory.createTransaction(this.context)
    this.eventListener = WalletHandlerFactory.createEventListener(this.context)
  }

  async connect({ ignoreEvent }: { ignoreEvent: boolean } = { ignoreEvent: false }): Promise<void> {
    await this.walletConnector?.connect()
    this.eventListener?.removeEvents()
    this.eventListener?.listenEvents()
    setWalletState({
      protocol: this.context.protocol,
      address: this.context.address,
      coinType: this.context.coinType,
    })
    await getMastersAddress()
    await getAuthorizeInfo({ detectAssets: true })
    if (!ignoreEvent) {
      this.context.emitEvent(EventEnum.Connect)
    }
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

  onInvolution(involution: boolean): void {
    if (involution) {
      this.connectWallet()
    }
  }

  async initWallet({ involution = true }: { involution?: boolean } = {}): Promise<boolean> {
    try {
      const { protocol, coinType, deviceData } = snapshot(walletState)

      if (protocol && coinType) {
        await this.init({
          protocol,
          coinType,
        })
        if (protocol === WalletProtocol.webAuthn && deviceData) {
          void getAuthorizeInfo()
          void getMastersAddress()
          return true
        } else {
          await this.connect({ ignoreEvent: true })
          return true
        }
      }
      this.onInvolution(involution)
      return false
    } catch (error) {
      console.error(error)
      this.onInvolution(involution)
      return false
    }
  }

  async switchNetwork(chainId: number) {
    if (!chainId) throw new Error('connect: Please provide a valid chainId')
    const isInit = await this.initWallet()
    if (!isInit && !this.walletConnector) {
      throw new CustomError(errno.failedToInitializeWallet, 'switchNetwork: Please initialize wallet first')
    }
    this.eventListener?.removeEvents()
    this.walletConnector?.disconnect()
    this.walletConnector?.switchNetwork(chainId)
    await this.connect()
    this.context.emitEvent(EventEnum.Connect)
  }

  async signData(data: SignDataType, options?: Record<string, any>): Promise<string | undefined> {
    const isInit = await this.initWallet()
    if (!isInit && !this.walletSigner) {
      throw new CustomError(errno.failedToInitializeWallet, 'signData: Please initialize wallet first')
    }
    return await this.walletSigner?.signData(data, options)
  }

  async sendTransaction(data: ISendTrxParams): Promise<string | undefined> {
    const isInit = await this.initWallet()
    if (!isInit && !this.walletTransaction) {
      throw new CustomError(errno.failedToInitializeWallet, 'sendTransaction: Please initialize wallet first')
    }
    return await this.walletTransaction?.sendTrx(data)
  }

  async disconnect() {
    const isInit = await this.initWallet({ involution: false })
    if (!isInit) {
      throw new CustomError(errno.failedToInitializeWallet, 'disconnect: Please initialize wallet first')
    }
    this.eventListener?.removeEvents()
    this.walletConnector?.disconnect()
    this.context.emitEvent(EventEnum.Disconnect)
  }

  private async signTx(signInfo: SignInfo, options?: Record<string, any>): Promise<SignInfo> {
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

  // todo-open: TxsSignedOrUnSigned and TxsWithMMJsonSignedOrUnSigned is pretty much the same, while they are from different api. We need to unify them in backend.
  async signTxList(txs: TxsSignedOrUnSigned, options?: Record<string, any>): Promise<TxsSignedOrUnSigned>
  async signTxList(
    txs: TxsWithMMJsonSignedOrUnSigned,
    options?: Record<string, any>,
  ): Promise<TxsWithMMJsonSignedOrUnSigned>
  async signTxList(
    txs: TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned,
    options?: Record<string, any>,
  ): Promise<TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned> {
    const isInit = await this.initWallet()
    if (!isInit) {
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

    if ('sign_list' in txs) {
      for (const signItem of txs.sign_list) {
        if (!(signItem.sign_msg && signItem.sign_type !== SIGN_TYPE.noSign)) {
          continue
        }
        if (signItem.sign_type === SIGN_TYPE.eth712 && txs.mm_json != null) {
          const mmJson = cloneDeep(txs.mm_json)
          mmJson.message.digest = signItem.sign_msg
          const signDataRes = await this.signData(mmJson, { isEIP712: true })
          if (signDataRes && mmJson.domain.chainId) {
            signItem.sign_msg = signDataRes + mmJsonHashAndChainIdHex(mmJson, mmJson.domain.chainId)
          }
          await sleep(1000)
        } else {
          await this.signTx(signItem, { provider })
        }
      }
    } else if ('list' in txs) {
      for (const list of txs.list) {
        for (const signItem of list.sign_list) {
          if (!(signItem.sign_msg && signItem.sign_type !== SIGN_TYPE.noSign)) {
            continue
          }
          await this.signTx(signItem, { provider })
        }
      }
    }

    const { deviceData } = snapshot(walletState)
    if (deviceData?.ckbAddr) {
      txs.sign_address = deviceData.ckbAddr
    }

    return txs
  }

  async initSignContext(): Promise<InitSignContextRes> {
    const isInit = await this.initWallet()
    if (!isInit) {
      throw new CustomError(errno.failedToInitializeWallet, 'initSignContext: Please initialize wallet first')
    }

    let provider: any
    if (this.context.protocol === WalletProtocol.webAuthn) {
      const timestamp = Date.now()
      provider = await this.context.provider.requestWaitingPage((err: DeviceAuthError) => {
        console.error(err)
        throw new CustomError(err.code, err.message)
      })
      console.log('requestWaitingPage', Date.now() - timestamp)
    }

    return {
      signTxList: async (
        txs: TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned,
      ): Promise<TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned> => {
        return await this.signTxList(txs as any, { provider })
      },
      signData: async (data: SignDataType, options?: Record<string, any>): Promise<string | undefined> => {
        return await this.signData(data, { ...options, provider })
      },
      onFailed: provider?.onFailed,
    }
  }

  async _verifyPasskeySignature({ message, signature }: { message: string; signature: string }): Promise<boolean> {
    const isInit = await this.initWallet()
    if (!isInit) {
      throw new CustomError(errno.failedToInitializeWallet, '_verifyPasskeySignature: Please initialize wallet first')
    }
    const { isTestNet, address, deviceData } = snapshot(walletState)
    const api = isTestNet ? WebAuthnTestApi : WebAuthnApi
    const res = await Axios.post(`${api}/v1/webauthn/verify`, {
      master_addr: address,
      backup_addr: deviceData?.ckbAddr,
      msg: message,
      signature,
    })

    if (res.data?.err_no !== errno.success) {
      throw new CustomError(res.data?.err_no, res.data?.err_msg)
    }

    return res.data?.data?.is_valid
  }
}
export default WalletSDK

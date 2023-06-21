import { WalletConnector } from './WalletConnectorHandler'
import { WalletSigner } from './WalletSignerHandler'
import { ISendTrxParams, WalletTransaction } from './WalletTransactionHandler'
import { WalletContext } from './WalletContext'
import { EventEnum, WalletEventListener } from './WalletEventListenerHandler'
import { WalletHandlerFactory } from './WalletHandlerFactory'
import { CoinType, WalletProtocol, SIGN_TYPE } from '../constant'
import { TxsSignedOrUnSigned, TxsWithMMJsonSignedOrUnSigned } from '../../types'
import { cloneDeep } from 'lodash-es'
import { convertTpUTXOSignature, isDogecoinChain, mmJsonHashAndChainIdHex, sleep } from '../utils'
import { setWalletState } from '../store'

class WalletSDK {
  walletConnector?: WalletConnector
  walletSigner?: WalletSigner
  walletTransaction?: WalletTransaction
  eventListener?: WalletEventListener
  context: WalletContext

  constructor({ isTestNet }: { isTestNet: boolean }) {
    this.context = new WalletContext({ isTestNet })
  }

  async init({ protocol, coinType }: { protocol: WalletProtocol; coinType: CoinType }) {
    await this.initWallet({ protocol, coinType })
    await this.connect()
    setWalletState({
      protocol: this.context.protocol,
      address: this.context.address,
      coinType: this.context.coinType,
    })
  }

  async initWallet({ protocol, coinType }: { protocol: WalletProtocol; coinType: CoinType }) {
    await this.context.retrieveProvider({
      protocol,
      coinType,
    })
    this.walletConnector = WalletHandlerFactory.createConnector(this.context)
    this.walletSigner = WalletHandlerFactory.createSigner(this.context)
    this.walletTransaction = WalletHandlerFactory.createTransaction(this.context)
    this.eventListener = WalletHandlerFactory.createEventListener(this.context)
  }

  async connect(): Promise<void> {
    await this.walletConnector?.connect()
    this.eventListener?.removeEvents()
    this.eventListener?.listenEvents()
    this.context.emitEvent(EventEnum.Connect)
  }

  async switchNetwork(chainId: number) {
    if (!chainId) throw new Error('connect: Please provide a valid chainId')
    if (this.walletConnector != null) {
      this.eventListener?.removeEvents()
      this.walletConnector.disconnect()
      this.walletConnector.switchNetwork(chainId)
      await this.connect()
      this.context.emitEvent(EventEnum.Connect)
    } else {
      throw new Error('connect: Please initialize wallet first')
    }
  }

  async signData(data: string, options?: Record<string, any>): Promise<string | undefined> {
    if (this.walletSigner != null) {
      return await this.walletSigner.signData(data, options)
    } else {
      throw new Error('signData: Please initialize wallet first')
    }
  }

  async sendTransaction(data: ISendTrxParams): Promise<string> {
    if (this.walletTransaction != null) {
      return await this.walletTransaction.sendTrx(data)
    } else {
      throw new Error('sendTransaction: Please initialize wallet first')
    }
  }

  // todo-open: TxsSignedOrUnSigned and TxsWithMMJsonSignedOrUnSigned is pretty much the same, while they are from different api. We need to unify them in backend.
  async signTxList(txs: TxsSignedOrUnSigned): Promise<TxsSignedOrUnSigned>
  async signTxList(txs: TxsWithMMJsonSignedOrUnSigned): Promise<TxsWithMMJsonSignedOrUnSigned>
  async signTxList(
    txs: TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned,
  ): Promise<TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned> {
    if ('sign_list' in txs) {
      for (const signItem of txs.sign_list) {
        if (signItem.sign_msg && signItem.sign_type !== SIGN_TYPE.noSign) {
          if (signItem.sign_type === SIGN_TYPE.eth712 && txs.mm_json) {
            const mmJson = cloneDeep(txs.mm_json)
            mmJson.message.digest = signItem.sign_msg
            const signDataRes = await this.signData(mmJson, { isEIP712: true })
            if (signDataRes && mmJson.domain.chainId) {
              signItem.sign_msg = signDataRes + mmJsonHashAndChainIdHex(mmJson, mmJson.domain.chainId)
            }
            await sleep(1000)
          } else {
            let signDataRes = await this.signData(signItem.sign_msg)
            if (signDataRes && this.context.coinType && isDogecoinChain(this.context.coinType)) {
              signDataRes = convertTpUTXOSignature(signDataRes)
            }
            if (signDataRes) {
              signItem.sign_msg = signDataRes
            }
            await sleep(1000)
          }
        }
      }
    } else if ('list' in txs) {
      for (const list of txs.list) {
        for (const signItem of list.sign_list) {
          if (signItem.sign_msg && signItem.sign_type !== SIGN_TYPE.noSign) {
            let signDataRes = await this.signData(signItem.sign_msg)
            if (signDataRes && this.context.coinType && isDogecoinChain(this.context.coinType)) {
              signDataRes = convertTpUTXOSignature(signDataRes)
            }
            if (signDataRes) {
              signItem.sign_msg = signDataRes
            }
            await sleep(1000)
          }
        }
      }
    }

    return txs
  }
}
export default WalletSDK

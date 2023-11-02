import BN from 'bn.js'
// @ts-expect-error
import numberToBN from 'number-to-bn'
import { Keccak } from 'sha3'
import { Decimal } from 'decimal.js'
import utf8 from 'utf8'
import { MessageTypes, SignTypedDataVersion, TypedDataUtils, TypedMessage } from '@metamask/eth-sig-util'
import { Buffer } from 'buffer'
import { CoinType, CustomWallet } from '../constant'
import GraphemeSplitter from 'grapheme-splitter'
import { isMobileOnly } from 'react-device-detect'
// @ts-expect-error
import abcCopy from 'abc-copy'
import UAParser from 'ua-parser-js'
import shadowDomRootStyle from '../../lib/tailwind/theme.css?inline'

let shadowDomRoot: ShadowRoot | null = null

export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Check if string is HEX, requires a 0x in front
 *
 * @method isHexStrict
 * @param {String} hex to be checked
 * @returns {Boolean}
 */
export function isHexStrict(hex: string | number): boolean {
  return /^(-)?0x[0-9a-f]*$/i.test(String(hex))
}

/**
 * Takes an input and transforms it into an BN
 *
 * @method toBN
 * @param {Number|String|BN} number, string, HEX string or BN
 * @return {BN} BN
 */
export function toBN(number: number | string): BN {
  try {
    return numberToBN(number)
  } catch (err) {
    throw new Error(`${String(err)} Given value: "${number}"`)
  }
}

/**
 * Converts value to it's number representation
 *
 * @method hexToNumber
 * @param {String|Number|BN} value
 * @return {String}
 */
export function hexToNumber(value: string | number): string | number {
  if (typeof value === 'string' && !isHexStrict(value)) {
    throw new Error('Given value "' + value + '" is not a valid hex string.')
  }
  return toBN(value).toNumber()
}

/**
 * Convert a hexadecimal chainId to decimal
 * @param chainId
 */
export function chainIdHexToNumber(chainId: string | number): number {
  const _chainId = isHexStrict(chainId) ? hexToNumber(chainId) : chainId
  return Number(_chainId)
}

/**
 * Converts to a checksum address
 *
 * @method toChecksumAddress
 * @param {String} address the given HEX address
 * @return {String}
 */
export function toChecksumAddress(address: string): string {
  if (typeof address === 'undefined') return ''

  if (!/^(0x)?[0-9a-f]{40}$/i.test(address))
    throw new Error(`Given address "${address}" is not a valid Ethereum address.`)

  address = address.toLowerCase().replace(/^0x/i, '')
  const hash = new Keccak(256).update(address).digest('hex')
  const addressHash = hash.replace(/^0x/i, '')
  let checksumAddress = '0x'

  for (let i = 0; i < address.length; i++) {
    // If ith character is 8 to f then make it uppercase
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase()
    } else {
      checksumAddress += address[i]
    }
  }
  return checksumAddress
}

/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 *
 * @method utf8ToHex
 * @param {String} str
 * @returns {String} hex representation of input string
 */
export function utf8ToHex(str: string): string {
  str = utf8.encode(str)
  let hex = ''

  // remove \u0000 padding from either side
  // eslint-disable-next-line no-control-regex
  str = str.replace(/^(?:\u0000)*/, '')
  str = str.split('').reverse().join('')
  // eslint-disable-next-line no-control-regex
  str = str.replace(/^(?:\u0000)*/, '')
  str = str.split('').reverse().join('')

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    const n = code.toString(16)
    hex += n.length < 2 ? '0' + n : n
  }

  return '0x' + hex
}

/**
 * Converts value to it's hex representation
 *
 * @method numberToHex
 * @param {String|Number|BN} value
 * @return {String}
 */
export function numberToHex(value: number | string): string {
  if (!isFinite(Number(value)) && !isHexStrict(value)) {
    throw new Error('Given input "' + String(value) + '" is not a number.')
  }

  const number = toBN(value)
  const result: string = number.toString(16)

  return number.lt(new BN(0)) ? '-0x' + result.slice(1) : '0x' + result
}

/**
 * Converts value to it's decimal representation in string
 * @param value The value to convert
 * @returns The decimal representation of the given value
 */
export function toDecimal(value: string | number): Decimal {
  return new Decimal(value)
}

/**
 * get mmJson hash and chainId hex
 * @param typedData
 * @param chainId
 */
export function mmJsonHashAndChainIdHex(typedData: TypedMessage<MessageTypes>, chainId: number): string {
  const mmHash: string = TypedDataUtils.eip712Hash(typedData, SignTypedDataVersion.V4).toString('hex')
  const chainIdHex: string = new BN(chainId).toString(16, 16)
  return mmHash + chainIdHex
}

/*
 *  Convert signature data from tp-utxo to hex
 *  @param {string} base64SignData base64 encoded signature data
 *  @return {string} hex encoded signature data
 */
export function convertTpUTXOSignature(base64SignData: string): string {
  const buffer = Buffer.from(base64SignData, 'base64')
  if (buffer.length !== 65) throw new Error('Invalid signature length')
  const flagByte = buffer.readUInt8(0) - 27
  if (flagByte > 15 || flagByte < 0) {
    throw new Error('Invalid signature parameter')
  }

  const decodeData = {
    compressed: !!(flagByte & 12),
    segwitType: !(flagByte & 8) ? null : !(flagByte & 4) ? 'p2sh(p2wpkh)' : 'p2wpkh',
    recovery: flagByte & 3,
    signature: buffer.slice(1),
  }
  const signData = Buffer.concat([
    decodeData.signature,
    Buffer.from([decodeData.recovery]),
    Buffer.from([decodeData.compressed ? 1 : 0]),
  ])
  return '0x' + signData.toString('hex')
}

export function isDogecoinChain(coinType: CoinType) {
  return coinType === CoinType.doge
}

/**
 * String reduction
 * @param inputString
 * @param head
 * @param tail
 * @param tokenStr
 */
export function collapseString(inputString = '', head = 4, tail = 4, tokenStr = '...'): string {
  const splitter = new GraphemeSplitter()
  const split = splitter.splitGraphemes(inputString)
  if (split.length > 12) {
    return split.slice(0, head).join('') + tokenStr + split.slice(split.length - tail, split.length).join('')
  }
  return inputString
}

/**
 * open link in different ways depending on the device.
 * @param link
 */
export function smartOpen(link: string) {
  if (isMobileOnly) {
    window.location.href = link
  } else {
    window.open(link)
  }
}

/**
 * Copy data to the clipboard
 * @param text
 * @param el
 */
export async function copyText(text: string, el?: Element): Promise<void> {
  return abcCopy(text, {
    target: el,
  })
}

/**
 * This function checks if the basic WebAuthn API is supported by the current browser.
 * It does so by checking if the 'credentials' property exists on the 'navigator' object
 * and if the 'PublicKeyCredential' property exists on the 'window' object.
 *
 * @returns {boolean} Returns true if the basic WebAuthn API is supported, false otherwise.
 */
export async function checkWebAuthnSupport(): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const urlParams = new globalThis.URLSearchParams(window.location.search)
    const isDebug = urlParams.get('debug') === 'true'
    if (isDebug) {
      return true
    }
  }

  const uaParser = new UAParser(globalThis.navigator?.userAgent)

  if (
    (uaParser.getOS().name === 'iOS' && parseInt(uaParser.getOS().version?.split('.')[0] ?? '0', 10) < 16) ||
    (uaParser.getOS().name === 'Mac OS' &&
      uaParser.getBrowser().name === 'Safari' &&
      parseInt(uaParser.getBrowser().version?.split('.')[0] ?? '0', 10) < 16)
  ) {
    return false
  }

  if (uaParser.getDevice().vendor === 'Huawei' || uaParser.getBrowser().name === 'Huawei Browser') {
    return false
  }

  if ('credentials' in globalThis.navigator && 'PublicKeyCredential' in window) {
    try {
      const isAvailable = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      if (isAvailable) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  } else {
    return false
  }
}

/**
 * Determine if the device supports syncing Passkey with iCloud storage.
 *
 * @returns {boolean} Returns true if the device supports syncing Passkey with iCloud storage, false otherwise.
 */
export async function checkICloudPasskeySupport() {
  const uaParser = new UAParser(globalThis.navigator?.userAgent)
  let platformVersion: number
  try {
    // @ts-expect-error
    const highEntropyValues = await globalThis.navigator?.userAgentData?.getHighEntropyValues(['platformVersion'])
    platformVersion = parseInt(highEntropyValues.platformVersion?.split('.')[0] ?? '0', 10)
  } catch (e) {
    console.error(e)
    platformVersion = 0
  }

  if (
    (uaParser.getOS().name === 'iOS' && parseInt(uaParser.getOS().version?.split('.')[0] ?? '0', 10) >= 16) ||
    (uaParser.getOS().name === 'Mac OS' &&
      uaParser.getBrowser().name === 'Safari' &&
      parseInt(uaParser.getBrowser().version?.split('.')[0] ?? '0', 10) >= 16) ||
    (uaParser.getOS().name === 'Mac OS' &&
      uaParser.getBrowser().name === 'Chrome' &&
      parseInt(uaParser.getBrowser().version?.split('.')[0] ?? '0', 10) >= 118 &&
      platformVersion >= 14)
  ) {
    return true
  }
  return false
}

/**
 * get the shadow root of the wallet-bridge element
 */
export function getShadowDomRoot(): ShadowRoot {
  let _shadowDomRoot
  if (shadowDomRoot) {
    _shadowDomRoot = shadowDomRoot
  } else {
    const el = document.createElement('wallet-bridge')
    document.body.appendChild(el)
    shadowDomRoot = el.attachShadow({ mode: 'open' })
    const styleEl = document.createElement('style')
    styleEl.innerHTML = shadowDomRootStyle
    shadowDomRoot.appendChild(styleEl)
    _shadowDomRoot = shadowDomRoot
  }
  return _shadowDomRoot
}

export function isMetaMask(ethereum?: (typeof window)['ethereum']): boolean {
  // Logic borrowed from wagmi's MetaMaskConnector
  // https://github.com/wagmi-dev/references/blob/main/packages/connectors/src/metaMask.ts
  if (!ethereum?.isMetaMask) return false
  // Brave tries to make itself look like MetaMask
  // Could also try RPC `web3_clientVersion` if following is unreliable
  if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state) return false
  if (ethereum.isApexWallet) return false
  if (ethereum.isAvalanche) return false
  if (ethereum.isBackpack) return false
  if (ethereum.isBifrost) return false
  if (ethereum.isBitKeep) return false
  if (ethereum.isBitski) return false
  if (ethereum.isBlockWallet) return false
  if (ethereum.isCoinbaseWallet) return false
  if (ethereum.isDawn) return false
  if (ethereum.isEnkrypt) return false
  if (ethereum.isExodus) return false
  if (ethereum.isFrame) return false
  if (ethereum.isFrontier) return false
  if (ethereum.isGamestop) return false
  if (ethereum.isHyperPay) return false
  if (ethereum.isImToken) return false
  if (ethereum.isKuCoinWallet) return false
  if (ethereum.isMathWallet) return false
  if (ethereum.isOkxWallet || ethereum.isOKExWallet) return false
  if (ethereum.isOneInchIOSWallet || ethereum.isOneInchAndroidWallet) return false
  if (ethereum.isOpera) return false
  if (ethereum.isPhantom) return false
  if (ethereum.isPortal) return false
  if (ethereum.isRabby) return false
  if (ethereum.isRainbow) return false
  if (ethereum.isStatus) return false
  if (ethereum.isTalisman) return false
  if (ethereum.isTally) return false
  if (ethereum.isTokenPocket) return false
  if (ethereum.isTokenary) return false
  if (ethereum.isTrust || ethereum.isTrustWallet) return false
  if (ethereum.isXDEFI) return false
  if (ethereum.isZerion) return false
  return true
}

export function shouldUseWalletConnect(): boolean {
  const isMetaMaskInjected =
    typeof window !== 'undefined' &&
    typeof window.ethereum !== 'undefined' &&
    (window.ethereum.providers?.some(isMetaMask) || window.ethereum.isMetaMask)
  return !isMetaMaskInjected
}

export function getWalletDeepLink(walletName: string, displayUri: string): string {
  if (walletName === CustomWallet.metaMask) {
    return `metamask://wc?uri=${globalThis.encodeURIComponent(displayUri)}`
  } else if (walletName === CustomWallet.trustWallet) {
    return `trust://wc?uri=${globalThis.encodeURIComponent(displayUri)}`
  } else if (walletName === CustomWallet.imToken) {
    return `imtokenv2://wc?uri=${globalThis.encodeURIComponent(displayUri)}`
  } else if (walletName === CustomWallet.tokenPocket) {
    return `tpoutside://wc?uri=${globalThis.encodeURIComponent(displayUri)}`
  } else if (walletName === CustomWallet.oneKey) {
    return `onekey-wallet://wc?uri=${globalThis.encodeURIComponent(displayUri)}`
  }
  return ''
}

export function openDeepLink(deepLink: string) {
  if (!deepLink) {
    return
  }

  if (deepLink.startsWith('http')) {
    const link = document.createElement('a')
    link.href = deepLink
    link.target = '_blank'
    link.rel = 'noreferrer noopener'
    link.click()
    // window.open(deepLink, '_blank', 'noreferrer noopener')
  } else {
    // window.open(deepLink, '_self', 'noreferrer noopener')
    window.location.href = deepLink
  }
}

/**
 * load script
 * @param src
 * @param id
 */
export async function loadScript(src: string, id: string): Promise<any> {
  const script = 'script'
  const firstScript: HTMLScriptElement = document.getElementsByTagName(script)[0]
  if (document.getElementById(id)) {
    await Promise.resolve()
    return
  }
  const scriptElement: HTMLScriptElement = document.createElement(script)
  scriptElement.id = id
  scriptElement.src = src
  firstScript.parentNode?.insertBefore(scriptElement, firstScript)

  return await new Promise((resolve, reject) => {
    scriptElement.onload = resolve
    scriptElement.onerror = reject
  })
}

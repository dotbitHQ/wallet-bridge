export * from './chain'
export * from './errno'

export const CYCLE_CALL_FUNCTION_TIME = 5000

// number of decimal places to keep for token amount
export const TOKEN_DECIMAL_PLACES = 8

// CKB token decimal places.
export const CKB_TOKEN_DECIMAL_PLACES = 2

export enum WalletProtocol {
  metaMask = 'metaMask',
  tronLink = 'tronLink',
  torus = 'torus',
  tokenPocketUTXO = 'tokenPocketUTXO',
  // walletConnect = "walletConnect",
  webAuthn = 'webAuthn',
}

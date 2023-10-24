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
  walletConnect = 'walletConnect',
  webAuthn = 'webAuthn',
}

export const CfAccessClient = {
  // 'Cf-Access-Client-Id': '4e00f1238fe24ac0c3d7870b10294716.access',
  // 'Cf-Access-Client-Secret': 'be225bb474d1f50e9c77ec10d1634b1d15270f5206b8b999e16be1ecb69c464d',
}

export const WebAuthnApi = 'https://webauthn-api.d.id'

export const WebAuthnTestApi = 'https://test-webauthn-api.d.id'

export const DotbitAliasApi = 'https://reverse-api.d.id'

export const DotbitAliasTestApi = 'https://test-reverse-api.d.id'

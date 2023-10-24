import { proxy, useSnapshot } from 'valtio'
import { CoinType } from '../constant'
import { SignDataParams } from '../wallets/WalletSignerHandler'

interface LoginCacheState {
  coinType?: CoinType
  walletConnectDisplayUri?: string
  walletName?: string
  signDataParams?: SignDataParams | null
}

export const loginCacheState = proxy<LoginCacheState>({
  coinType: undefined,
  walletConnectDisplayUri: '',
  walletName: undefined,
  signDataParams: null,
})

export const setLoginCacheState = ({
  coinType,
  walletName,
  walletConnectDisplayUri,
  signDataParams,
}: LoginCacheState) => {
  if (coinType !== undefined) {
    loginCacheState.coinType = coinType
  }
  if (walletName !== undefined) {
    loginCacheState.walletName = walletName
  }
  if (walletConnectDisplayUri !== undefined) {
    loginCacheState.walletConnectDisplayUri = walletConnectDisplayUri
  }
  if (signDataParams !== undefined) {
    loginCacheState.signDataParams = signDataParams
  }
}

export function useLoginCacheState() {
  const loginCacheSnap = useSnapshot(loginCacheState)
  return { loginCacheSnap }
}

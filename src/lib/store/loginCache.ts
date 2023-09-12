import { proxy, useSnapshot } from 'valtio'
import { CoinType } from '../constant'

interface LoginCacheState {
  coinType?: CoinType
  walletConnectDisplayUri?: string
  walletName?: string
}

export const loginCacheState = proxy<LoginCacheState>({
  coinType: undefined,
  walletConnectDisplayUri: '',
  walletName: undefined,
})

export const setLoginCacheState = ({ coinType, walletName, walletConnectDisplayUri }: LoginCacheState) => {
  if (coinType !== undefined) {
    loginCacheState.coinType = coinType
  }
  if (walletName !== undefined) {
    loginCacheState.walletName = walletName
  }
  if (walletConnectDisplayUri !== undefined) {
    loginCacheState.walletConnectDisplayUri = walletConnectDisplayUri
  }
}

export function useLoginCacheState() {
  const loginCacheSnap = useSnapshot(loginCacheState)
  return { loginCacheSnap }
}

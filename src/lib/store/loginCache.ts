import { proxy, useSnapshot } from 'valtio'
import { CoinType, WalletProtocol } from '../constant'

interface LoginCacheState {
  protocol?: WalletProtocol
  coinType?: CoinType
}

export const loginCacheState = proxy<LoginCacheState>({
  protocol: undefined,
  coinType: undefined,
})

export const setLoginCacheState = ({ protocol, coinType }: LoginCacheState) => {
  if (protocol) {
    loginCacheState.protocol = protocol
  }
  if (coinType) {
    loginCacheState.coinType = coinType
  }
}

export function useLoginCacheState() {
  const loginCacheSnap = useSnapshot(loginCacheState)
  return { loginCacheSnap }
}

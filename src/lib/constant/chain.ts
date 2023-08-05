export enum ChainType {
  ckb,
  eth,
  btc,
  tron,
  fiat,
  doge = 7,
  bsc = 56,
  polygon = 137,
}

// EVM-based Chains https://github.com/ethereum-lists/chains
export enum ChainId {
  eth = 1,
  ethGoerli = 5,
  bsc = 56,
  bscTestnet = 97,
  polygon = 137,
  polygonMumbai = 80001,
  tron = 728126428,
  tronNile = 3448148188,
}

// SLIP-0044 : Registered coin types for BIP-0044 https://github.com/satoshilabs/slips/blob/master/slip-0044.md
export enum CoinType {
  btc = '0',
  doge = '3',
  eth = '60',
  trx = '195',
  ckb = '309',
  bsc = '9006',
  matic = '966',
}

export const EvmCoinTypes = [CoinType.eth, CoinType.bsc, CoinType.matic]

export const UtxoCoinTypes = [CoinType.doge]

export const CoinTypeToChainIdMap: Record<string, number> = {
  [CoinType.eth]: ChainId.eth,
  [CoinType.bsc]: ChainId.bsc,
  [CoinType.matic]: ChainId.polygon,
  [CoinType.trx]: ChainId.tron,
}

export const CoinTypeToTestNetChainIdMap: Record<string, number> = {
  [CoinType.eth]: ChainId.ethGoerli,
  [CoinType.bsc]: ChainId.bscTestnet,
  [CoinType.matic]: ChainId.polygonMumbai,
  [CoinType.trx]: ChainId.tronNile,
}

export const CoinTypeToTorusHostMap: Record<string, string> = {
  [CoinType.eth]: 'mainnet',
  [CoinType.bsc]: 'bsc_mainnet',
  [CoinType.matic]: 'matic',
}

export const CoinTypeToTorusHostTestNetMap: Record<string, string> = {
  [CoinType.eth]: 'goerli',
  [CoinType.bsc]: 'bsc_testnet',
  [CoinType.matic]: 'mumbai',
}

export const CoinTypeToGenesisHash: Record<string, string> = {
  [CoinType.doge]: '1a91e3dace36e2be3bf030a65679fe821aa1d6ef92e7c9902eb318182c355691',
}

export const ChainIdToCoinTypeMap: Record<string, CoinType> = {
  1: CoinType.eth,
  56: CoinType.bsc,
  137: CoinType.matic,
  728126428: CoinType.trx,
}

export const ChainIdToCoinTypeTestNetMap: Record<string, CoinType> = {
  5: CoinType.eth,
  97: CoinType.bsc,
  80001: CoinType.matic,
  3448148188: CoinType.trx,
}

export enum LOCK_SCRIPT_TYPE {
  ckb,
  none,
  eth = 3,
  tron,
  eip712,
  btc,
  doge,
}

export enum SIGN_TYPE {
  noSign,
  ckbMulti,
  ckbSingle,
  eth,
  tron,
  eth712,
  ed25519,
  doge,
  webauthn,
}

export interface IMainChain {
  name: string
  symbol: string
  coinType: CoinType
  decimals: number
  icon: string
  tokenId: string
  explorerTrx: string
  testExplorerTrx: string
}

export const CKB: IMainChain = {
  name: 'Nervos Network',
  symbol: 'CKB',
  coinType: CoinType.ckb,
  decimals: 8,
  icon: 'nervos-network',
  tokenId: 'ckb_ckb',
  explorerTrx: 'https://explorer.nervos.org/transaction/',
  testExplorerTrx: 'https://explorer.nervos.org/aggron/transaction/',
}

export const ETH: IMainChain = {
  name: 'Ethereum',
  symbol: 'ETH',
  coinType: CoinType.eth,
  decimals: 18,
  icon: 'ethereum',
  tokenId: 'eth_eth',
  explorerTrx: 'https://etherscan.io/tx/',
  testExplorerTrx: 'https://goerli.etherscan.io/tx/',
}

export const TRON: IMainChain = {
  name: 'TRON',
  symbol: 'TRX',
  coinType: CoinType.trx,
  decimals: 6,
  icon: 'tron',
  tokenId: 'tron_trx',
  explorerTrx: 'https://tronscan.org/#/transaction/',
  testExplorerTrx: 'https://nile.tronscan.org/#/transaction/',
}

export const BSC: IMainChain = {
  name: 'BNB Smart Chain',
  symbol: 'BNB',
  coinType: CoinType.bsc,
  decimals: 18,
  icon: 'binance-smart-chain',
  tokenId: 'bsc_bnb',
  explorerTrx: 'https://bscscan.com/tx/',
  testExplorerTrx: 'https://testnet.bscscan.com/tx/',
}

export const Polygon: IMainChain = {
  name: 'Polygon',
  symbol: 'MATIC',
  coinType: CoinType.matic,
  decimals: 18,
  icon: 'polygon',
  tokenId: 'polygon_matic',
  explorerTrx: 'https://polygonscan.com/tx/',
  testExplorerTrx: 'https://mumbai.polygonscan.com/tx/',
}

export const BTC: IMainChain = {
  name: 'Bitcoin',
  symbol: 'BTC',
  coinType: CoinType.btc,
  decimals: 8,
  icon: 'bitcoin',
  tokenId: 'btc_btc',
  explorerTrx: 'https://explorer.btc.com/btc/address/',
  testExplorerTrx: '',
}
export const DOGE: IMainChain = {
  name: 'Dogecoin',
  symbol: 'DOGE',
  coinType: CoinType.doge,
  decimals: 8,
  icon: 'dogecoin',
  tokenId: 'doge_doge',
  explorerTrx: 'https://dogechain.info/tx/',
  testExplorerTrx: 'https://dogechain.info/tx/',
}

export const CoinTypeToChainMap: Record<string, IMainChain> = {
  [CoinType.eth]: ETH,
  [CoinType.bsc]: BSC,
  [CoinType.matic]: Polygon,
  [CoinType.trx]: TRON,
  [CoinType.doge]: DOGE,
}

export interface ICoinTypeInfo {
  text: string
  value: string
  coinType: string
}

export const ChainIdToChainInfoMap: Record<string, any> = {
  [ChainId.eth]: {
    networkName: 'Ethereum Mainnet',
    symbol: 'ETH',
    decimals: 18,
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorerUrl: 'https://etherscan.io',
  },
  [ChainId.ethGoerli]: {
    networkName: 'Ethereum Goerli Testnet',
    symbol: 'ETH',
    decimals: 18,
    rpcUrl: 'https://goerli.infura.io/v3/',
    blockExplorerUrl: 'https://goerli.etherscan.io',
  },
  [ChainId.bsc]: {
    networkName: 'Binance Smart Chain Mainnet',
    symbol: 'BNB',
    decimals: 18,
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    blockExplorerUrl: 'https://bscscan.com',
  },
  [ChainId.bscTestnet]: {
    networkName: 'Binance Smart Chain Testnet',
    symbol: 'BNB',
    decimals: 18,
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    blockExplorerUrl: 'https://testnet.bscscan.com',
  },
  [ChainId.polygon]: {
    networkName: 'Polygon Mainnet',
    symbol: 'MATIC',
    decimals: 18,
    rpcUrl: 'https://polygon-rpc.com/',
    blockExplorerUrl: 'https://polygonscan.com',
  },
  [ChainId.polygonMumbai]: {
    networkName: 'Polygon Testnet Mumbai',
    symbol: 'MATIC',
    decimals: 18,
    rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
  },
}

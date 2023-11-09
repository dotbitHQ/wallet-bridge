import { t } from '@lingui/macro'
import { ActionErrorCode } from 'connect-did-sdk'

const errno = {
  success: 0,
  networkError: -1,
  failedToInitializeWallet: -2,
  // MetaMask
  metaMaskUserDeniedMessageSignature: 4001,
  metaMaskWalletRequestPermissions: -32002,
  metaMaskUserRejectedAccountAccess: -32603,
  metaMaskReplacementTransactionUnderpriced: t`replacement transaction underpriced`,
  metaMaskTransactionHasBeenAborted: t`the transaction has been aborted`,
  // WalletConnect
  walletConnectUserRejectedTheTransaction: t`User rejected the transaction`,
  walletConnectInsufficientFundsForTransfer: t`insufficient funds for transfer`,
  // TronLink
  tronLinkConfirmationDeclinedByUser: t`Confirmation declined by user`,
  tronLinkInsufficientBalance:
    t`class org.tron.core.exception.ContractValidateException : Validate TransferContract error, no OwnerAccount.`,
  tronLinkTypeErrorAddUpdateDataNotFunction: t`transactionBuilder.addUpdateData`,
  tronLinkAuthorizationRequestsAreBeingProcessed: 4000,
  // imToken
  imTokenUserCanceled: t`user_canceled`,
  // coinbase wallet
  coinbaseWalletUsingMultipleWallet: t`Request method eth_chainId is not supported`,
  // Portal Wallet
  portalWalletInsufficientBalance: t`input capacity not enough`,
  portalWalletValidationFailure: t`ValidationFailure(-31)`,
  // torus
  torusUserCancelledLogin: t`User cancelled login`,
  torusUserClosedPopup: t`user closed popup`,
  // connect did sdk
  connectDidSdkAbort: ActionErrorCode.ABORT,
  connectDidSdkNotFound: ActionErrorCode.NOT_FOUND,
  connectDidSdkNotExist: ActionErrorCode.NOT_EXIST,
  connectDidSdkError: ActionErrorCode.ERROR,
  connectDidSdkSuccess: ActionErrorCode.SUCCESS,
}

export enum TronLinkRequestAccountsResponseCode {
  ok = 200,
  inQueue = 4000,
  userRejected = 4001,
}

export default errno

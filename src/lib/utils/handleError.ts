import { t } from '@lingui/macro'
import errno from '../constant/errno'
import CustomError from './CustomError'

function isUserReject(err: any) {
  const metaMaskReject =
    [errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) &&
    !(
      err.message.includes(errno.metaMaskReplacementTransactionUnderpriced) ||
      err.message.includes(errno.metaMaskTransactionHasBeenAborted)
    )
  const tronReject = err === errno.tronLinkConfirmationDeclinedByUser
  const torusReject = [errno.torusUserCancelledLogin, errno.torusUserClosedPopup].includes(err.message)
  const walletConnectReject = err.message === errno.walletConnectUserRejectedTheTransaction
  const connectDidSdkReject = err.code === errno.connectDidSdkAbort
  return metaMaskReject || tronReject || walletConnectReject || torusReject || connectDidSdkReject
}

interface HandleErrorRes {
  isHandle: boolean
  title: string
  message: string
}

export default function handleError(error: CustomError): HandleErrorRes {
  console.error(error)
  let res: HandleErrorRes = {
    isHandle: false,
    title: '',
    message: '',
  }

  // wallet
  if (isUserReject(error)) {
    res = {
      isHandle: true,
      title: '',
      message: '',
    }
  } else if (
    [errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(error.code) &&
    error.message.includes(errno.metaMaskReplacementTransactionUnderpriced)
  ) {
    res = {
      isHandle: true,
      title: t`Tips`,
      message: t`Replacement transaction underpriced`,
    }
  } else if (
    [errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(error.code) &&
    error.message.includes(errno.metaMaskTransactionHasBeenAborted)
  ) {
    res = {
      isHandle: true,
      title: t`Tips`,
      message: t`The transaction has been aborted.`,
    }
  } else if (
    error.code === errno.metaMaskWalletRequestPermissions ||
    error.code === errno.tronLinkAuthorizationRequestsAreBeingProcessed
  ) {
    res = {
      isHandle: true,
      title: t`Tips`,
      message: t`Other requests for the wallet are not processed, please try again after processing`,
    }
  } else if (error.message === errno.coinbaseWalletUsingMultipleWallet) {
    res = {
      isHandle: true,
      title: t`Tips`,
      message: t`Please check if you are using multiple wallet plugins. Please disable multiple wallet plugins, keep only one wallet plugin and try again.`,
    }
  } else if (
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    error.toString() === errno.tronLinkInsufficientBalance ||
    error.message?.includes(errno.walletConnectInsufficientFundsForTransfer)
  ) {
    res = {
      isHandle: true,
      title: t`Tips`,
      message: t`Insufficient balance`,
    }
  } else if (error.message?.includes(errno.tronLinkTypeErrorAddUpdateDataNotFunction)) {
    res = {
      isHandle: true,
      title: t`Tips`,
      message: t`The current wallet environment does not support payments using TRX, please upgrade your wallet version or register with another wallet.`,
    }
  }

  return res
}

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
  return metaMaskReject || tronReject || walletConnectReject || torusReject
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
      title: `Tips`,
      message: `Replacement transaction underpriced`,
    }
  } else if (
    [errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(error.code) &&
    error.message.includes(errno.metaMaskTransactionHasBeenAborted)
  ) {
    res = {
      isHandle: true,
      title: `Tips`,
      message: `The transaction has been aborted.`,
    }
  } else if (
    error.code === errno.metaMaskWalletRequestPermissions ||
    error.code === errno.tronLinkAuthorizationRequestsAreBeingProcessed
  ) {
    res = {
      isHandle: true,
      title: `Tips`,
      message: `Other requests for the wallet are not processed, please try again after processing`,
    }
  } else if (error.message === errno.coinbaseWalletUsingMultipleWallet) {
    res = {
      isHandle: true,
      title: `Tips`,
      message: `Please check if you are using multiple wallet plugins. Please disable multiple wallet plugins, keep only one wallet plugin and try again.`,
    }
  } else if (
    error.toString() === errno.tronLinkInsufficientBalance ||
    (error.message && error.message.includes(errno.walletConnectInsufficientFundsForTransfer))
  ) {
    res = {
      isHandle: true,
      title: `Tips`,
      message: `Insufficient balance`,
    }
  } else if (error.message && error.message.includes(errno.tronLinkTypeErrorAddUpdateDataNotFunction)) {
    res = {
      isHandle: true,
      title: `Tips`,
      message: `The current wallet environment does not support payments using TRX, please upgrade your wallet version or register with another wallet.`,
    }
  }

  return res
}

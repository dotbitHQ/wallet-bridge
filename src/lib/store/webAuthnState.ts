import { proxy, ref, useSnapshot } from 'valtio'

export interface BackupDeviceData {
  ckbAddr: string
  name: string
}

interface WebAuthnState {
  backupDeviceData?: BackupDeviceData
  selectedEmoji?: string
  pendingTxHash?: string
  qrCodeData: string
  mediaStream: { inner?: MediaStream }
  signData?: any
}

export const webAuthnState = proxy<WebAuthnState>({
  backupDeviceData: undefined,
  selectedEmoji: undefined,
  pendingTxHash: undefined,
  qrCodeData: '',
  mediaStream: ref({ inner: undefined }),
})

export const setBackupDeviceData = (data?: BackupDeviceData) => {
  webAuthnState.backupDeviceData = data
}

export const setQrCodeData = (data: string) => {
  webAuthnState.qrCodeData = data
}

export const setPendingTx = (tx?: string) => {
  webAuthnState.pendingTxHash = tx
}

export const setSelectedEmoji = (emoji?: string) => {
  webAuthnState.selectedEmoji = emoji
}

export const setMediaStream = (mediaStream?: MediaStream) => {
  webAuthnState.mediaStream.inner = mediaStream
}

export const setSignData = (signData?: any) => {
  webAuthnState.signData = signData
}

export function useWebAuthnState() {
  return useSnapshot(webAuthnState)
}

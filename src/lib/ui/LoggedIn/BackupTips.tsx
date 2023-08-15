import clsx from 'clsx'
import { Button, ButtonShape, ButtonSize } from '../../components'
import BackupTipsIcon from './icon/backup-tips-icon.svg'
import IcloudBackupTipsIcon from './icon/icloud-backup-tips-icon.svg'
import { useEffect, useState } from 'react'
import { checkPasskeysSupport } from '../../utils'

interface BackupTipsProps {
  onShowQRCode: () => void
  className?: string
}

export const BackupTips = ({ onShowQRCode, className }: BackupTipsProps) => {
  const [passkeysSupported, setPasskeysSupported] = useState(false)

  useEffect(() => {
    setPasskeysSupported(checkPasskeysSupport())
  }, [])

  return passkeysSupported ? (
    <div
      className={clsx('flex flex-col items-center rounded-2xl border border-[#1EA2EC5C] bg-[#7AAEEC29] p-6', className)}
    >
      <img className="w-[90px]" src={IcloudBackupTipsIcon} />
      <h3 className="mb-2 mt-4 font-bold leading-[normal] text-black">Passkey secured with iCloud</h3>
      <div className="text-center text-sm leading-[normal] text-black">
        For Mac Safari users, your passkey created is safely stored in your iCloud, and can be accessed with other Macs
        using Safari, or iPhone using Safari and Chrome. If you want to access with other devices, please add your
        trusted device{' '}
        <span className="cursor-pointer underline decoration-1" onClick={onShowQRCode}>
          here
        </span>
        .
      </div>
    </div>
  ) : (
    <div
      className={clsx('flex flex-col items-center rounded-2xl border border-[#F9CD4E5C] bg-[#F9CD4E29] p-6', className)}
    >
      <img className="w-[90px]" src={BackupTipsIcon} />
      <h3 className="mb-2 mt-4 font-bold leading-[normal] text-[#AC6E15]">Device Loss Can Lead to Asset Loss</h3>
      <div className="mb-4 text-center text-sm leading-[normal] text-[#AC6E15]">
        Secure your assets by adding extra trusted devices like mobile phones, computers or tablets immediately.
      </div>
      <Button size={ButtonSize.middle} shape={ButtonShape.round} onClick={onShowQRCode}>
        Add Trusted Device
      </Button>
    </div>
  )
}

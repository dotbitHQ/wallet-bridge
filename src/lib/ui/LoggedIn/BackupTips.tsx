import clsx from 'clsx'
import { Button, ButtonShape, ButtonSize } from '../../components'
import BackupTipsIcon from './icon/backup-tips-icon.svg'
import IcloudBackupTipsIcon from './icon/icloud-backup-tips-icon.svg'
import { useEffect, useState } from 'react'
import { checkICloudPasskeySupport } from '../../utils'
import { t } from '@lingui/macro'

interface BackupTipsProps {
  onShowQRCode: () => void
  className?: string
}

export const BackupTips = ({ onShowQRCode, className }: BackupTipsProps) => {
  const [passkeysSupported, setPasskeysSupported] = useState(false)

  useEffect(() => {
    void checkICloudPasskeySupport().then((res) => {
      setPasskeysSupported(res)
    })
  }, [])

  return passkeysSupported ? (
    <div
      className={clsx('flex flex-col items-center rounded-2xl border border-[#1EA2EC5C] bg-[#7AAEEC29] p-6', className)}
    >
      <img className="w-[90px]" src={IcloudBackupTipsIcon} />
      <h3 className="mb-2 mt-4 font-bold leading-[normal] text-black">{t`Asset secured with iCloud`}</h3>
      <div className="text-center text-sm leading-[normal] text-black">
        {t`Need access to this address with Windows or Android devices,`}{' '}
        <span className="cursor-pointer underline decoration-1" onClick={onShowQRCode}>
          {t`click here`}
        </span>
        .
      </div>
    </div>
  ) : (
    <div
      className={clsx('flex flex-col items-center rounded-2xl border border-[#F9CD4E5C] bg-[#F9CD4E29] p-6', className)}
    >
      <img className="w-[90px]" src={BackupTipsIcon} />
      <h3 className="mb-2 mt-4 font-bold leading-[normal] text-[#AC6E15]">{t`Device Loss Can Lead to Asset Loss`}</h3>
      <div className="mb-4 text-center text-sm leading-[normal] text-[#AC6E15]">
        {t`Secure your assets by adding extra trusted devices like mobile phones, computers or tablets immediately.`}
      </div>
      <Button size={ButtonSize.middle} shape={ButtonShape.round} onClick={onShowQRCode}>
        {t`Add Trusted Device`}
      </Button>
    </div>
  )
}

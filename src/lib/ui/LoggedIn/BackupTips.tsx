import clsx from 'clsx'
import { Button, ButtonShape, ButtonSize } from '../../components'
import BackupTipsIcon from './icon/backup-tips-icon.svg'

interface BackupTipsProps {
  onShowQRCode: () => void
  className?: string
}

export const BackupTips = ({ onShowQRCode, className }: BackupTipsProps) => {
  return (
    <div
      className={clsx('flex flex-col items-center rounded-2xl border border-[#F9CD4E5C] bg-[#F9CD4E29] p-6', className)}
    >
      <img className="w-[90px]" src={BackupTipsIcon} />
      <h3 className="mb-1.5 mt-4 font-bold leading-[normal] text-[#AC6E15]">Device Loss Can Lead to Asset Loss</h3>
      <div className="mb-4 text-center leading-[normal] text-[#AC6E15]">
        Secure your assets by adding extra trusted devices like mobile phones, computers or tablets immediately.
      </div>
      <Button size={ButtonSize.middle} shape={ButtonShape.round} onClick={onShowQRCode}>
        Add Trusted Device
      </Button>
    </div>
  )
}

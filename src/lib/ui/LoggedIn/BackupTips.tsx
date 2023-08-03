import clsx from 'clsx'
import { Button, ButtonShape, ButtonSize } from '../../components'
import BackupTipsIcon from './icon/backup-tips-icon.svg'

interface BackupTipsProps {
  addDevice: () => void
  className?: string
}

export const BackupTips = ({ addDevice, className }: BackupTipsProps) => {
  const add = () => {
    addDevice?.()
  }

  return (
    <div
      className={clsx('flex flex-col items-center rounded-2xl border border-[#F9CD4E5C] bg-[#F9CD4E29] p-6', className)}
    >
      <img className="w-[90px]" src={BackupTipsIcon} />
      <h3 className="mb-2 mt-5 font-bold text-[#AC6E15]">Device Loss Can Lead to Asset Loss</h3>
      <div className="mb-5 text-center text-[#AC6E15]">
        Secure your assets by adding extra trusted devices like mobile phones, computers or tablets immediately.
      </div>
      <Button size={ButtonSize.middle} shape={ButtonShape.round} onClick={add}>
        Add Trusted Device
      </Button>
    </div>
  )
}

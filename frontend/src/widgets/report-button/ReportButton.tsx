import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { AlertTriangle } from 'lucide-react'
import { ReportDialog } from '@/widgets/report-dialog'
import { useAuthStore } from '@/shared/store/auth.store'
import { useRoleStore } from '@/shared/store/role.store'
import { getReportType } from '@/shared/lib/report-utils'
import type { ReportType, ReportFormData } from '@/shared/types/report.types'
import toast from 'react-hot-toast'

interface ReportButtonProps {
  reportedEntity: {
    id: string
    name: string
    type: 'user' | 'property' | 'service'
    role?: string
  }
  reportType?: ReportType // If not provided, will be determined from entity
  relatedTo?: {
    type: 'property' | 'booking' | 'service_booking' | 'payment'
    id: string
    title?: string
  }
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  onReportSubmit?: (data: ReportFormData) => void
}

export function ReportButton({
  reportedEntity,
  reportType,
  relatedTo,
  variant = 'outline',
  size = 'default',
  className,
  onReportSubmit,
}: ReportButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { activeRole } = useRoleStore()

  // Admin cannot report
  if (activeRole === 'admin') {
    return null
  }

  const finalReportType = reportType || getReportType(reportedEntity.type, reportedEntity.role)

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to report')
      return
    }
    setIsDialogOpen(true)
  }

  const handleReportSubmit = async (data: ReportFormData) => {
    if (onReportSubmit) {
      await onReportSubmit(data)
    } else {
      // Default: create dispute
      toast.success('Report submitted successfully. Our admin team will review it shortly.')
    }
    setIsDialogOpen(false)
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        Report
      </Button>
      <ReportDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        reportType={finalReportType}
        reportedEntity={reportedEntity}
        relatedTo={relatedTo}
        onReportSubmit={handleReportSubmit}
      />
    </>
  )
}


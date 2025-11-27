import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Input } from '@/shared/ui/input'
import { AlertTriangle, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ReportType, ReportReason, ReportFormData } from '@/shared/types/report.types'

interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportType: ReportType
  reportedEntity: {
    id: string
    name: string
    type: 'user' | 'property' | 'service'
    role?: string
  }
  relatedTo?: {
    type: 'property' | 'booking' | 'service_booking' | 'payment'
    id: string
    title?: string
  }
  onReportSubmit?: (data: ReportFormData) => void
}

const reportReasons: Record<ReportType, ReportReason[]> = {
  property: ['fraud', 'misrepresentation', 'safety', 'quality', 'contract', 'other'],
  service_provider: ['fraud', 'misrepresentation', 'quality', 'payment', 'harassment', 'other'],
  tenant: ['fraud', 'harassment', 'contract', 'payment', 'other'],
  landlord: ['fraud', 'harassment', 'contract', 'payment', 'safety', 'other'],
  homerunner: ['fraud', 'misrepresentation', 'quality', 'harassment', 'other'],
  customer: ['fraud', 'harassment', 'payment', 'other'],
  handyman: ['fraud', 'quality', 'harassment', 'other'],
  artisan: ['fraud', 'quality', 'harassment', 'other'],
  payment: ['fraud', 'payment', 'other'],
  behavior: ['harassment', 'safety', 'other'],
}

const reasonLabels: Record<ReportReason, string> = {
  fraud: 'Fraudulent Activity',
  misrepresentation: 'False Information',
  harassment: 'Harassment or Abuse',
  safety: 'Safety Concerns',
  quality: 'Quality Issues',
  payment: 'Payment Problems',
  contract: 'Contract Violations',
  other: 'Other Issues',
}

export function ReportDialog({
  open,
  onOpenChange,
  reportType,
  reportedEntity,
  relatedTo,
  onReportSubmit,
}: ReportDialogProps) {
  const [reason, setReason] = useState<ReportReason | ''>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [documents, setDocuments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableReasons = reportReasons[reportType] || []

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + documents.length > 5) {
      toast.error('Maximum 5 documents allowed')
      return
    }
    setDocuments([...documents, ...files])
  }

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!reason) {
      toast.error('Please select a reason for reporting')
      return
    }
    if (!title.trim()) {
      toast.error('Please provide a title')
      return
    }
    if (!description.trim() || description.trim().length < 20) {
      toast.error('Please provide a detailed description (at least 20 characters)')
      return
    }

    setIsSubmitting(true)

    try {
      const reportData: ReportFormData = {
        type: reportType,
        reason: reason as ReportReason,
        title: title.trim(),
        description: description.trim(),
        relatedTo,
        documents: documents.length > 0 ? documents : undefined,
      }

      // Call the submit handler if provided
      if (onReportSubmit) {
        await onReportSubmit(reportData)
      } else {
        // Default behavior: create dispute
        // This would typically call an API endpoint
        toast.success('Report submitted successfully. Our team will review it shortly.')
      }

      // Reset form
      setReason('')
      setTitle('')
      setDescription('')
      setDocuments([])
      onOpenChange(false)
    } catch (error) {
      toast.error(`Failed to submit report. Please try again. ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getReportTypeLabel = () => {
    const labels: Record<ReportType, string> = {
      property: 'Property/Landlord',
      service_provider: 'Service Provider',
      tenant: 'Tenant',
      landlord: 'Landlord',
      homerunner: 'Home Runner',
      customer: 'Customer',
      handyman: 'Handyman',
      artisan: 'Artisan',
      payment: 'Payment Issue',
      behavior: 'Behavioral Issue',
    }
    return labels[reportType] || reportType
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Report {getReportTypeLabel()}
          </DialogTitle>
          <DialogDescription>
            Report {reportedEntity.name} for review by our admin team. All reports are confidential and will be investigated.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Reported Entity Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Reporting:</p>
            <p className="font-medium">{reportedEntity.name}</p>
            {reportedEntity.role && (
              <p className="text-sm text-muted-foreground">Role: {reportedEntity.role}</p>
            )}
            {relatedTo && (
              <p className="text-sm text-muted-foreground mt-2">
                Related to: {relatedTo.title || relatedTo.type}
              </p>
            )}
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Report *</Label>
            <Select value={reason} onValueChange={(value) => setReason(value as ReportReason)}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {availableReasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {reasonLabels[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Brief summary of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              placeholder="Please provide as much detail as possible about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/2000 characters (minimum 20 characters)
            </p>
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <Label>Supporting Documents (Optional)</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Upload screenshots, photos, or documents to support your report (max 5 files, 10MB each)
            </p>
            <div className="flex flex-col gap-2">
              {documents.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => removeDocument(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {documents.length < 5 && (
                <label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={e => {
                      const input = (e.currentTarget.parentNode as HTMLElement).querySelector('input[type="file"]') as HTMLInputElement | null;
                      input?.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </label>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              <strong>Important:</strong> False reports may result in account suspension. Please ensure all information provided is accurate.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason || !title.trim() || description.trim().length < 20}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


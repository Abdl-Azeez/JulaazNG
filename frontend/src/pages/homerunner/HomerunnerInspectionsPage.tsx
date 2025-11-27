import { useEffect, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { ReportButton } from '@/widgets/report-button'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Label } from '@/shared/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Textarea } from '@/shared/ui/textarea'
import {
  ClipboardCheck,
  MapPin,
  Phone,
  Calendar,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Camera,
  FileText,
  User,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { sampleInspections, type PropertyInspection } from './data/sample-homerunner-data'
import toast from 'react-hot-toast'

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'completed'

export function HomerunnerInspectionsPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [inspections, setInspections] = useState(() =>
    sampleInspections.map((inspection) => ({ ...inspection }))
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInspection, setSelectedInspection] = useState<PropertyInspection | null>(
    null
  )
  const [inspectionStep, setInspectionStep] = useState(0)
  const [inspectionNotes, setInspectionNotes] = useState('')
  const ITEMS_PER_PAGE = 3

  const inspectionSteps = [
    {
      id: 'check-in',
      title: 'Check in with landlord',
      description: 'Confirm access instructions and highlight any last-minute updates.',
    },
    {
      id: 'capture',
      title: 'Capture evidence',
      description: 'Document spaces with clear photos and annotate damage if needed.',
    },
    {
      id: 'report',
      title: 'Submit report',
      description: 'Summarize findings and flag anything that may delay listing approval.',
    },
  ]

  const filteredInspections = inspections.filter((inspection) => {
    if (filterStatus === 'all') return true
    return inspection.status === filterStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredInspections.length / ITEMS_PER_PAGE))
  const paginatedInspections = filteredInspections.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages))
  }, [totalPages])

  const handleFilterChange = (status: FilterStatus) => {
    setFilterStatus(status)
    setCurrentPage(1)
  }

  const handleAcceptInspection = (inspectionId: string) => {
    setInspections((prev) =>
      prev.map((inspection) =>
        inspection.id === inspectionId
          ? { ...inspection, status: 'confirmed' }
          : inspection
      )
    )
    toast.success('Inspection accepted. We just confirmed with the landlord!')
  }

  const openInspectionFlow = (inspection: PropertyInspection) => {
    const nextInspection =
      inspection.status === 'completed'
        ? inspection
        : { ...inspection, status: 'in_progress' }
    setSelectedInspection(nextInspection)
    setInspectionStep(0)
    setInspectionNotes(inspection.notes || '')
    setInspections((prev) =>
      prev.map((item) =>
        item.id === inspection.id && item.status !== 'completed'
          ? { ...item, status: 'in_progress' }
          : item
      )
    )
  }

  const closeInspectionFlow = () => {
    setSelectedInspection(null)
    setInspectionNotes('')
    setInspectionStep(0)
  }

  const handleInspectionAdvance = () => {
    if (inspectionStep < inspectionSteps.length - 1) {
      setInspectionStep((prev) => prev + 1)
      return
    }
    if (!selectedInspection) return
    setInspections((prev) =>
      prev.map((item) =>
        item.id === selectedInspection.id
          ? { ...item, status: 'completed', notes: inspectionNotes }
          : item
      )
    )
    toast.success('Inspection report submitted! Earnings will be processed shortly.')
    closeInspectionFlow()
  }

  const handleInspectionBack = () => {
    if (inspectionStep === 0) {
      closeInspectionFlow()
      return
    }
    setInspectionStep((prev) => Math.max(0, prev - 1))
  }

  const statusCounts = {
    all: inspections.length,
    pending: inspections.filter((i) => i.status === 'pending').length,
    confirmed: inspections.filter((i) => i.status === 'confirmed').length,
    completed: inspections.filter((i) => i.status === 'completed').length,
  }

  const getStatusBadge = (status: PropertyInspection['status']) => {
    const styles = {
      pending: 'bg-amber-500/10 text-amber-600',
      confirmed: 'bg-emerald-500/10 text-emerald-600',
      in_progress: 'bg-blue-500/10 text-blue-600',
      completed: 'bg-primary/10 text-primary',
      cancelled: 'bg-red-500/10 text-red-600',
    }
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }
    return (
      <Badge className={cn('rounded-full px-3 py-1 text-xs font-medium', styles[status])}>
        {labels[status]}
      </Badge>
    )
  }

  const getTypeBadge = (type: PropertyInspection['type']) => {
    const styles = {
      new_listing: 'bg-emerald-500/10 text-emerald-600',
      periodic: 'bg-blue-500/10 text-blue-600',
      move_out: 'bg-amber-500/10 text-amber-600',
    }
    const labels = {
      new_listing: 'New Listing',
      periodic: 'Periodic',
      move_out: 'Move-out',
    }
    return (
      <Badge className={cn('rounded-full px-2.5 py-0.5 text-[11px]', styles[type])}>
        {labels[type]}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => navigate(ROUTES.PROFILE)}
        className="lg:shadow-sm"
      />

      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-blue-500/5 via-background to-background">
          <div className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-8 lg:py-10">
            <Button
              variant="ghost"
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(ROUTES.HOMERUNNER_DASHBOARD)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                      Property Inspections
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Inspect properties submitted by landlords for listing approval
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 font-semibold">
                  ₦{inspections.reduce((sum, i) => sum + i.earnAmount, 0).toLocaleString()} potential
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'confirmed', 'completed'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  filterStatus === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </section>

        {/* Inspections List */}
        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 pb-8 lg:pb-12">
          <div className="space-y-4">
            {paginatedInspections.map((inspection) => (
              <Card
                key={inspection.id}
                className="rounded-2xl border border-border/60 bg-background/80 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Property Image */}
                    <div className="w-full lg:w-48 h-32 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={inspection.propertyImage}
                        alt={inspection.propertyTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = `<div class="flex flex-col items-center justify-center text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span class="text-xs mt-2">No image</span></div>`
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {getTypeBadge(inspection.type)}
                        {getStatusBadge(inspection.status)}
                        <span className="text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {inspection.scheduledFor}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-foreground">
                        {inspection.propertyTitle}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-primary" />
                          {inspection.location}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <User className="h-4 w-4 text-primary" />
                            {inspection.landlordName}
                          </span>
                          <ReportButton
                            reportedEntity={{
                              id: inspection.propertyId + '-landlord',
                              name: inspection.landlordName,
                              type: 'user',
                              role: 'landlord',
                            }}
                            reportType="landlord"
                            relatedTo={{
                              type: 'property',
                              id: inspection.propertyId,
                              title: inspection.propertyTitle,
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-amber-600 hover:bg-amber-500/15 dark:hover:bg-amber-950/30"
                          />
                        </div>
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-4 w-4 text-primary" />
                          {inspection.landlordPhone}
                        </span>
                      </div>

                      {inspection.notes && (
                        <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                          <FileText className="h-4 w-4 inline mr-2 text-primary" />
                          {inspection.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Earn</p>
                        <p className="text-xl font-bold text-emerald-600">
                          ₦{inspection.earnAmount.toLocaleString()}
                        </p>
                      </div>

                      {inspection.status === 'pending' && (
                        <Button
                          className="rounded-xl w-full bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleAcceptInspection(inspection.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                      )}
                      {(inspection.status === 'confirmed' || inspection.status === 'in_progress') && (
                        <Button
                          className="rounded-xl w-full"
                          onClick={() => openInspectionFlow(inspection)}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          {inspection.status === 'in_progress' ? 'Resume inspection' : 'Start Inspection'}
                        </Button>
                      )}
                      {inspection.status === 'completed' && (
                        <Button variant="outline" className="rounded-xl w-full">
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredInspections.length > 0 && totalPages > 1 && (
              <div className="flex flex-col gap-3 pt-6 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {filteredInspections.length === 0 && (
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No inspections found</h3>
                <p className="text-muted-foreground">
                  There are no {filterStatus !== 'all' ? filterStatus : ''} inspections at the moment.
                </p>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <Dialog
        open={Boolean(selectedInspection)}
        onOpenChange={(open) => {
          if (!open) {
            closeInspectionFlow()
          }
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Inspection workflow</DialogTitle>
            <DialogDescription>
              {selectedInspection?.propertyTitle} • {selectedInspection?.location}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-xl border border-border/60 p-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">
                  Step {inspectionStep + 1} of {inspectionSteps.length}
                </p>
                <Badge className="rounded-full bg-emerald-500/10 text-emerald-600">
                  {selectedInspection?.status === 'completed' ? 'Completed' : 'In progress'}
                </Badge>
              </div>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${((inspectionStep + 1) / inspectionSteps.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-3">
              {inspectionSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    'rounded-2xl border px-3 py-3 flex items-start gap-3',
                    index === inspectionStep ? 'border-primary bg-primary/5' : 'border-border/60'
                  )}
                >
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full border flex items-center justify-center text-sm font-semibold',
                      index === inspectionStep ? 'border-primary text-primary' : 'border-border/60 text-muted-foreground'
                    )}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="inspection-notes">Notes / findings</Label>
              <Textarea
                id="inspection-notes"
                placeholder="Highlight any key observation, pending maintenance, or landlord feedback..."
                value={inspectionNotes}
                onChange={(event) => setInspectionNotes(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                These notes are saved to the landlord record and can be edited later from the reports page.
              </p>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="ghost" onClick={handleInspectionBack}>
              {inspectionStep === 0 ? 'Cancel' : 'Previous step'}
            </Button>
            <Button
              onClick={handleInspectionAdvance}
              disabled={
                inspectionStep === inspectionSteps.length - 1 && inspectionNotes.trim().length < 10
              }
            >
              {inspectionStep === inspectionSteps.length - 1 ? 'Submit report' : 'Next step'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}


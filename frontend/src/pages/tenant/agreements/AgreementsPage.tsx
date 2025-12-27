import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, CheckCircle2, Clock, XCircle, Upload, Download, Eye, Calendar } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { AuthDialog } from '@/widgets/auth-dialog'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { useAuthStore } from '@/shared/store/auth.store'
import { mockAgreements as sampleAgreements } from '@/__mocks__/data/tenant.mock'
import type { Agreement, AgreementStatus } from '@/shared/types/tenant.types'
import { cn } from '@/shared/lib/utils/cn'
import toast from 'react-hot-toast'

const formatCurrency = (value: number) =>
  `₦${new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)}`

const getStatusConfig = (status: AgreementStatus) => {
  const configs = {
    pending: {
      label: 'Awaiting Signature',
      icon: Clock,
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    },
    signed: {
      label: 'Active',
      icon: CheckCircle2,
      className: 'bg-primary/10 text-primary border-primary/20',
    },
    expired: {
      label: 'Expired',
      icon: XCircle,
      className: 'bg-muted text-muted-foreground border-border',
    },
    terminated: {
      label: 'Terminated',
      icon: XCircle,
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    },
  }
  return configs[status]
}

export function AgreementsPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [signatureFile, setSignatureFile] = useState<File | null>(null)

  const handleMenuClick = () => setIsSidebarOpen(true)
  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setIsDrawerOpen(true)
    } else {
      navigate('/profile')
    }
  }

  const handleViewAgreement = (agreement: Agreement) => {
    setSelectedAgreement(agreement)
  }

  const handleCloseModal = () => {
    setSelectedAgreement(null)
    setSignatureFile(null)
  }

  const handleSignatureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      setSignatureFile(file)
      toast.success('Signature file selected')
    }
  }

  const handleSubmitSignature = async () => {
    if (!selectedAgreement || !signatureFile) {
      toast.error('Please select a signature file')
      return
    }

    setIsUploading(true)
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success('Agreement signed successfully!')
      handleCloseModal()
    } catch (error) {
      toast.error('Failed to sign agreement. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownloadAgreement = (agreement: Agreement) => {
    toast.success(`Downloading ${agreement.propertyName} agreement...`)
  }

  const agreements = sampleAgreements
  const pendingAgreements = agreements.filter((a) => a.status === 'pending')
  const activeAgreements = agreements.filter((a) => a.status === 'signed')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />

      <main className="flex-1 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-10 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">My Agreements</h1>
            <p className="text-muted-foreground">
              View and manage your rental agreements. Sign pending agreements to activate your lease.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 lg:p-6 bg-surface border-border/50">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{agreements.length}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 lg:p-6 bg-surface border-border/50">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{activeAgreements.length}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 lg:p-6 bg-surface border-border/50">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{pendingAgreements.length}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 lg:p-6 bg-surface border-border/50">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {agreements.filter((a) => a.status === 'expired' || a.status === 'terminated').length}
                  </p>
                  <p className="text-xs lg:text-sm text-muted-foreground">Inactive</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Agreements List */}
          <div className="space-y-4">
            {agreements.map((agreement) => {
              const statusConfig = getStatusConfig(agreement.status)
              const StatusIcon = statusConfig.icon
              const daysRemaining = differenceInDays(agreement.endDate, new Date())
              const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 30

              return (
                <Card
                  key={agreement.id}
                  className="p-5 lg:p-6 bg-surface border-border/50 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Property Image */}
                    {agreement.propertyImage && (
                      <div className="relative w-full lg:w-32 h-32 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={agreement.propertyImage}
                          alt={agreement.propertyName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-1">
                            {agreement.propertyName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{agreement.propertyAddress}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Landlord: <span className="text-foreground font-medium">{agreement.landlordName}</span>
                          </p>
                        </div>
                        <Badge className={cn('rounded-full px-3 py-1 text-xs border', statusConfig.className)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>

                      {/* Agreement Details */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs mb-0.5">Start Date</p>
                          <p className="text-foreground font-medium">{format(agreement.startDate, 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-0.5">End Date</p>
                          <p className="text-foreground font-medium">{format(agreement.endDate, 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-0.5">Monthly Rent</p>
                          <p className="text-foreground font-medium">{formatCurrency(agreement.monthlyRent)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-0.5">Security Deposit</p>
                          <p className="text-foreground font-medium">{formatCurrency(agreement.securityDeposit)}</p>
                        </div>
                      </div>

                      {/* Expiring Soon Alert */}
                      {isExpiringSoon && agreement.status === 'signed' && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <Calendar className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                          <p className="text-xs text-amber-600">
                            This agreement expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}. Contact your
                            landlord for renewal.
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-border hover:border-primary/50 hover:text-primary"
                          onClick={() => handleViewAgreement(agreement)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          View Agreement
                        </Button>

                        {agreement.documentUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-border hover:border-primary/50 hover:text-primary"
                            onClick={() => handleDownloadAgreement(agreement)}
                          >
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            Download
                          </Button>
                        )}

                        {agreement.status === 'pending' && (
                          <Button
                            size="sm"
                            className="text-xs bg-primary hover:bg-primary/90"
                            onClick={() => handleViewAgreement(agreement)}
                          >
                            <Upload className="h-3.5 w-3.5 mr-1.5" />
                            Sign Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {agreements.length === 0 && (
            <Card className="p-12 text-center bg-surface border-border/50">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Agreements Yet</h3>
              <p className="text-sm text-muted-foreground">
                Your rental agreements will appear here once they're created by your landlord.
              </p>
            </Card>
          )}
        </div>
      </main>

      {/* Agreement Detail Modal */}
      {selectedAgreement && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-0 lg:p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-background w-full lg:max-w-3xl lg:rounded-2xl h-[90vh] lg:h-auto lg:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 lg:p-6 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-foreground">{selectedAgreement.propertyName}</h2>
                <p className="text-sm text-muted-foreground">{selectedAgreement.propertyAddress}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-foreground hover:bg-muted"
                onClick={handleCloseModal}
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-6">
              {/* Agreement Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Landlord</p>
                  <p className="text-sm font-medium text-foreground">{selectedAgreement.landlordName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Agreement Type</p>
                  <Badge className="bg-primary/10 text-primary text-xs capitalize">
                    {selectedAgreement.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium text-foreground">
                    {format(selectedAgreement.startDate, 'MMM dd, yyyy')} -{' '}
                    {format(selectedAgreement.endDate, 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Monthly Rent</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatCurrency(selectedAgreement.monthlyRent)}
                  </p>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3">Terms & Conditions</h3>
                <div className="space-y-2">
                  {selectedAgreement.terms.map((term, index) => (
                    <div key={index} className="flex gap-3 text-sm">
                      <span className="text-primary font-medium shrink-0">{index + 1}.</span>
                      <p className="text-foreground">{term}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Section */}
              {selectedAgreement.status === 'pending' && (
                <div className="p-4 lg:p-5 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Upload className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground mb-1">Upload Your E-Signature</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Upload a clear image of your signature. Accepted formats: PNG, JPG (Max 5MB)
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <label htmlFor="signature-upload" className="flex-1 cursor-pointer">
                          <Input
                            id="signature-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleSignatureSelect}
                          />
                          <div className="h-10 px-4 rounded-lg border border-border bg-background flex items-center justify-center gap-2 hover:border-primary/50 transition-colors">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {signatureFile ? signatureFile.name : 'Choose File'}
                            </span>
                          </div>
                        </label>
                        <Button
                          disabled={!signatureFile || isUploading}
                          onClick={handleSubmitSignature}
                          className="h-10 bg-primary hover:bg-primary/90"
                        >
                          {isUploading ? 'Signing...' : 'Sign Agreement'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Signed Info */}
              {selectedAgreement.status === 'signed' && selectedAgreement.signedAt && (
                <div className="p-4 lg:p-5 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Agreement Signed</h4>
                    <p className="text-xs text-muted-foreground">
                      Signed on {format(selectedAgreement.signedAt, 'MMMM dd, yyyy')} at{' '}
                      {format(selectedAgreement.signedAt, 'h:mm a')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <Footer />
    </div>
  )
}


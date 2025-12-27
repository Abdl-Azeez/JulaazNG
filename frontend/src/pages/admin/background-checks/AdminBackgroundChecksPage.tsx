import { useState, useMemo } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  ShieldCheck,
  ArrowLeft,
  Search,
  Filter,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Eye,
  Download,
  Loader2,
  Building2,
  Briefcase,
  CreditCard,
  FileCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import toast from 'react-hot-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/ui/dropdown-menu'
import {
  adminBackgroundChecks,
  type AdminBackgroundCheck as BackgroundCheck,
  type AdminBackgroundCheckDocument as BackgroundCheckDocument,
} from '@/__mocks__/data/admin.mock'

const documentTypeColors: Record<BackgroundCheckDocument['type'], string> = {
  identity: 'bg-blue-500/10 text-blue-600',
  employment: 'bg-purple-500/10 text-purple-600',
  financial: 'bg-emerald-500/10 text-emerald-600',
  competency: 'bg-amber-500/10 text-amber-600',
  workshop: 'bg-orange-500/10 text-orange-600',
  other: 'bg-gray-500/10 text-gray-600',
}

const documentTypeIcons: Record<BackgroundCheckDocument['type'], React.ReactNode> = {
  identity: <User className="h-4 w-4" />,
  employment: <Briefcase className="h-4 w-4" />,
  financial: <CreditCard className="h-4 w-4" />,
  competency: <FileCheck className="h-4 w-4" />,
  workshop: <Building2 className="h-4 w-4" />,
  other: <FileText className="h-4 w-4" />,
}

const statusColors: Record<BackgroundCheck['status'], string> = {
  pending: 'bg-amber-500/10 text-amber-600',
  in_review: 'bg-blue-500/10 text-blue-600',
  approved: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-red-500/10 text-red-600',
}

const statusIcons: Record<BackgroundCheck['status'], React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  in_review: <Loader2 className="h-3 w-3" />,
  approved: <CheckCircle className="h-3 w-3" />,
  rejected: <XCircle className="h-3 w-3" />,
}

const docStatusColors: Record<BackgroundCheckDocument['status'], string> = {
  pending: 'bg-amber-500/10 text-amber-600',
  approved: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-red-500/10 text-red-600',
}

const ITEMS_PER_PAGE = 8

export function AdminBackgroundChecksPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<BackgroundCheck['status'] | 'all'>('all')
  const [roleFilter, setRoleFilter] = useState<BackgroundCheck['userRole'] | 'all'>('all')
  const [backgroundChecks, setBackgroundChecks] = useState<BackgroundCheck[]>(adminBackgroundChecks)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewingDocument, setViewingDocument] = useState<{
    check: BackgroundCheck
    document: BackgroundCheckDocument
  } | null>(null)

  const filteredChecks = useMemo(() => {
    return backgroundChecks.filter((check) => {
      const matchesSearch =
        check.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        check.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        check.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || check.status === statusFilter
      const matchesRole = roleFilter === 'all' || check.userRole === roleFilter
      return matchesSearch && matchesStatus && matchesRole
    })
  }, [backgroundChecks, searchQuery, statusFilter, roleFilter])

  const totalPages = Math.ceil(filteredChecks.length / ITEMS_PER_PAGE)
  const paginatedChecks = filteredChecks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, roleFilter])

  const handleDocumentApprove = (checkId: string, docId: string) => {
    setBackgroundChecks((prev) =>
      prev.map((check) => {
        if (check.id === checkId) {
          const updatedDocs = check.documents.map((doc) =>
            doc.id === docId ? { ...doc, status: 'approved' as const } : doc
          )
          const approvedCount = updatedDocs.filter((d) => d.status === 'approved').length
          const newProgress = Math.round((approvedCount / updatedDocs.length) * 100)
          const newStatus = newProgress === 100 && check.status !== 'rejected' ? 'in_review' : check.status
          return {
            ...check,
            documents: updatedDocs,
            progress: newProgress,
            status: newStatus,
          }
        }
        return check
      })
    )
    toast.success('Document approved')
  }

  const handleDocumentReject = (checkId: string, docId: string) => {
    setBackgroundChecks((prev) =>
      prev.map((check) => {
        if (check.id === checkId) {
          const updatedDocs = check.documents.map((doc) =>
            doc.id === docId ? { ...doc, status: 'rejected' as const } : doc
          )
          return { ...check, documents: updatedDocs }
        }
        return check
      })
    )
    toast.success('Document rejected')
  }

  const handleCheckApprove = (checkId: string) => {
    setBackgroundChecks((prev) =>
      prev.map((check) => (check.id === checkId ? { ...check, status: 'approved' as const, progress: 100 } : check))
    )
    toast.success('Background check approved')
  }

  const handleCheckReject = (checkId: string) => {
    setBackgroundChecks((prev) =>
      prev.map((check) => (check.id === checkId ? { ...check, status: 'rejected' as const } : check))
    )
    toast.success('Background check rejected')
  }

  const handleViewDocument = (check: BackgroundCheck, document: BackgroundCheckDocument) => {
    setViewingDocument({ check, document })
  }

  const handleDownloadDocument = (document: BackgroundCheckDocument) => {
    toast.success(`Downloading ${document.name}...`)
    // TODO: Implement actual download
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
          <div className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-8 lg:py-10">
            <Button
              variant="ghost"
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                      Background Check Approvals
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Review and approve user background checks and documents
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Badge className="rounded-full bg-amber-500/10 text-amber-600 px-3 py-1.5">
                  {backgroundChecks.filter((c) => c.status === 'pending' || c.status === 'in_review').length} Pending Review
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{backgroundChecks.length}</p>
                  <p className="text-xs text-muted-foreground">Total Checks</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {backgroundChecks.filter((c) => c.status === 'pending' || c.status === 'in_review').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{backgroundChecks.filter((c) => c.status === 'approved').length}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{backgroundChecks.filter((c) => c.status === 'rejected').length}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <Filter className="h-4 w-4 mr-2" />
                  Status: {statusFilter === 'all' ? 'All' : statusFilter.replace('_', ' ')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('in_review')}>In Review</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('approved')}>Approved</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>Rejected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <Filter className="h-4 w-4 mr-2" />
                  Role: {roleFilter === 'all' ? 'All' : roleFilter.replace('_', ' ')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setRoleFilter('all')}>All Roles</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setRoleFilter('tenant')}>Tenant</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter('landlord')}>Landlord</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter('handyman')}>Handyman</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter('service_provider')}>Service Provider</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter('homerunner')}>Homerunner</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Background Checks List */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-6 lg:pb-10">
          <div className="space-y-4">
            {paginatedChecks.map((check) => (
              <Card key={check.id} className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-5">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left: User Info & Status */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {check.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{check.userName}</h3>
                          <Badge className={cn('rounded-full capitalize flex items-center gap-1', statusColors[check.status])}>
                            {statusIcons[check.status]}
                            {check.status.replace('_', ' ')}
                          </Badge>
                          <Badge className="rounded-full bg-muted text-muted-foreground capitalize">
                            {check.userRole.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{check.userEmail}</p>
                        <p className="text-xs text-muted-foreground mt-1">ID: {check.id} • Submitted {check.submittedAt}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Verification Progress</span>
                        <span className="text-sm text-muted-foreground">{check.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all',
                            check.progress === 100 ? 'bg-emerald-500' : check.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                          )}
                          style={{ width: `${check.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Documents Grid */}
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {check.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className={cn(
                            'p-3 rounded-lg border flex items-start justify-between gap-2',
                            doc.status === 'approved' ? 'border-emerald-500/30 bg-emerald-500/5' :
                            doc.status === 'rejected' ? 'border-red-500/30 bg-red-500/5' :
                            'border-border/60 bg-muted/30'
                          )}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', documentTypeColors[doc.type])}>
                              {documentTypeIcons[doc.type]}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground break-words">{doc.name}</p>
                              <Badge className={cn('rounded-full text-[10px] mt-1 whitespace-nowrap', docStatusColors[doc.status])}>
                                {doc.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 shrink-0">
                            {doc.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-9 w-9 p-0 text-emerald-600 border-emerald-600/30 hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-600/50"
                                  onClick={() => handleDocumentApprove(check.id, doc.id)}
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-9 w-9 p-0 text-red-600 border-red-600/30 hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-400 hover:border-red-600/50"
                                  onClick={() => handleDocumentReject(check.id, doc.id)}
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 w-9 p-0 text-blue-600 border-blue-600/30 hover:bg-blue-500/20 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-600/50"
                              onClick={() => handleViewDocument(check, doc)}
                              title="View Document"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 w-9 p-0 text-muted-foreground border-border hover:bg-muted hover:text-foreground hover:border-border/80"
                              onClick={() => handleDownloadDocument(doc)}
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Actions & Form Data */}
                  <div className="lg:w-80 space-y-4">
                    {/* Form Data Summary */}
                    <Card className="p-4 rounded-xl border border-border/60 bg-muted/30">
                      <h4 className="text-sm font-semibold text-foreground mb-3">Form Information</h4>
                      <div className="space-y-2 text-sm">
                        {check.formData.identityNumber && (
                          <div>
                            <span className="text-muted-foreground">ID Number:</span>
                            <span className="ml-2 text-foreground">{check.formData.identityNumber}</span>
                          </div>
                        )}
                        {check.formData.occupation && (
                          <div>
                            <span className="text-muted-foreground">Occupation:</span>
                            <span className="ml-2 text-foreground">{check.formData.occupation}</span>
                          </div>
                        )}
                        {check.formData.employer && (
                          <div>
                            <span className="text-muted-foreground">Employer:</span>
                            <span className="ml-2 text-foreground">{check.formData.employer}</span>
                          </div>
                        )}
                        {check.formData.monthlyIncome && (
                          <div>
                            <span className="text-muted-foreground">Monthly Income:</span>
                            <span className="ml-2 text-foreground">₦{Number(check.formData.monthlyIncome).toLocaleString()}</span>
                          </div>
                        )}
                        {check.formData.workshopAddress && (
                          <div>
                            <span className="text-muted-foreground">Workshop:</span>
                            <span className="ml-2 text-foreground">{check.formData.workshopAddress}</span>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Actions */}
                    {check.status !== 'approved' && check.status !== 'rejected' && (
                      <div className="space-y-2">
                        <Button
                          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleCheckApprove(check.id)}
                          disabled={check.progress < 100}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Check
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full rounded-lg text-red-600 border-red-600/30 hover:bg-red-50"
                          onClick={() => handleCheckReject(check.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Check
                        </Button>
                        {check.progress < 100 && (
                          <p className="text-xs text-amber-600 text-center">
                            All documents must be approved before final approval
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredChecks.length === 0 && (
            <div className="text-center py-12">
              <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No background checks found matching your criteria</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/60">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredChecks.length)} of {filteredChecks.length} background checks
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="icon"
                      className="h-9 w-9 rounded-lg"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Document Viewer Dialog */}
      <Dialog open={!!viewingDocument} onOpenChange={(open) => !open && setViewingDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {viewingDocument && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', documentTypeColors[viewingDocument.document.type])}>
                    {documentTypeIcons[viewingDocument.document.type]}
                  </div>
                  {viewingDocument.document.name}
                </DialogTitle>
                <DialogDescription>
                  Document from {viewingDocument.check.userName}&apos;s background check
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Document Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 rounded-xl border border-border/60">
                    <p className="text-xs text-muted-foreground mb-1">Document Type</p>
                    <Badge className={cn('rounded-full', documentTypeColors[viewingDocument.document.type])}>
                      {viewingDocument.document.type.replace('_', ' ')}
                    </Badge>
                  </Card>
                  <Card className="p-4 rounded-xl border border-border/60">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Badge className={cn('rounded-full', docStatusColors[viewingDocument.document.status])}>
                      {viewingDocument.document.status}
                    </Badge>
                  </Card>
                </div>

                {/* Document Preview */}
                <Card className="p-6 rounded-xl border border-border/60 bg-muted/30">
                  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                    <div className={cn('h-20 w-20 rounded-xl flex items-center justify-center', documentTypeColors[viewingDocument.document.type])}>
                      {documentTypeIcons[viewingDocument.document.type]}
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-semibold text-foreground">{viewingDocument.document.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded: {viewingDocument.document.uploadedAt}
                      </p>
                      {viewingDocument.document.fileUrl ? (
                        <div className="mt-4">
                          <img
                            src={viewingDocument.document.fileUrl}
                            alt={viewingDocument.document.name}
                            className="max-w-full max-h-[500px] rounded-lg border border-border/60"
                            onError={(e) => {
                              // Fallback if image fails to load
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="mt-4 p-8 rounded-lg border-2 border-dashed border-border/60 bg-background">
                          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground">
                            Document preview not available
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            This document may need to be downloaded to view
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Notes */}
                {viewingDocument.document.notes && (
                  <Card className="p-4 rounded-xl border border-border/60">
                    <p className="text-sm font-semibold text-foreground mb-2">Notes</p>
                    <p className="text-sm text-muted-foreground">{viewingDocument.document.notes}</p>
                  </Card>
                )}

                {/* User Info */}
                <Card className="p-4 rounded-xl border border-border/60 bg-muted/30">
                  <p className="text-sm font-semibold text-foreground mb-3">User Information</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="text-foreground font-medium">{viewingDocument.check.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground">{viewingDocument.check.userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="text-foreground capitalize">{viewingDocument.check.userRole.replace('_', ' ')}</span>
                    </div>
                  </div>
                </Card>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => handleDownloadDocument(viewingDocument.document)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                {viewingDocument.document.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      className="text-emerald-600 border-emerald-600/30 hover:bg-emerald-50"
                      onClick={() => {
                        handleDocumentApprove(viewingDocument.check.id, viewingDocument.document.id)
                        setViewingDocument(null)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-600/30 hover:bg-red-50"
                      onClick={() => {
                        handleDocumentReject(viewingDocument.check.id, viewingDocument.document.id)
                        setViewingDocument(null)
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button onClick={() => setViewingDocument(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


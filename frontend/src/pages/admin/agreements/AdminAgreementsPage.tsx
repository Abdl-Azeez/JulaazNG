import { useState, useMemo } from 'react'
import { AdminLayout } from '@/widgets/admin-layout'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  ArrowLeft,
  Search,
  Filter,
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  User,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface AgreementTemplate {
  id: string
  name: string
  version: string
  type: 'annual_lease' | 'shortlet' | 'commercial'
  content: string
  pdfUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  updatedBy: string
}

interface CustomAgreementRequest {
  id: string
  propertyId: string
  propertyName: string
  landlordId: string
  landlordName: string
  landlordEmail: string
  status: 'pending' | 'approved' | 'rejected'
  documentUrl?: string
  rejectionReason?: string
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

// Mock data
const mockAgreementTemplates: AgreementTemplate[] = [
  {
    id: 'template-1',
    name: 'Standard Annual Lease Agreement',
    version: '2.1',
    type: 'annual_lease',
    content: 'Standard annual lease agreement template...',
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-12-01',
    updatedBy: 'Admin User',
  },
  {
    id: 'template-2',
    name: 'Shortlet Agreement',
    version: '1.5',
    type: 'shortlet',
    content: 'Shortlet agreement template...',
    isActive: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-11-15',
    updatedBy: 'Admin User',
  },
]

const mockCustomRequests: CustomAgreementRequest[] = [
  {
    id: 'request-1',
    propertyId: 'prop-1',
    propertyName: 'Luxury Apartment in Marina',
    landlordId: 'landlord-1',
    landlordName: 'John Landlord',
    landlordEmail: 'john@example.com',
    status: 'pending',
    documentUrl: '/agreements/custom-1.pdf',
    submittedAt: '2025-01-10',
  },
  {
    id: 'request-2',
    propertyId: 'prop-2',
    propertyName: 'Modern 2BR in Lekki',
    landlordId: 'landlord-2',
    landlordName: 'Sarah Property Owner',
    landlordEmail: 'sarah@example.com',
    status: 'approved',
    documentUrl: '/agreements/custom-2.pdf',
    submittedAt: '2025-01-05',
    reviewedAt: '2025-01-08',
    reviewedBy: 'Admin User',
  },
]

export function AdminAgreementsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'templates' | 'requests'>('templates')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | CustomAgreementRequest['status']>('all')
  const [templates, setTemplates] = useState<AgreementTemplate[]>(mockAgreementTemplates)
  const [requests, setRequests] = useState<CustomAgreementRequest[]>(mockCustomRequests)
  const [editingTemplate, setEditingTemplate] = useState<AgreementTemplate | null>(null)
  const [templateContent, setTemplateContent] = useState('')
  const [viewingRequest, setViewingRequest] = useState<CustomAgreementRequest | null>(null)
  const [rejectingRequest, setRejectingRequest] = useState<CustomAgreementRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const filteredRequests = useMemo(() => {
    let filtered = requests

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (req) =>
          req.propertyName.toLowerCase().includes(query) ||
          req.landlordName.toLowerCase().includes(query) ||
          req.landlordEmail.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((req) => req.status === statusFilter)
    }

    return filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  }, [searchQuery, statusFilter, requests])

  const handleEditTemplate = (template: AgreementTemplate) => {
    setEditingTemplate(template)
    setTemplateContent(template.content)
  }

  const handleSaveTemplate = () => {
    if (!editingTemplate) return

    setTemplates((prev) =>
      prev.map((t) =>
        t.id === editingTemplate.id
          ? {
              ...t,
              content: templateContent,
              updatedAt: new Date().toISOString().split('T')[0],
              version: (parseFloat(t.version) + 0.1).toFixed(1),
            }
          : t
      )
    )
    toast.success('Agreement template updated successfully')
    setEditingTemplate(null)
    setTemplateContent('')
  }

  const handleApproveRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'approved' as const,
              reviewedAt: new Date().toISOString().split('T')[0],
              reviewedBy: 'Admin User',
            }
          : req
      )
    )
    toast.success('Custom agreement request approved')
  }

  const handleRejectRequest = (request: CustomAgreementRequest) => {
    setRejectingRequest(request)
    setRejectionReason('')
  }

  const handleConfirmReject = () => {
    if (!rejectingRequest || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    setRequests((prev) =>
      prev.map((req) =>
        req.id === rejectingRequest.id
          ? {
              ...req,
              status: 'rejected' as const,
              rejectionReason: rejectionReason.trim(),
              reviewedAt: new Date().toISOString().split('T')[0],
              reviewedBy: 'Admin User',
            }
          : req
      )
    )
    toast.success('Custom agreement request rejected')
    setRejectingRequest(null)
    setRejectionReason('')
  }

  const handleViewRequest = (request: CustomAgreementRequest) => {
    setViewingRequest(request)
  }

  const handleDownloadTemplate = (template: AgreementTemplate) => {
    toast.success(`Downloading ${template.name}...`)
  }

  const handleDownloadRequest = (request: CustomAgreementRequest) => {
    if (request.documentUrl) {
      toast.success('Downloading custom agreement...')
    } else {
      toast.error('Document not available')
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background flex flex-col">
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
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                        Agreement Management
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Manage Julaaz tenancy agreements and review custom agreement requests
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6">
            <div className="flex items-center gap-2 mb-6 border-b border-border/60">
              <button
                onClick={() => setActiveTab('templates')}
                className={cn(
                  'px-6 py-3 font-semibold border-b-2 transition-colors',
                  activeTab === 'templates'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                Julaaz Templates
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={cn(
                  'px-6 py-3 font-semibold border-b-2 transition-colors relative',
                  activeTab === 'requests'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                Custom Requests
                {requests.filter((r) => r.status === 'pending').length > 0 && (
                  <Badge className="ml-2 bg-amber-500 text-white text-xs">
                    {requests.filter((r) => r.status === 'pending').length}
                  </Badge>
                )}
              </button>
            </div>

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    Manage standard Julaaz tenancy agreement templates used by landlords
                  </p>
                  <Button onClick={() => toast.info('New template creation coming soon')}>
                    <Upload className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>

                <div className="grid gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="p-6 rounded-xl border border-border/60">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              v{template.version}
                            </Badge>
                            {template.isActive && (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                Active
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {template.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span>Last updated: {format(new Date(template.updatedAt), 'MMM d, yyyy')}</span>
                            <span>By: {template.updatedBy}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{template.content}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadTemplate(template)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search properties or landlords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 rounded-xl"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as typeof statusFilter)}>
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4">
                  {filteredRequests.map((request) => (
                    <Card key={request.id} className="p-6 rounded-xl border border-border/60">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">{request.propertyName}</h3>
                            <Badge
                              className={cn(
                                'rounded-full',
                                request.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                  : request.status === 'approved'
                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                    : 'bg-red-500/10 text-red-600 border-red-500/20'
                              )}
                            >
                              {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                              {request.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {request.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                              {request.status}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Landlord:</span>
                              <span className="font-medium">{request.landlordName}</span>
                              <span className="text-muted-foreground">({request.landlordEmail})</span>
                            </div>
                            <div className="text-muted-foreground">
                              Submitted: {format(new Date(request.submittedAt), 'MMM d, yyyy')}
                            </div>
                            {request.reviewedAt && (
                              <div className="text-muted-foreground">
                                Reviewed: {format(new Date(request.reviewedAt), 'MMM d, yyyy')} by {request.reviewedBy}
                              </div>
                            )}
                            {request.rejectionReason && (
                              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 mt-2">
                                <p className="text-xs font-semibold text-red-600 mb-1">Rejection Reason:</p>
                                <p className="text-sm text-red-600/90">{request.rejectionReason}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleViewRequest(request)}
                                variant="outline"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => handleApproveRequest(request.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600/30 hover:bg-red-50"
                                onClick={() => handleRejectRequest(request)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                          {request.status !== 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewRequest(request)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadRequest(request)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                  {filteredRequests.length === 0 && (
                    <Card className="p-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No custom agreement requests found</p>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Agreement Template</DialogTitle>
            <DialogDescription>
              Update the content of {editingTemplate?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Template Content</Label>
              <Textarea
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Enter agreement template content..."
              />
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Changes to the template will create a new version. Existing agreements using older versions will remain unchanged.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTemplate(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Request Dialog */}
      <Dialog open={!!viewingRequest} onOpenChange={(open) => !open && setViewingRequest(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {viewingRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Custom Agreement Request</DialogTitle>
                <DialogDescription>
                  {viewingRequest.propertyName} by {viewingRequest.landlordName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 rounded-xl border border-border/60">
                    <p className="text-xs text-muted-foreground mb-1">Property</p>
                    <p className="font-semibold">{viewingRequest.propertyName}</p>
                  </Card>
                  <Card className="p-4 rounded-xl border border-border/60">
                    <p className="text-xs text-muted-foreground mb-1">Landlord</p>
                    <p className="font-semibold">{viewingRequest.landlordName}</p>
                    <p className="text-sm text-muted-foreground">{viewingRequest.landlordEmail}</p>
                  </Card>
                </div>
                {viewingRequest.documentUrl && (
                  <div className="p-6 rounded-xl border border-border/60 bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-semibold">Agreement Document</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadRequest(viewingRequest!)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                    <iframe
                      src={viewingRequest.documentUrl}
                      className="w-full h-[500px] rounded-lg border border-border/60"
                      title="Agreement Preview"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewingRequest(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Request Dialog */}
      <Dialog open={!!rejectingRequest} onOpenChange={(open) => !open && setRejectingRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Custom Agreement Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this custom agreement. The landlord will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Rejection Reason *</Label>
              <Textarea
                id="reject-reason"
                placeholder="e.g., Agreement doesn't meet legal requirements, missing clauses..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                The landlord will receive a notification about this rejection.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingRequest(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReject}
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectionReason.trim()}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

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
  CreditCard,
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  RefreshCw,
  Ban,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/ui/dropdown-menu'
import toast from 'react-hot-toast'

interface Payment {
  id: string
  reference: string
  type: 'rent' | 'service' | 'commission' | 'withdrawal' | 'refund'
  amount: number
  fee: number
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  payer: string
  payerType: 'tenant' | 'landlord' | 'service_provider'
  recipient: string
  recipientType: 'landlord' | 'platform' | 'service_provider' | 'homerunner'
  method: 'card' | 'bank_transfer' | 'wallet'
  date: string
  description: string
  transactionId?: string
  cardLast4?: string
  bankAccount?: string
}

// Expanded sample data for pagination demo
const generateSamplePayments = (): Payment[] => {
  const types: Payment['type'][] = ['rent', 'service', 'commission', 'withdrawal', 'refund']
  const statuses: Payment['status'][] = ['completed', 'pending', 'failed', 'refunded']
  const methods: Payment['method'][] = ['card', 'bank_transfer', 'wallet']
  const payers = ['Tosin Adeyemi', 'Chioma Nwosu', 'Grace Eze', 'Femi Ogunleye', 'Kunle Balogun', 'Michael Obi', 'Adebayo Johnson']
  const recipients = ['Femi Ogunleye', 'Kunle Balogun', 'Platform', 'Adebayo Johnson', 'Bank Account']
  
  return Array.from({ length: 52 }, (_, i) => ({
    id: `pay-${i + 1}`,
    reference: `PAY-2024-${String(i + 1).padStart(6, '0')}`,
    type: types[Math.floor(Math.random() * types.length)],
    amount: Math.floor(Math.random() * 5000000) + 10000,
    fee: Math.floor(Math.random() * 50000) + 1000,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    payer: payers[Math.floor(Math.random() * payers.length)],
    payerType: 'tenant' as const,
    recipient: recipients[Math.floor(Math.random() * recipients.length)],
    recipientType: 'landlord' as const,
    method: methods[Math.floor(Math.random() * methods.length)],
    date: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)).toLocaleString('en-NG'),
    description: `Payment for ${types[Math.floor(Math.random() * types.length)]} service`,
    transactionId: `TXN${String(i + 1).padStart(10, '0')}`,
    cardLast4: String(Math.floor(Math.random() * 9000) + 1000),
    bankAccount: `****${String(Math.floor(Math.random() * 9000) + 1000)}`,
  }))
}

const samplePayments = generateSamplePayments()

const statusColors: Record<Payment['status'], string> = {
  completed: 'bg-emerald-500/10 text-emerald-600',
  pending: 'bg-amber-500/10 text-amber-600',
  failed: 'bg-red-500/10 text-red-600',
  refunded: 'bg-blue-500/10 text-blue-600',
}

const statusIcons: Record<Payment['status'], React.ReactNode> = {
  completed: <CheckCircle className="h-3 w-3" />,
  pending: <Clock className="h-3 w-3" />,
  failed: <XCircle className="h-3 w-3" />,
  refunded: <RefreshCw className="h-3 w-3" />,
}

const typeColors: Record<Payment['type'], string> = {
  rent: 'bg-blue-500/10 text-blue-600',
  service: 'bg-purple-500/10 text-purple-600',
  commission: 'bg-emerald-500/10 text-emerald-600',
  withdrawal: 'bg-amber-500/10 text-amber-600',
  refund: 'bg-gray-500/10 text-gray-600',
}

type SortField = 'date' | 'amount' | 'reference' | 'status'
type SortDirection = 'asc' | 'desc'

const ITEMS_PER_PAGE = 10

export function AdminPaymentsPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Payment['status'] | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<Payment['type'] | 'all'>('all')
  const [payments, setPayments] = useState<Payment[]>(samplePayments)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false)

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.payer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.recipient.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
      const matchesType = typeFilter === 'all' || payment.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [payments, searchQuery, statusFilter, typeFilter])

  const sortedPayments = useMemo(() => {
    const sorted = [...filteredPayments].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case 'date':
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
          break
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'reference':
          aValue = a.reference
          bValue = b.reference
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredPayments, sortField, sortDirection])

  const totalPages = Math.ceil(sortedPayments.length / ITEMS_PER_PAGE)
  const paginatedPayments = sortedPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, typeFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsDetailsDialogOpen(true)
  }

  const handleInitiateRefund = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsRefundDialogOpen(true)
  }

  const handleConfirmRefund = () => {
    if (!selectedPayment) return
    setPayments((prev) =>
      prev.map((p) => (p.id === selectedPayment.id ? { ...p, status: 'refunded' as const } : p))
    )
    toast.success('Refund initiated successfully')
    setIsRefundDialogOpen(false)
    setSelectedPayment(null)
  }

  const handleApprovePayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'completed' as const } : p))
    )
    toast.success('Payment approved')
  }

  const handleRejectPayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'failed' as const } : p))
    )
    toast.success('Payment rejected')
  }

  const handleDownloadReceipt = (payment: Payment) => {
    toast.success(`Downloading receipt for ${payment.reference}...`)
    // TODO: Implement actual download
  }

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.fee, 0)

  const totalTransactions = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3 w-3 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1" />
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
        <section className="border-b border-border/60 bg-gradient-to-br from-emerald-500/5 via-background to-background">
          <div className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
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
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Payment Management</h1>
                    <p className="text-sm text-muted-foreground">
                      {sortedPayments.length} transactions • Monitor and manage all platform payments
                    </p>
                  </div>
                </div>
              </div>

              <Button
                className="rounded-xl"
                onClick={() => {
                  toast.success('Exporting transactions...')
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Transactions
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/5 to-background">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 text-[10px]">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12.5%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{formatPrice(totalTransactions)}</p>
              <p className="text-xs text-muted-foreground">Total Transaction Volume</p>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-blue-500/5 to-background">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 text-[10px]">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8.3%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">Platform Revenue (Fees)</p>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-amber-500/5 to-background">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-xs text-amber-600">Needs attention</span>
              </div>
              <p className="text-2xl font-bold">{formatPrice(pendingAmount)}</p>
              <p className="text-xs text-muted-foreground">Pending Transactions</p>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-red-500/5 to-background">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <Badge className="rounded-full bg-red-500/10 text-red-600 text-[10px]">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  -2.1%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{payments.filter((p) => p.status === 'failed').length}</p>
              <p className="text-xs text-muted-foreground">Failed Transactions</p>
            </Card>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reference, payer, or recipient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl h-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  Status: {statusFilter === 'all' ? 'All' : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('completed')}>Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('failed')}>Failed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('refunded')}>Refunded</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  Type: {typeFilter === 'all' ? 'All' : typeFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter('all')}>All Types</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTypeFilter('rent')}>Rent</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('service')}>Service</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('commission')}>Commission</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('withdrawal')}>Withdrawal</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('refund')}>Refund</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Transactions Table */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-6 lg:pb-10">
          <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border/60">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">
                      <button
                        onClick={() => handleSort('reference')}
                        className="flex items-center hover:text-foreground transition-colors"
                      >
                        Reference
                        <SortIcon field="reference" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">
                      <button
                        onClick={() => handleSort('amount')}
                        className="flex items-center hover:text-foreground transition-colors"
                      >
                        Amount
                        <SortIcon field="amount" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">
                      Payer → Recipient
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center hover:text-foreground transition-colors"
                      >
                        Status
                        <SortIcon field="status" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">
                      <button
                        onClick={() => handleSort('date')}
                        className="flex items-center hover:text-foreground transition-colors"
                      >
                        Date
                        <SortIcon field="date" />
                      </button>
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-mono text-sm text-foreground">{payment.reference}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{payment.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn('rounded-full capitalize', typeColors[payment.type])}>
                          {payment.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">{formatPrice(payment.amount)}</p>
                        {payment.fee > 0 && (
                          <p className="text-xs text-muted-foreground">Fee: {formatPrice(payment.fee)}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground">{payment.payer}</span>
                          <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{payment.recipient}</span>
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">{payment.method.replace('_', ' ')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={cn(
                            'rounded-full capitalize flex items-center gap-1 w-fit',
                            statusColors[payment.status]
                          )}
                        >
                          {statusIcons[payment.status]}
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{payment.date}</td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(payment)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadReceipt(payment)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download Receipt
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {payment.status === 'pending' && (
                              <>
                                <DropdownMenuItem
                                  className="text-emerald-600"
                                  onClick={() => handleApprovePayment(payment.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleRejectPayment(payment.id)}
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {payment.status === 'completed' && (
                              <DropdownMenuItem
                                className="text-amber-600"
                                onClick={() => handleInitiateRefund(payment)}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Initiate Refund
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions found matching your criteria</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border/60">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, sortedPayments.length)} of {sortedPayments.length}{' '}
                  transactions
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
          </Card>
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Payment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-emerald-600" />
                  Payment Details
                </DialogTitle>
                <DialogDescription>{selectedPayment.reference}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 rounded-xl border border-border/60">
                    <p className="text-xs text-muted-foreground mb-1">Amount</p>
                    <p className="text-2xl font-bold text-primary">{formatPrice(selectedPayment.amount)}</p>
                  </Card>
                  <Card className="p-4 rounded-xl border border-border/60">
                    <p className="text-xs text-muted-foreground mb-1">Platform Fee</p>
                    <p className="text-2xl font-bold text-foreground">{formatPrice(selectedPayment.fee)}</p>
                  </Card>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono text-foreground">{selectedPayment.transactionId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge className={cn('rounded-full capitalize', typeColors[selectedPayment.type])}>
                      {selectedPayment.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={cn('rounded-full capitalize flex items-center gap-1', statusColors[selectedPayment.status])}>
                      {statusIcons[selectedPayment.status]}
                      {selectedPayment.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Method:</span>
                    <span className="text-foreground capitalize">{selectedPayment.method.replace('_', ' ')}</span>
                  </div>
                  {selectedPayment.cardLast4 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Card:</span>
                      <span className="font-mono text-foreground">****{selectedPayment.cardLast4}</span>
                    </div>
                  )}
                  {selectedPayment.bankAccount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bank Account:</span>
                      <span className="font-mono text-foreground">{selectedPayment.bankAccount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="text-foreground">{selectedPayment.date}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 space-y-2">
                  <p className="text-sm font-semibold text-foreground">Payer</p>
                  <p className="text-sm text-foreground">{selectedPayment.payer}</p>
                  <p className="text-xs text-muted-foreground capitalize">{selectedPayment.payerType.replace('_', ' ')}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Recipient</p>
                  <p className="text-sm text-foreground">{selectedPayment.recipient}</p>
                  <p className="text-xs text-muted-foreground capitalize">{selectedPayment.recipientType.replace('_', ' ')}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Description</p>
                  <p className="text-sm text-muted-foreground">{selectedPayment.description}</p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => handleDownloadReceipt(selectedPayment)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 text-amber-600" />
                  Initiate Refund
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to initiate a refund for this payment?
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <Card className="p-4 rounded-xl border border-border/60 bg-muted/30">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reference:</span>
                      <span className="font-mono text-foreground">{selectedPayment.reference}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-bold text-foreground">{formatPrice(selectedPayment.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payer:</span>
                      <span className="text-foreground">{selectedPayment.payer}</span>
                    </div>
                  </div>
                </Card>

                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-sm text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="h-4 w-4 inline mr-2" />
                  This action will refund the full amount to the payer. This cannot be undone.
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleConfirmRefund}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Confirm Refund
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

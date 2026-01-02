import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Building2,
  Smartphone,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Receipt,
  Download,
  Calendar,
} from 'lucide-react'
import { format, differenceInDays, isPast } from 'date-fns'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { AuthDialog } from '@/widgets/auth-dialog'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { LogoLoader } from '@/widgets/logo-loader'
import { useAuthStore } from '@/shared/store/auth.store'
import { mockTenantPayments as samplePayments } from '@/__mocks__/data/tenant.mock'
import type { Payment, PaymentStatus, PaymentMethod, PaymentType } from '@/shared/types/tenant.types'
import { cn } from '@/shared/lib/utils/cn'
import toast from 'react-hot-toast'

const formatCurrency = (value: number) =>
  `₦${new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)}`

const getStatusConfig = (status: PaymentStatus) => {
  const configs = {
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    },
    processing: {
      label: 'Processing',
      icon: AlertCircle,
      className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    },
    completed: {
      label: 'Paid',
      icon: CheckCircle2,
      className: 'bg-primary/10 text-primary border-primary/20',
    },
    failed: {
      label: 'Failed',
      icon: XCircle,
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      className: 'bg-muted text-muted-foreground border-border',
    },
  }
  return configs[status]
}

const getPaymentTypeLabel = (type: PaymentType) => {
  const labels: Record<PaymentType, string> = {
    rent: 'Monthly Rent',
    security_deposit: 'Security Deposit',
    processing_fee: 'Processing Fee',
    legal_fee: 'Legal Fee',
    insurance: 'Insurance',
    maintenance: 'Maintenance',
    utility: 'Utility',
    late_fee: 'Late Fee',
    service_charge: 'Service Charge',
  }
  return labels[type]
}

const paymentMethods: Array<{
  id: PaymentMethod
  name: string
  description: string
  icon: typeof CreditCard
  providers?: string
}> = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay with Visa, Mastercard, or Verve',
    icon: CreditCard,
    providers: 'Visa, Mastercard, Verve',
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Direct bank transfer',
    icon: Building2,
  },
  {
    id: 'ussd',
    name: 'USSD',
    description: 'Pay with your phone using USSD code',
    icon: Smartphone,
  },
  {
    id: 'wallet',
    name: 'Julaaz Wallet',
    description: 'Pay with your Julaaz wallet balance',
    icon: Wallet,
  },
]

export function PaymentsPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleMenuClick = () => setIsSidebarOpen(true)
  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setIsDrawerOpen(true)
    } else {
      navigate('/profile')
    }
  }

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setSelectedPaymentMethod(null)
  }

  const handleCloseModal = () => {
    setSelectedPayment(null)
    setSelectedPaymentMethod(null)
  }

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method)
  }

  const handleProcessPayment = async () => {
    if (!selectedPayment || !selectedPaymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))
      toast.success('Payment successful! Receipt sent to your email.')
      handleCloseModal()
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadReceipt = (payment: Payment) => {
    if (payment.status !== 'completed') return
    toast.success(`Downloading receipt for ${payment.propertyName}...`)
  }

  const payments = samplePayments
  const pendingPayments = payments.filter((p) => p.status === 'pending')
  const completedPayments = payments.filter((p) => p.status === 'completed')
  const totalDue = pendingPayments.reduce((sum, p) => sum + p.total, 0)
  const totalPaid = completedPayments.reduce((sum, p) => sum + p.total, 0)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />

      <main className="flex-1 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-10 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">My Payments</h1>
            <p className="text-muted-foreground">
              View and manage your payment history. Pay rent, fees, and other charges securely.
            </p>
          </div>

          <Card className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-4 lg:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-foreground">Security-first, no-scam zone</h2>
                    <Badge className="rounded-full bg-primary/10 text-primary text-[10px]">Recommended</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    For your protection, always pay through the platform. It keeps your receipts, status updates, and support in one place.
                  </p>
                </div>
              </div>
              <Badge className="w-fit rounded-full bg-muted text-muted-foreground text-[10px]">Never pay offline</Badge>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 lg:p-6 min-h-[130px] bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
              <div className="flex h-full flex-col justify-between gap-2">
                <div className="p-2 rounded-lg bg-amber-500/20 w-fit">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm text-foreground/80">Total Due</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground break-words">{formatCurrency(totalDue)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 lg:p-6 min-h-[130px] bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
              <div className="flex h-full flex-col justify-between gap-2">
                <div className="p-2 rounded-lg bg-primary/20 w-fit">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm text-foreground/80">Total Paid</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground break-words">{formatCurrency(totalPaid)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 lg:p-6 min-h-[130px] bg-surface border-border/50">
              <div className="flex h-full flex-col justify-between gap-2">
                <div className="p-2 rounded-lg bg-primary/10 w-fit">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm text-muted-foreground">Transactions</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{payments.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 lg:p-6 min-h-[130px] bg-surface border-border/50">
              <div className="flex h-full flex-col justify-between gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 w-fit">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm text-muted-foreground">Pending</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{pendingPayments.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Pending Payments Alert */}
          {pendingPayments.length > 0 && (
            <div className="mb-6 p-4 lg:p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  You have {pendingPayments.length} pending payment{pendingPayments.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Total amount due: {formatCurrency(totalDue)}. Pay now to avoid late fees.
                </p>
              </div>
            </div>
          )}

          {/* Payments List */}
          <div className="space-y-6">
            {/* Pending Payments */}
            {pendingPayments.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Pending Payments</h2>
                <div className="space-y-4">
                  {pendingPayments.map((payment) => {
                    const statusConfig = getStatusConfig(payment.status)
                    const StatusIcon = statusConfig.icon
                    const isOverdue = isPast(payment.dueDate)
                    const daysUntilDue = differenceInDays(payment.dueDate, new Date())

                    return (
                      <Card
                        key={payment.id}
                        className={cn(
                          'p-5 lg:p-6 bg-surface border-border/50 hover:shadow-lg transition-all',
                          isOverdue && 'border-destructive/30 bg-destructive/5'
                        )}
                      >
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Property Image */}
                          {payment.propertyImage && (
                            <div className="relative w-full lg:w-32 h-32 rounded-xl overflow-hidden shrink-0">
                              <img
                                src={payment.propertyImage}
                                alt={payment.propertyName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-1">
                                  {payment.propertyName || 'Payment'}
                                </h3>
                                {payment.landlordName && (
                                  <p className="text-xs text-muted-foreground">
                                    Landlord: <span className="text-foreground font-medium">{payment.landlordName}</span>
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={cn('rounded-full px-3 py-1 text-xs border', statusConfig.className)}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig.label}
                                </Badge>
                                <p className="text-xl lg:text-2xl font-bold text-primary">{formatCurrency(payment.total)}</p>
                              </div>
                            </div>

                            {/* Payment Items */}
                            <div className="space-y-1.5">
                              {payment.items.slice(0, 2).map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">{item.description}</span>
                                  <span className="text-foreground font-medium">{formatCurrency(item.amount)}</span>
                                </div>
                              ))}
                              {payment.items.length > 2 && (
                                <p className="text-xs text-muted-foreground">
                                  +{payment.items.length - 2} more item{payment.items.length - 2 !== 1 ? 's' : ''}
                                </p>
                              )}
                            </div>

                            {/* Due Date */}
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className={cn('font-medium', isOverdue ? 'text-destructive' : 'text-foreground')}>
                                {isOverdue
                                  ? `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`
                                  : `Due ${format(payment.dueDate, 'MMM dd, yyyy')} (${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''} left)`}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Button
                                size="sm"
                                className="text-xs bg-primary hover:bg-primary/90"
                                onClick={() => handleViewPayment(payment)}
                              >
                                <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                                Pay Now
                              </Button>
                            </div>

                            {/* Services */}
                            {payment.services && payment.services.length > 0 && (
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="text-xs text-muted-foreground">Services:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {payment.services.slice(0, 3).map((service) => (
                                    <Badge key={service} variant="secondary" className="text-[10px] rounded-full">
                                      {service}
                                    </Badge>
                                  ))}
                                  {payment.services.length > 3 && (
                                    <Badge variant="secondary" className="text-[10px] rounded-full">
                                      +{payment.services.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Completed Payments */}
            {completedPayments.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Payment History</h2>
                <div className="space-y-4">
                  {completedPayments.map((payment) => {
                    const statusConfig = getStatusConfig(payment.status)
                    const StatusIcon = statusConfig.icon

                    return (
                      <Card
                        key={payment.id}
                        className="p-5 lg:p-6 bg-surface border-border/50 hover:shadow-lg transition-all"
                      >
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Property Image */}
                          {payment.propertyImage && (
                            <div className="relative w-full lg:w-32 h-32 rounded-xl overflow-hidden shrink-0 opacity-80">
                              <img
                                src={payment.propertyImage}
                                alt={payment.propertyName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-1">
                                  {payment.propertyName || 'Payment'}
                                </h3>
                                {payment.landlordName && (
                                  <p className="text-xs text-muted-foreground">
                                    Landlord: <span className="text-foreground font-medium">{payment.landlordName}</span>
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={cn('rounded-full px-3 py-1 text-xs border', statusConfig.className)}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig.label}
                                </Badge>
                                <p className="text-xl lg:text-2xl font-bold text-foreground">{formatCurrency(payment.total)}</p>
                              </div>
                            </div>

                            {/* Payment Items */}
                            <div className="space-y-1.5">
                              {payment.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">{item.description}</span>
                                  <span className="text-foreground font-medium">{formatCurrency(item.amount)}</span>
                                </div>
                              ))}
                            </div>

                            {/* Payment Info */}
                            {payment.paidAt && (
                              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                <span>Paid on {format(payment.paidAt, 'MMM dd, yyyy')}</span>
                                {payment.reference && <span>Ref: {payment.reference}</span>}
                                {payment.paymentMethod && (
                                  <span className="capitalize">Method: {payment.paymentMethod.replace('_', ' ')}</span>
                                )}
                                {typeof payment.pointsRedeemed === 'number' && payment.pointsRedeemed > 0 && (
                                  <span>Redeemed: {payment.pointsRedeemed.toLocaleString('en-NG')} pts</span>
                                )}
                              </div>
                            )}

                            {/* Services */}
                            {payment.services && payment.services.length > 0 && (
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="text-xs text-muted-foreground">Services:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {payment.services.slice(0, 3).map((service) => (
                                    <Badge key={service} variant="secondary" className="text-[10px] rounded-full">
                                      {service}
                                    </Badge>
                                  ))}
                                  {payment.services.length > 3 && (
                                    <Badge variant="secondary" className="text-[10px] rounded-full">
                                      +{payment.services.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs border-border hover:border-primary/50 hover:text-primary"
                                onClick={() => handleDownloadReceipt(payment)}
                              >
                                <Download className="h-3.5 w-3.5 mr-1.5" />
                                Download Receipt
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {payments.length === 0 && (
            <Card className="p-12 text-center bg-surface border-border/50">
              <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Payments Yet</h3>
              <p className="text-sm text-muted-foreground">
                Your payment requests will appear here once created by your landlord or admin.
              </p>
            </Card>
          )}
        </div>
      </main>

      {/* Payment Modal */}
      {selectedPayment && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-0 lg:p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-background w-full lg:max-w-2xl lg:rounded-2xl h-[90vh] lg:h-auto lg:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 lg:p-6 border-b border-border sticky top-0 bg-background z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-1">Complete Payment</h2>
                  <p className="text-sm text-muted-foreground">{selectedPayment.propertyName}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-foreground hover:bg-muted shrink-0"
                  onClick={handleCloseModal}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-6">
              {/* Payment Summary */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">Payment Summary</h3>
                <div className="p-4 rounded-xl bg-surface border border-border space-y-2.5">
                  {selectedPayment.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between text-sm">
                      <div className="flex-1">
                        <p className="text-foreground font-medium">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {getPaymentTypeLabel(item.type)}
                        </p>
                      </div>
                      <p className="text-foreground font-semibold ml-4">{formatCurrency(item.amount)}</p>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-border">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-medium">{formatCurrency(selectedPayment.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-muted-foreground">Processing Fee (1.88%)</span>
                      <span className="text-foreground font-medium">{formatCurrency(selectedPayment.processingFee)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-base font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">{formatCurrency(selectedPayment.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">Payment Method</h3>
                <div className="space-y-2.5">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    const isSelected = selectedPaymentMethod === method.id

                    return (
                      <button
                        key={method.id}
                        onClick={() => handlePaymentMethodSelect(method.id)}
                        className={cn(
                          'w-full p-4 rounded-xl border-2 transition-all text-left',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-surface hover:border-primary/40'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0',
                              isSelected ? 'border-primary' : 'border-border'
                            )}
                          >
                            {isSelected && <div className="h-3 w-3 rounded-full bg-primary" />}
                          </div>
                          <div className="p-2 rounded-lg bg-background">
                            <Icon className="h-5 w-5 text-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">{method.name}</p>
                            <p className="text-xs text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-foreground">
                    Powered by Paystack & Flutterwave (PCI DSS Compliant). Your payment is secure and encrypted.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 lg:p-6 border-t border-border bg-background">
              <Button
                disabled={!selectedPaymentMethod || isProcessing}
                onClick={handleProcessPayment}
                className="w-full h-12 text-base bg-primary hover:bg-primary/90"
              >
                {isProcessing ? (
                  <>
                    <LogoLoader size="sm" variant="white" className="mr-2" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay {formatCurrency(selectedPayment.total)}
                  </>
                )}
              </Button>
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


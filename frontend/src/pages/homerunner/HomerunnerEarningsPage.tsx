import { useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import {
  Wallet,
  ArrowLeft,
  TrendingUp,
  ClipboardCheck,
  Eye,
  DollarSign,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import {
  sampleEarnings,
  sampleTransactions,
  type EarningsTransaction,
} from './data/sample-homerunner-data'

type FilterType = 'all' | 'inspection' | 'viewing' | 'commission'

export function HomerunnerEarningsPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filterType, setFilterType] = useState<FilterType>('all')

  const filteredTransactions = sampleTransactions.filter((txn) => {
    if (filterType === 'all') return true
    return txn.type === filterType
  })

  const getTypeIcon = (type: EarningsTransaction['type']) => {
    switch (type) {
      case 'inspection':
        return <ClipboardCheck className="h-4 w-4 text-blue-600" />
      case 'viewing':
        return <Eye className="h-4 w-4 text-purple-600" />
      case 'commission':
        return <DollarSign className="h-4 w-4 text-emerald-600" />
    }
  }

  const getStatusBadge = (status: EarningsTransaction['status']) => {
    const styles = {
      pending: 'bg-amber-500/10 text-amber-600',
      processing: 'bg-blue-500/10 text-blue-600',
      paid: 'bg-emerald-500/10 text-emerald-600',
    }
    return (
      <Badge className={cn('rounded-full px-2.5 py-0.5 text-[11px]', styles[status])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
        <section className="border-b border-border/60 bg-gradient-to-br from-emerald-500/10 via-background to-background">
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
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                      Earnings & Payouts
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Track your income from inspections, viewings, and commissions
                    </p>
                  </div>
                </div>
              </div>

              <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
                <Download className="h-4 w-4 mr-2" />
                Export Statement
              </Button>
            </div>
          </div>
        </section>

        {/* Earnings Summary Cards */}
        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5 rounded-2xl border border-border/60 bg-background/80 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Total Earnings
                </p>
                <Wallet className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                ₦{sampleEarnings.totalEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </Card>

            <Card className="p-5 rounded-2xl border border-border/60 bg-background/80 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  This Month
                </p>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                ₦{sampleEarnings.thisMonthEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-600 mt-1 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +18% from last month
              </p>
            </Card>

            <Card className="p-5 rounded-2xl border border-border/60 bg-background/80 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Pending Payout
                </p>
                <Calendar className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-600">
                ₦{sampleEarnings.pendingEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Processing</p>
            </Card>

            <Card className="p-5 rounded-2xl border border-border/60 bg-background/80 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Commissions
                </p>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                ₦{sampleEarnings.commissionEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {sampleEarnings.conversionRate}% conversion rate
              </p>
            </Card>
          </div>
        </section>

        {/* Earnings Breakdown */}
        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 pb-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-5 rounded-2xl border border-border/60 bg-background/80 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Inspections</p>
                  <p className="text-xs text-muted-foreground">
                    {sampleEarnings.totalInspections} completed
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">
                ₦{sampleEarnings.inspectionEarnings.toLocaleString()}
              </p>
            </Card>

            <Card className="p-5 rounded-2xl border border-border/60 bg-background/80 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Viewings</p>
                  <p className="text-xs text-muted-foreground">
                    {sampleEarnings.totalViewings} conducted
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">
                ₦{(sampleEarnings.totalViewings * 5000).toLocaleString()}
              </p>
            </Card>

            <Card className="p-5 rounded-2xl border border-border/60 bg-background/80 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Commissions</p>
                  <p className="text-xs text-muted-foreground">
                    From signed leases
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-emerald-600">
                ₦{sampleEarnings.commissionEarnings.toLocaleString()}
              </p>
            </Card>
          </div>
        </section>

        {/* Transaction History */}
        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-8 pb-12">
          <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm">
            <div className="p-5 border-b border-border/50">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Transaction History
              </h2>
              <div className="flex flex-wrap gap-2">
                {(['all', 'inspection', 'viewing', 'commission'] as FilterType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-all',
                      filterType === type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border/60">
              {filteredTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                      {getTypeIcon(txn.type)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {txn.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {txn.propertyTitle} • {txn.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(txn.status)}
                    <p
                      className={cn(
                        'text-lg font-bold',
                        txn.status === 'paid' ? 'text-emerald-600' : 'text-foreground'
                      )}
                    >
                      {txn.status === 'paid' ? '+' : ''}₦{txn.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              )}
            </div>
          </Card>
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}


import { useState, useMemo } from 'react'
import { AdminLayout } from '@/widgets/admin-layout'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import {
  ArrowLeft,
  Search,
  Download,
  Building2,
  User,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { mockIncomeExpenseEntries } from '@/__mocks__/data/landlord.mock'
import type { IncomeExpenseEntry } from '@/shared/types/landlord.types'

// Mock data with landlord/realtor info
interface FinancialEntry extends IncomeExpenseEntry {
  enteredBy: {
    id: string
    name: string
    role: 'landlord' | 'realtor'
    email: string
  }
  propertyOwner: {
    id: string
    name: string
  }
}

// Mock financial entries with landlord/realtor info
const mockFinancialEntries: FinancialEntry[] = mockIncomeExpenseEntries.map((entry, index) => ({
  ...entry,
  enteredBy: {
    id: index % 2 === 0 ? 'landlord-1' : 'realtor-1',
    name: index % 2 === 0 ? 'John Landlord' : 'Sarah Realtor',
    role: index % 2 === 0 ? 'landlord' : 'realtor',
    email: index % 2 === 0 ? 'john@example.com' : 'sarah@example.com',
  },
  propertyOwner: {
    id: 'owner-1',
    name: 'Property Owner Name',
  },
}))

export function AdminFinancialsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyFilter, setPropertyFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | 'landlord' | 'realtor'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')

  const filteredEntries = useMemo(() => {
    let filtered = mockFinancialEntries

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.propertyName.toLowerCase().includes(query) ||
          entry.description.toLowerCase().includes(query) ||
          entry.enteredBy.name.toLowerCase().includes(query) ||
          entry.propertyOwner.name.toLowerCase().includes(query)
      )
    }

    if (propertyFilter !== 'all') {
      filtered = filtered.filter((entry) => entry.propertyId === propertyFilter)
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((entry) => entry.enteredBy.role === roleFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((entry) => entry.type === typeFilter)
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [searchQuery, propertyFilter, roleFilter, typeFilter])

  const summary = useMemo(() => {
    const totalIncome = filteredEntries
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0)
    const totalExpenses = filteredEntries
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0)
    const netProfit = totalIncome - totalExpenses
    const uniqueProperties = new Set(filteredEntries.map((e) => e.propertyId)).size
    const uniqueLandlords = new Set(
      filteredEntries.filter((e) => e.enteredBy.role === 'landlord').map((e) => e.enteredBy.id)
    ).size
    const uniqueRealtors = new Set(
      filteredEntries.filter((e) => e.enteredBy.role === 'realtor').map((e) => e.enteredBy.id)
    ).size

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      uniqueProperties,
      uniqueLandlords,
      uniqueRealtors,
      totalEntries: filteredEntries.length,
    }
  }, [filteredEntries])

  const uniqueProperties = useMemo(() => {
    const props = new Map<string, string>()
    mockFinancialEntries.forEach((entry) => {
      if (!props.has(entry.propertyId)) {
        props.set(entry.propertyId, entry.propertyName)
      }
    })
    return Array.from(props.entries()).map(([id, name]) => ({ id, name }))
  }, [])

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1">
          {/* Header Section */}
          <section className="border-b border-border/60 bg-gradient-to-br from-emerald-500/5 via-background to-background">
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
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                        Income & Expenditure Overview
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        View financial records across all properties and landlords/realtors
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Summary Cards */}
          <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card className="p-4 rounded-xl border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{summary.totalIncome > 0 ? `₦${(summary.totalIncome / 1_000_000).toFixed(1)}M` : '₦0'}</p>
                    <p className="text-xs text-muted-foreground">Total Income</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 rounded-xl border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{summary.totalExpenses > 0 ? `₦${(summary.totalExpenses / 1_000_000).toFixed(1)}M` : '₦0'}</p>
                    <p className="text-xs text-muted-foreground">Total Expenses</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 rounded-xl border border-border/60">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center',
                    summary.netProfit >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                  )}>
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={cn(
                      'text-2xl font-bold',
                      summary.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'
                    )}>
                      {summary.netProfit >= 0 ? '+' : ''}₦{Math.abs(summary.netProfit / 1_000_000).toFixed(1)}M
                    </p>
                    <p className="text-xs text-muted-foreground">Net Profit</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 rounded-xl border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{summary.uniqueProperties}</p>
                    <p className="text-xs text-muted-foreground">Properties</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search properties, descriptions, or users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>
              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                <SelectTrigger className="w-[180px] rounded-xl">
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {uniqueProperties.map((prop) => (
                    <SelectItem key={prop.id} value={prop.id}>
                      {prop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val as typeof roleFilter)}>
                <SelectTrigger className="w-[150px] rounded-xl">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="landlord">Landlord</SelectItem>
                  <SelectItem value="realtor">Realtor</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val as typeof typeFilter)}>
                <SelectTrigger className="w-[140px] rounded-xl">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-xl" onClick={() => toast.success('Exporting CSV...')}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Financial Table */}
            <Card className="rounded-2xl border border-border/60 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Property</TableHead>
                      <TableHead className="font-semibold">Description</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Entered By</TableHead>
                      <TableHead className="font-semibold text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-muted/20">
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(entry.date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{entry.propertyName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {entry.category || 'General'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              'text-xs',
                              entry.type === 'income'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                : 'bg-red-500/10 text-red-600 border-red-500/20'
                            )}
                          >
                            {entry.type === 'income' ? 'Income' : 'Expense'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{entry.enteredBy.name}</p>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[10px] mt-0.5',
                                  entry.enteredBy.role === 'landlord'
                                    ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                    : 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                                )}
                              >
                                {entry.enteredBy.role}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={cn(
                          'text-right font-bold whitespace-nowrap',
                          entry.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                        )}>
                          {entry.type === 'income' ? '+' : '-'}₦{entry.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredEntries.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          No financial entries found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Stats Footer */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4 rounded-xl border border-border/60">
                <p className="text-xs text-muted-foreground mb-1">Total Entries</p>
                <p className="text-2xl font-bold">{summary.totalEntries}</p>
              </Card>
              <Card className="p-4 rounded-xl border border-border/60">
                <p className="text-xs text-muted-foreground mb-1">Landlords</p>
                <p className="text-2xl font-bold">{summary.uniqueLandlords}</p>
              </Card>
              <Card className="p-4 rounded-xl border border-border/60">
                <p className="text-xs text-muted-foreground mb-1">Realtors</p>
                <p className="text-2xl font-bold">{summary.uniqueRealtors}</p>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </AdminLayout>
  )
}

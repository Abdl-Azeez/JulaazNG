import { useMemo, useState, useEffect } from 'react'
import { Plus, MoreVertical, Clock, Sparkles, TrendingUp, Building2, FileText, ShieldCheck, MapPin, Eye, Users, BarChart3, Receipt, Upload } from 'lucide-react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AuthDialog } from '@/widgets/auth-dialog'
import { useAuthStore } from '@/shared/store/auth.store'
import { LandlordNav } from '@/widgets/landlord-nav'
import { landlordProperties, mockPropertyExpenses } from '@/__mocks__/data/landlord.mock'
import type { LandlordProperty, PropertyExpense, ExpenseCategory } from '@/shared/types/landlord.types'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

// Custom hook for media query
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

const statusConfig: Record<LandlordProperty['status'], { label: string; tone: string; glow: string }> = {
  active: {
    label: 'Active',
    tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
    glow: 'after:bg-emerald-500/40',
  },
  inactive: {
    label: 'Inactive',
    tone: 'bg-muted text-muted-foreground border-border/40',
    glow: 'after:bg-muted/20',
  },
  reserved: {
    label: 'Reserved',
    tone: 'bg-primary/10 text-primary border-primary/20',
    glow: 'after:bg-primary/30',
  },
  rented: {
    label: 'Rented',
    tone: 'bg-accent/10 text-accent border-accent/20',
    glow: 'after:bg-accent/30',
  },
}

export function LandlordPropertiesPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isExpenseSheetOpen, setIsExpenseSheetOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<LandlordProperty | null>(null)
  const [expenses, setExpenses] = useState<PropertyExpense[]>(mockPropertyExpenses)
  const [expenseForm, setExpenseForm] = useState({
    category: '' as ExpenseCategory | '',
    description: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    vendor: '',
    notes: '',
    receiptFile: null as File | null,
  })

  const expenseCategories: { value: ExpenseCategory; label: string }[] = [
    { value: 'renovation', label: 'Renovation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'repair', label: 'Repair' },
    { value: 'facility_addition', label: 'Facility Addition' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'appliances', label: 'Appliances' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'taxes', label: 'Taxes' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'security', label: 'Security' },
    { value: 'other', label: 'Other' },
  ]

  const handleExpenseSubmit = () => {
    if (!selectedProperty || !expenseForm.category || !expenseForm.description || !expenseForm.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    const newExpense: PropertyExpense = {
      id: `expense_${Date.now()}`,
      propertyId: selectedProperty.id,
      propertyName: selectedProperty.name,
      category: expenseForm.category as ExpenseCategory,
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount),
      date: expenseForm.date,
      vendor: expenseForm.vendor,
      notes: expenseForm.notes,
      receiptName: expenseForm.receiptFile?.name,
      receiptUrl: expenseForm.receiptFile ? URL.createObjectURL(expenseForm.receiptFile) : undefined,
      createdAt: new Date().toISOString(),
    }

    setExpenses(prev => [newExpense, ...prev])
    setExpenseForm({
      category: '',
      description: '',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      vendor: '',
      notes: '',
      receiptFile: null,
    })
    setIsExpenseSheetOpen(false)
    toast.success(`Expense logged for ${selectedProperty.name}`)
  }

  const ExpenseFormContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="expense-category">Category *</Label>
          <Select
            value={expenseForm.category}
            onValueChange={(value) => setExpenseForm(prev => ({ ...prev, category: value as ExpenseCategory }))}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select expense category" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="expense-amount">Amount (₦) *</Label>
          <Input
            id="expense-amount"
            type="number"
            placeholder="0.00"
            value={expenseForm.amount}
            onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expense-description">Description *</Label>
        <Input
          id="expense-description"
          placeholder="Brief description of the expense"
          value={expenseForm.description}
          onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
          className="rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="expense-date">Date</Label>
          <Input
            id="expense-date"
            type="date"
            value={expenseForm.date}
            onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expense-vendor">Vendor/Supplier</Label>
          <Input
            id="expense-vendor"
            placeholder="Name of vendor or supplier"
            value={expenseForm.vendor}
            onChange={(e) => setExpenseForm(prev => ({ ...prev, vendor: e.target.value }))}
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expense-receipt">Receipt Upload</Label>
        <div className="relative">
          <Input
            id="expense-receipt"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setExpenseForm(prev => ({ ...prev, receiptFile: e.target.files?.[0] || null }))}
            className="rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Upload className="h-3.5 w-3.5" />
            <span>Accepted formats: JPG, PNG, PDF (Max 5MB)</span>
          </div>
          {expenseForm.receiptFile && (
            <p className="text-sm text-primary mt-1">
              Selected: {expenseForm.receiptFile.name}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expense-notes">Additional Notes</Label>
        <Textarea
          id="expense-notes"
          placeholder="Any additional details about this expense..."
          value={expenseForm.notes}
          onChange={(e) => setExpenseForm(prev => ({ ...prev, notes: e.target.value }))}
          className="rounded-xl min-h-[80px]"
        />
      </div>

      {/* Recent Expenses for this Property */}
      {selectedProperty && (
        <div className="space-y-4 pt-4 border-t border-border/60">
          <h4 className="text-sm font-semibold text-foreground">Recent Expenses</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {expenses
              .filter(expense => expense.propertyId === selectedProperty.id)
              .slice(0, 3)
              .map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(expense.date), 'MMM d, yyyy')} • {expense.category}</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">₦{expense.amount.toLocaleString()}</p>
                </div>
              ))}
            {expenses.filter(expense => expense.propertyId === selectedProperty.id).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No expenses recorded yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const openExpenseSheet = (property: LandlordProperty) => {
    setSelectedProperty(property)
    setIsExpenseSheetOpen(true)
  }

  const heroMetrics = useMemo(
    () => {
      const active = landlordProperties.filter((p) => p.status === 'active').length
      const occupancy = Math.round(
        landlordProperties.reduce((acc, curr) => acc + curr.occupancyRate, 0) / landlordProperties.length
      )
      const applications = landlordProperties.reduce((acc, curr) => acc + curr.applications, 0)
      const inspectionQueue = landlordProperties.filter((p) => p.status === 'inactive' || p.status === 'reserved').length
      const totalRevenue = landlordProperties.reduce((acc, curr) => {
        const price = parseInt(curr.priceLabel.replace(/[^\d]/g, '')) || 0
        return acc + price
      }, 0)

      return {
        active,
        occupancy,
        applications,
        inspectionQueue,
        totalRevenue,
        cards: [
          {
            label: 'Active Listings',
            value: active,
            subtitle: `${landlordProperties.length} total`,
            accent: 'from-primary/20 to-primary/5',
            icon: <Building2 className="h-5 w-5 text-primary" />,
            bg: 'bg-primary/5',
            trend: '+2 this month',
          },
          {
            label: 'Portfolio Occupancy',
            value: `${occupancy}%`,
            subtitle: 'Average across all',
            accent: 'from-accent/20 to-accent/5',
            icon: <TrendingUp className="h-5 w-5 text-accent" />,
            bg: 'bg-accent/5',
            trend: '+5% vs last quarter',
          },
          {
            label: 'Live Applications',
            value: applications,
            subtitle: 'Awaiting review',
            accent: 'from-emerald-500/20 to-emerald-500/5',
            icon: <FileText className="h-5 w-5 text-emerald-500" />,
            bg: 'bg-emerald-500/5',
            trend: '12 new today',
          },
          {
            label: 'Inspection Queue',
            value: inspectionQueue,
            subtitle: 'Needs attention',
            accent: 'from-primary/15 via-primary/5 to-transparent',
            icon: <ShieldCheck className="h-5 w-5 text-primary" />,
            bg: 'bg-primary/5',
            trend: '2 pending',
          },
        ],
      }
    },
    []
  )

  const handleMenuClick = () => setIsSidebarOpen(true)
  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setIsDrawerOpen(true)
    } else {
      navigate(ROUTES.PROFILE)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted relative">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-br from-primary/15 via-background to-accent/10 blur-3xl opacity-80 pointer-events-none" />

      <main className="relative z-10 flex-1 pb-28 lg:pb-16">
        <section className="container mx-auto px-4 lg:px-6 xl:px-8 max-w-7xl py-6 lg:py-10 space-y-6">
          {/* Hero Dashboard Header */}
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/8 via-surface to-background shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.25),_transparent_55%)]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 lg:p-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-xl border border-primary/20 shadow-lg">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-primary uppercase tracking-[0.25em]">
                    Property Portfolio
                  </p>
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">
                    My Properties
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Manage your entire property portfolio, track performance metrics, and optimize occupancy rates across all listings.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-600">{heroMetrics.active}</span>
                    <span className="text-muted-foreground">active listings</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">{heroMetrics.applications}</span>
                    <span className="text-muted-foreground">applications</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20">
                    <BarChart3 className="h-4 w-4 text-accent" />
                    <span className="font-semibold text-accent">{heroMetrics.occupancy}%</span>
                    <span className="text-muted-foreground">occupancy</span>
                  </div>
                </div>
              </div>
              <Button
                className="h-14 rounded-2xl px-8 shadow-xl hover:shadow-2xl bg-primary text-primary-foreground gap-2 text-base font-semibold"
                onClick={() => navigate(ROUTES.LANDLORD_PROPERTY_CREATE)}
              >
                <Plus className="h-5 w-5" />
                Post New Property
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-primary font-semibold">Ratings drive occupancy</p>
                <p className="text-sm text-muted-foreground">Show your 4.7★+ host score across listings to attract premium tenants.</p>
              </div>
            </Card>
            <Card className="rounded-2xl border border-amber-300/50 bg-amber-50 p-4 flex items-start gap-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-semibold">₦</div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-amber-700 font-semibold">Flex rent terms</p>
                <p className="text-sm text-muted-foreground">Offer monthly, quarterly, 6-month or annual plans; we display terms per listing automatically.</p>
              </div>
            </Card>
          </div>

          {/* KPI Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {heroMetrics.cards.map((metric) => (
              <div
                key={metric.label}
                className="group relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br', metric.accent)} />
                <div className="relative p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      {metric.label}
                    </span>
                    <div className={cn('p-3 rounded-2xl border border-border/50 shadow-inner', metric.bg)}>
                      {metric.icon}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-foreground">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600">{metric.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Properties Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">All Properties</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{landlordProperties.length} listings</span>
              </div>
            </div>
            <div className="grid gap-4 lg:gap-6">
              {landlordProperties.map((property) => {
                const config = statusConfig[property.status]
                return (
                  <article
                    key={property.id}
                    onClick={() => navigate(ROUTES.LANDLORD_PROPERTY_DETAILS(property.id))}
                    className="group relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-[0_25px_45px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
                    <div className="relative flex gap-6 p-6">
                      <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden flex-shrink-0">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <span
                          className={cn(
                            'absolute top-3 left-3 px-3 py-1.5 text-xs font-bold rounded-xl border backdrop-blur-lg shadow-lg',
                            config.tone,
                            'relative after:absolute after:-inset-1 after:rounded-xl after:opacity-0 group-hover:after:opacity-60 after:blur-md after:-z-10 transition-opacity',
                            config.glow
                          )}
                        >
                          {config.label}
                        </span>
                      </div>

                      <div className="flex-1 space-y-4 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight mb-1">
                              {property.name}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{property.location}</span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="h-10 w-10 rounded-2xl border border-border/60 bg-background/70 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors flex-shrink-0"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <MoreVertical className="h-5 w-5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-border/60">
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  navigate(ROUTES.LANDLORD_PROPERTY_INSIGHTS(property.id))
                                }}
                              >
                                <FileText className="h-4 w-4" />
                                View insights
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  navigate(ROUTES.LANDLORD_PROPERTY_MANAGE(property.id))
                                }}
                              >
                                <Building2 className="h-4 w-4" />
                                Manage listing
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  openExpenseSheet(property)
                                }}
                              >
                                <Receipt className="h-4 w-4" />
                                Log expense
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Badge className="rounded-full bg-primary/10 text-primary border-0 px-4 py-1.5 font-semibold">
                            {property.priceLabel}
                          </Badge>
                          <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-0 px-4 py-1.5 font-semibold">
                            {property.applications} Applications
                          </Badge>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            Updated {property.lastUpdated}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">Occupancy Rate</span>
                            <span className="font-bold text-foreground">{property.occupancyRate}%</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-muted/60 overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                property.occupancyRate >= 80
                                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                  : property.occupancyRate >= 40
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                                    : 'bg-gradient-to-r from-destructive to-destructive/80'
                              )}
                              style={{ width: `${property.occupancyRate}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground/80">
                            Based on confirmed bookings vs availability (annual leases + shortlets)
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <LandlordNav />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <Footer />

      {/* Expense Logging - Responsive (Dialog for Desktop, Sheet for Mobile) */}
      {isDesktop ? (
        <Dialog open={isExpenseSheetOpen} onOpenChange={setIsExpenseSheetOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[32px] p-0 border-none bg-surface/95 backdrop-blur-xl shadow-2xl">
            <DialogHeader className="px-8 pt-8 pb-4 border-b border-border/60">
              <DialogTitle className="text-2xl font-bold">Log Property Expense</DialogTitle>
              {selectedProperty && (
                <p className="text-sm text-muted-foreground">
                  Adding expense for <span className="font-semibold text-foreground">{selectedProperty.name}</span>
                </p>
              )}
            </DialogHeader>
            <div className="px-8 py-6">
              <ExpenseFormContent />
            </div>
            <DialogFooter className="px-8 pb-8 pt-4 border-t border-border/60 flex sm:justify-between gap-4">
              <Button
                variant="outline"
                className="rounded-2xl flex-1 h-12 font-semibold"
                onClick={() => setIsExpenseSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-2xl flex-1 h-12 font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                onClick={handleExpenseSubmit}
              >
                Log Expense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={isExpenseSheetOpen} onOpenChange={setIsExpenseSheetOpen}>
          <SheetContent 
            side="bottom" 
            className="w-full h-[85vh] max-h-[85vh] rounded-t-[32px] flex flex-col p-0 border-none bg-surface/95 backdrop-blur-xl"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/60 flex-shrink-0">
              <SheetTitle className="text-xl font-bold">Log Property Expense</SheetTitle>
              {selectedProperty && (
                <p className="text-sm text-muted-foreground">
                  Adding expense for <span className="font-semibold text-foreground">{selectedProperty.name}</span>
                </p>
              )}
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <ExpenseFormContent />
            </div>
            <SheetFooter className="px-6 pb-8 pt-4 border-t border-border/60 flex-shrink-0">
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="rounded-2xl flex-1 h-12 font-semibold"
                  onClick={() => setIsExpenseSheetOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-2xl flex-1 h-12 font-semibold bg-primary text-primary-foreground"
                  onClick={handleExpenseSubmit}
                >
                  Log Expense
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

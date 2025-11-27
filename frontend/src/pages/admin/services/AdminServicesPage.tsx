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
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  Wrench,
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  User,
  Eye,
  Edit,
  Ban,
  Trash2,
  Zap,
  Droplet,
  Paintbrush,
  ShieldCheck,
  Hammer,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Calendar,
  ExternalLink,
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

interface Service {
  id: string
  name: string
  category: 'electrical' | 'plumbing' | 'painting' | 'cleaning' | 'repairs'
  provider: string
  providerId: string
  status: 'active' | 'pending' | 'suspended' | 'rejected'
  verified: boolean
  rating: number
  totalBookings: number
  completedBookings: number
  price: { min: number; max: number }
  createdAt: string
  lastActive: string
  description?: string
  location?: string
}

// Expanded sample data for pagination demo
const generateSampleServices = (): Service[] => {
  const categories: Service['category'][] = ['electrical', 'plumbing', 'painting', 'cleaning', 'repairs']
  const statuses: Service['status'][] = ['active', 'pending', 'suspended', 'rejected']
  const providers = [
    'Kunle Balogun',
    'Emeka Okoro',
    'Grace Eze',
    'Sarah Ike',
    'Michael Obi',
    'David Adeyemi',
    'Chioma Nwosu',
    'Femi Ogunleye',
  ]
  const locations = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano']

  return Array.from({ length: 38 }, (_, i) => ({
    id: `service-${i + 1}`,
    name: `${categories[Math.floor(Math.random() * categories.length)]} Service ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    provider: providers[Math.floor(Math.random() * providers.length)],
    providerId: `SP${String(i + 1).padStart(3, '0')}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    verified: Math.random() > 0.3,
    rating: Math.random() > 0.2 ? Math.round((Math.random() * 2 + 3) * 10) / 10 : 0,
    totalBookings: Math.floor(Math.random() * 300),
    completedBookings: Math.floor(Math.random() * 280),
    price: {
      min: Math.floor(Math.random() * 100000) + 5000,
      max: Math.floor(Math.random() * 500000) + 50000,
    },
    createdAt: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .split('T')[0],
    lastActive: `${Math.floor(Math.random() * 7)} days ago`,
    description: 'Professional service with excellent customer satisfaction.',
    location: locations[Math.floor(Math.random() * locations.length)],
  }))
}

const sampleServices = generateSampleServices()

const statusColors: Record<Service['status'], string> = {
  active: 'bg-emerald-500/10 text-emerald-600',
  pending: 'bg-amber-500/10 text-amber-600',
  suspended: 'bg-red-500/10 text-red-600',
  rejected: 'bg-gray-500/10 text-gray-600',
}

const statusIcons: Record<Service['status'], React.ReactNode> = {
  active: <CheckCircle className="h-3 w-3" />,
  pending: <Clock className="h-3 w-3" />,
  suspended: <AlertTriangle className="h-3 w-3" />,
  rejected: <XCircle className="h-3 w-3" />,
}

const categoryIcons: Record<Service['category'], React.ReactNode> = {
  electrical: <Zap className="h-5 w-5 text-amber-600" />,
  plumbing: <Droplet className="h-5 w-5 text-blue-600" />,
  painting: <Paintbrush className="h-5 w-5 text-purple-600" />,
  cleaning: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
  repairs: <Hammer className="h-5 w-5 text-orange-600" />,
}

const categoryColors: Record<Service['category'], string> = {
  electrical: 'bg-amber-500/10 text-amber-600',
  plumbing: 'bg-blue-500/10 text-blue-600',
  painting: 'bg-purple-500/10 text-purple-600',
  cleaning: 'bg-emerald-500/10 text-emerald-600',
  repairs: 'bg-orange-500/10 text-orange-600',
}

const ITEMS_PER_PAGE = 12

export function AdminServicesPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Service['status'] | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<Service['category'] | 'all'>('all')
  const [services, setServices] = useState<Service[]>(sampleServices)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.provider.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || service.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [services, searchQuery, statusFilter, categoryFilter])

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE)
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, categoryFilter])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleViewService = (service: Service) => {
    setSelectedService(service)
    setIsViewDialogOpen(true)
  }

  const handleViewDetails = (service: Service) => {
    // Navigate to service journey page
    const slug = service.name.toLowerCase().replace(/\s+/g, '-')
    navigate(ROUTES.SERVICE_JOURNEY(slug))
  }

  const handleEditService = (service: Service) => {
    toast.success(`Opening edit page for ${service.name}`)
    // In real app: navigate(ROUTES.ADMIN_SERVICE_EDIT(service.id))
  }

  const handleApproveService = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: 'active' as const, verified: true } : s))
    )
    toast.success('Service approved and activated')
  }

  const handleRejectService = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: 'rejected' as const } : s))
    )
    toast.success('Service rejected')
  }

  const handleSuspendService = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: 'suspended' as const } : s))
    )
    toast.success('Service suspended')
  }

  const handleReactivateService = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: 'active' as const } : s))
    )
    toast.success('Service reactivated')
  }

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId))
    toast.success('Service deleted')
    setIsViewDialogOpen(false)
  }

  const stats = useMemo(() => {
    const activeServices = services.filter((s) => s.status === 'active')
    const avgRating =
      activeServices.length > 0
        ? activeServices.reduce((sum, s) => sum + (s.rating || 0), 0) / activeServices.length
        : 0

    return {
      total: services.length,
      active: services.filter((s) => s.status === 'active').length,
      pending: services.filter((s) => s.status === 'pending').length,
      providers: new Set(services.map((s) => s.providerId)).size,
      avgRating: avgRating.toFixed(1),
    }
  }, [services])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => navigate(ROUTES.PROFILE)}
        className="lg:shadow-sm"
      />

      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-amber-500/5 via-background to-background">
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
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Service Management</h1>
                    <p className="text-sm text-muted-foreground">
                      {filteredServices.length} services • Manage service providers and their offerings
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Badge className="rounded-full bg-amber-500/10 text-amber-600 px-3 py-1.5">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  {stats.pending} Pending Approval
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-blue-500/5 to-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.total.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Services</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Wrench className="h-6 w-6" />
                </div>
              </div>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/5 to-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.active.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-amber-500/5 to-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.pending.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Pending</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-purple-500/5 to-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.providers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Providers</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
              </div>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-yellow-500/5 to-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.avgRating}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Rating</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-yellow-500/10 text-yellow-600 flex items-center justify-center">
                  <Star className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services or providers..."
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
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('suspended')}>Suspended</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>Rejected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  Category: {categoryFilter === 'all' ? 'All' : categoryFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCategoryFilter('all')}>All Categories</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCategoryFilter('electrical')}>Electrical</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter('plumbing')}>Plumbing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter('painting')}>Painting</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter('cleaning')}>Cleaning</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter('repairs')}>Repairs</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-6 lg:pb-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedServices.map((service) => (
              <Card
                key={service.id}
                className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={cn(
                        'h-12 w-12 rounded-xl flex items-center justify-center shrink-0',
                        categoryColors[service.category].replace('text-', 'bg-').replace('600', '500/10')
                      )}
                    >
                      {categoryIcons[service.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge className={cn('rounded-full capitalize mb-1.5 text-[10px]', categoryColors[service.category])}>
                        {service.category}
                      </Badge>
                      <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight">{service.name}</h3>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewService(service)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewDetails(service)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Public Page
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditService(service)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Service
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {service.status === 'active' ? (
                        <DropdownMenuItem
                          className="text-amber-600"
                          onClick={() => handleSuspendService(service.id)}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend
                        </DropdownMenuItem>
                      ) : service.status === 'suspended' ? (
                        <DropdownMenuItem
                          className="text-emerald-600"
                          onClick={() => handleReactivateService(service.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Reactivate
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteService(service.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span className="line-clamp-1">{service.provider}</span>
                    </span>
                    {service.verified && (
                      <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 text-[10px]">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      className={cn('rounded-full capitalize flex items-center gap-1 text-[10px]', statusColors[service.status])}
                    >
                      {statusIcons[service.status]}
                      {service.status}
                    </Badge>
                    {service.rating > 0 && (
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{service.rating}</span>
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/60">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        {service.completedBookings}/{service.totalBookings} bookings
                      </span>
                      <span className="font-medium text-foreground">
                        {formatPrice(service.price.min)} - {formatPrice(service.price.max)}
                      </span>
                    </div>
                  </div>

                  {service.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleApproveService(service.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-lg text-red-600 border-red-600/30 hover:bg-red-50"
                        onClick={() => handleRejectService(service.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg"
                        onClick={() => handleViewService(service)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <Wrench className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">No services found matching your criteria</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/60">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredServices.length)} of {filteredServices.length} services
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

      {/* Service View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-xl flex items-center justify-center',
                      categoryColors[selectedService.category].replace('text-', 'bg-').replace('600', '500/10')
                    )}
                  >
                    {categoryIcons[selectedService.category]}
                  </div>
                  {selectedService.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedService.category} • {selectedService.location || 'Location not specified'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Status & Info */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={cn('rounded-full capitalize', statusColors[selectedService.status])}>
                    {statusIcons[selectedService.status]}
                    {selectedService.status}
                  </Badge>
                  <Badge className={cn('rounded-full capitalize', categoryColors[selectedService.category])}>
                    {selectedService.category}
                  </Badge>
                  {selectedService.verified && (
                    <Badge className="rounded-full bg-emerald-500/10 text-emerald-600">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {selectedService.rating > 0 && (
                    <Badge className="rounded-full bg-yellow-500/10 text-yellow-600">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400" />
                      {selectedService.rating}
                    </Badge>
                  )}
                </div>

                {/* Service Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card className="p-4 rounded-xl border border-border/60">
                    <DollarSign className="h-5 w-5 text-primary mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Price Range</p>
                    <p className="text-sm font-bold">
                      {formatPrice(selectedService.price.min)} - {formatPrice(selectedService.price.max)}
                    </p>
                  </Card>
                  <Card className="p-4 rounded-xl border border-border/60">
                    <Calendar className="h-5 w-5 text-blue-600 mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Total Bookings</p>
                    <p className="text-lg font-bold">{selectedService.totalBookings}</p>
                  </Card>
                  <Card className="p-4 rounded-xl border border-border/60">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Completed</p>
                    <p className="text-lg font-bold">{selectedService.completedBookings}</p>
                  </Card>
                  <Card className="p-4 rounded-xl border border-border/60">
                    <TrendingUp className="h-5 w-5 text-purple-600 mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                    <p className="text-lg font-bold">
                      {selectedService.totalBookings > 0
                        ? Math.round((selectedService.completedBookings / selectedService.totalBookings) * 100)
                        : 0}
                      %
                    </p>
                  </Card>
                </div>

                {/* Provider Info */}
                <Card className="p-4 rounded-xl border border-border/60">
                  <h4 className="text-sm font-semibold mb-3">Provider Information</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedService.provider}</p>
                      <p className="text-xs text-muted-foreground">ID: {selectedService.providerId}</p>
                      <p className="text-xs text-muted-foreground">Last active: {selectedService.lastActive}</p>
                    </div>
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border/60">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => handleViewDetails(selectedService)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Public Page
                  </Button>
                  <Button variant="outline" className="rounded-xl" onClick={() => handleEditService(selectedService)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Service
                  </Button>
                  {selectedService.status === 'pending' && (
                    <>
                      <Button
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          handleApproveService(selectedService.id)
                          setIsViewDialogOpen(false)
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl text-red-600 border-red-600/30 hover:bg-red-50"
                        onClick={() => {
                          handleRejectService(selectedService.id)
                          setIsViewDialogOpen(false)
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {selectedService.status === 'active' && (
                    <Button
                      variant="outline"
                      className="rounded-xl text-amber-600 border-amber-600/30 hover:bg-amber-50"
                      onClick={() => {
                        handleSuspendService(selectedService.id)
                        setIsViewDialogOpen(false)
                      }}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                  )}
                  {selectedService.status === 'suspended' && (
                    <Button
                      variant="outline"
                      className="rounded-xl text-emerald-600 border-emerald-600/30 hover:bg-emerald-50"
                      onClick={() => {
                        handleReactivateService(selectedService.id)
                        setIsViewDialogOpen(false)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Reactivate
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="rounded-xl text-red-600 border-red-600/30 hover:bg-red-50"
                    onClick={() => handleDeleteService(selectedService.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

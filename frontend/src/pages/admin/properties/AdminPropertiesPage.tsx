import { useState, useMemo } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import {
  Building2,
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  User,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
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
import home1 from '@/assets/images/home1.jpg'
import home2 from '@/assets/images/home2.jpg'
import home3 from '@/assets/images/home3.jpg'
import home4 from '@/assets/images/home4.jpg'
import home5 from '@/assets/images/home5.jpg'
import home6 from '@/assets/images/home6.jpg'
import home7 from '@/assets/images/home7.jpg'
import home8 from '@/assets/images/home8.jpg'

interface Property {
  id: string
  title: string
  address: string
  type: 'apartment' | 'house' | 'duplex' | 'studio' | 'office'
  price: number
  landlord: string
  landlordId: string
  status: 'active' | 'pending' | 'suspended' | 'rejected'
  verified: boolean
  createdAt: string
  views: number
  bookings: number
  images: string[]
  description?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  parking?: number
  amenities?: string[]
  neighbourhood?: string
  city?: string
}

// Sample images array
const sampleImageArray = [home1, home2, home3, home4, home5, home6, home7, home8]

// Expanded sample data for pagination demo
const generateSampleProperties = (): Property[] => {
  const types: Property['type'][] = ['apartment', 'house', 'duplex', 'studio', 'office']
  const statuses: Property['status'][] = ['active', 'pending', 'suspended', 'rejected']
  const landlords = ['Femi Ogunleye', 'Chioma Nwosu', 'Grace Eze', 'Kunle Balogun', 'Tosin Adeyemi', 'Aisha Mohammed', 'David Okoro']
  const addresses = ['Lekki Phase 1', 'Victoria Island', 'Ikeja GRA', 'Surulere', 'Banana Island', 'Ikoyi', 'Yaba']
  const neighbourhoods = ['Lekki', 'Victoria Island', 'Ikeja', 'Surulere', 'Banana Island', 'Ikoyi', 'Yaba']
  const amenitiesList = [
    ['24/7 Power Supply', 'Fibre Internet', 'Parking', 'CCTV'],
    ['Swimming Pool', 'Gym', 'Security', 'Water Supply'],
    ['Smart Home', 'Balcony', 'Garden', 'Elevator'],
    ['Air Conditioning', 'Heating', 'Laundry', 'Storage'],
  ]
  
  return Array.from({ length: 45 }, (_, i) => {
    const imageCount = Math.floor(Math.random() * 5) + 3
    const selectedImages = Array.from({ length: imageCount }, () => 
      sampleImageArray[Math.floor(Math.random() * sampleImageArray.length)]
    )
    
    return {
      id: `${i + 1}`,
      title: `${Math.floor(Math.random() * 5) + 1} Bedroom ${types[Math.floor(Math.random() * types.length)]}`,
      address: `${addresses[Math.floor(Math.random() * addresses.length)]}, Lagos`,
      type: types[Math.floor(Math.random() * types.length)],
      price: Math.floor(Math.random() * 15000000) + 500000,
      landlord: landlords[Math.floor(Math.random() * landlords.length)],
      landlordId: `L${String(i + 1).padStart(3, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      verified: Math.random() > 0.3,
      createdAt: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      views: Math.floor(Math.random() * 2000),
      bookings: Math.floor(Math.random() * 20),
      images: selectedImages,
      description: 'Beautiful property with modern amenities and great location. Perfect for families and professionals seeking comfort and convenience.',
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 4) + 1,
      area: Math.floor(Math.random() * 500) + 100,
      parking: Math.floor(Math.random() * 3) + 1,
      amenities: amenitiesList[Math.floor(Math.random() * amenitiesList.length)],
      neighbourhood: neighbourhoods[Math.floor(Math.random() * neighbourhoods.length)],
      city: 'Lagos',
    }
  })
}

const sampleProperties = generateSampleProperties()

const statusColors: Record<Property['status'], string> = {
  active: 'bg-emerald-500/10 text-emerald-600',
  pending: 'bg-amber-500/10 text-amber-600',
  suspended: 'bg-red-500/10 text-red-600',
  rejected: 'bg-gray-500/10 text-gray-600',
}

const statusIcons: Record<Property['status'], React.ReactNode> = {
  active: <CheckCircle className="h-3 w-3" />,
  pending: <Clock className="h-3 w-3" />,
  suspended: <AlertTriangle className="h-3 w-3" />,
  rejected: <XCircle className="h-3 w-3" />,
}

const ITEMS_PER_PAGE = 12

export function AdminPropertiesPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Property['status'] | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<Property['type'] | 'all'>('all')
  const [properties, setProperties] = useState<Property[]>(sampleProperties)
  const [currentPage, setCurrentPage] = useState(1)
  const [propertyImageIndices, setPropertyImageIndices] = useState<Record<string, number>>({})

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.landlord.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter
      const matchesType = typeFilter === 'all' || property.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [properties, searchQuery, statusFilter, typeFilter])

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, typeFilter])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleViewProperty = (property: Property) => {
    navigate(ROUTES.ADMIN_PROPERTY_DETAILS(property.id))
  }

  const handleViewListing = (property: Property) => {
    navigate(ROUTES.PROPERTY_DETAILS(property.id))
  }

  const handleEditProperty = (property: Property) => {
    // Navigate to edit page (would be admin-specific edit page)
    toast.success(`Opening edit page for ${property.title}`)
    // In real app: navigate(ROUTES.ADMIN_PROPERTY_EDIT(property.id))
  }

  const handleApproveProperty = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status: 'active' as const, verified: true } : p))
    )
    toast.success('Property approved and activated')
  }

  const handleRejectProperty = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status: 'rejected' as const } : p))
    )
    toast.success('Property rejected')
  }

  const handleSuspendProperty = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status: 'suspended' as const } : p))
    )
    toast.success('Property listing suspended')
  }

  const handleReactivateProperty = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status: 'active' as const } : p))
    )
    toast.success('Property reactivated')
  }

  const handleDeleteProperty = (propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId))
    toast.success('Property deleted')
  }

  const stats = useMemo(() => {
    return {
      total: properties.length,
      active: properties.filter((p) => p.status === 'active').length,
      pending: properties.filter((p) => p.status === 'pending').length,
      suspended: properties.filter((p) => p.status === 'suspended').length,
    }
  }, [properties])

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
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                      Property Management
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {filteredProperties.length} properties • Review, approve, and manage all listings
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Badge className="rounded-full bg-amber-500/10 text-amber-600 px-3 py-1.5">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  {stats.pending} Pending Review
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-blue-500/5 to-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.total.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Properties</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
              </div>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/5 to-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.active.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active Listings</p>
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
                  <p className="text-xs text-muted-foreground mt-1">Pending Approval</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-red-500/5 to-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.suspended.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Suspended</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6" />
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
                placeholder="Search properties, address, or landlord..."
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
                  Type: {typeFilter === 'all' ? 'All' : typeFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter('all')}>All Types</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTypeFilter('apartment')}>Apartment</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('house')}>House</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('duplex')}>Duplex</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('studio')}>Studio</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('office')}>Office</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-6 lg:pb-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedProperties.map((property) => (
              <Card
                key={property.id}
                className="rounded-2xl border border-border/60 bg-background/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Property Image Slider */}
                <div className="h-44 relative group overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <>
                      <img
                        src={property.images[propertyImageIndices[property.id] || 0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      {property.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setPropertyImageIndices((prev) => ({
                                ...prev,
                                [property.id]: ((prev[property.id] || 0) - 1 + property.images.length) % property.images.length,
                              }))
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 text-foreground backdrop-blur hover:bg-background transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setPropertyImageIndices((prev) => ({
                                ...prev,
                                [property.id]: ((prev[property.id] || 0) + 1) % property.images.length,
                              }))
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 text-foreground backdrop-blur hover:bg-background transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg"
                            aria-label="Next image"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {property.images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPropertyImageIndices((prev) => ({ ...prev, [property.id]: idx }))
                                }}
                                className={cn(
                                  'h-1.5 rounded-full transition-all',
                                  (propertyImageIndices[property.id] || 0) === idx
                                    ? 'w-4 bg-primary'
                                    : 'w-1.5 bg-background/60'
                                )}
                                aria-label={`Go to image ${idx + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="h-full bg-gradient-to-br from-muted via-muted/80 to-muted/50 flex items-center justify-center">
                      <Building2 className="h-14 w-14 text-muted-foreground/30" />
                    </div>
                  )}
                  <Badge
                    className={cn(
                      'absolute top-3 left-3 rounded-full flex items-center gap-1 shadow-sm z-10',
                      statusColors[property.status]
                    )}
                  >
                    {statusIcons[property.status]}
                    {property.status}
                  </Badge>
                  <Badge className="absolute top-3 right-3 rounded-full bg-background/90 text-foreground shadow-sm z-10">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    {property.images?.length || 0}
                  </Badge>
                  {property.verified && (
                    <Badge className="absolute bottom-3 left-3 rounded-full bg-emerald-500/90 text-white shadow-sm z-10">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-1 text-base">{property.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="line-clamp-1">{property.address}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(property.price)}
                      <span className="text-xs font-normal text-muted-foreground">/yr</span>
                    </p>
                    <Badge className="rounded-full bg-muted text-muted-foreground capitalize text-xs">
                      {property.type}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/40">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span className="line-clamp-1">{property.landlord}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      {property.views.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border/60">
                    {property.status === 'pending' ? (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleApproveProperty(property.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-lg text-red-600 border-red-600/30 hover:bg-red-50"
                          onClick={() => handleRejectProperty(property.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
                          onClick={() => handleViewProperty(property)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-lg"
                          onClick={() => handleViewProperty(property)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="px-2">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewListing(property)}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Listing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditProperty(property)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Property
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {property.status === 'active' ? (
                              <DropdownMenuItem
                                className="text-amber-600"
                                onClick={() => handleSuspendProperty(property.id)}
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Suspend Listing
                              </DropdownMenuItem>
                            ) : property.status === 'suspended' ? (
                              <DropdownMenuItem
                                className="text-emerald-600"
                                onClick={() => handleReactivateProperty(property.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Reactivate
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteProperty(property.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Property
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">No properties found matching your criteria</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/60">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length)} of{' '}
                {filteredProperties.length} properties
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
    </div>
  )
}

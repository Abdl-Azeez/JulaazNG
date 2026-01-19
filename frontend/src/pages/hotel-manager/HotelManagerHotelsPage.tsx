import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Building2, MapPin, Star, ShieldCheck, Eye, Edit, MoreVertical, Calendar } from 'lucide-react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { mockHotels } from '@/__mocks__/data/hotels.mock'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils/cn'
import { useAuthStore } from '@/shared/store/auth.store'
import type { Hotel } from '@/shared/types/hotel.types'

export function HotelManagerHotelsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Filter hotels for current hotel manager (in real app, this would come from API)
  const myHotels = mockHotels.filter((hotel) => hotel.hotelManagerId === 'manager-1')

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(true)} onProfileClick={handleProfileClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-8 lg:py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Hotels</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your hotel listings and settings</p>
              </div>
              <Button onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTEL_CREATE)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Hotel
              </Button>
            </div>
          </div>
        </section>

        {/* Hotels List */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-8 lg:py-12">
          {myHotels.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myHotels.map((hotel) => (
                <Card key={hotel.id} className="rounded-2xl border border-border/60 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    {hotel.images.length > 0 && (
                      <img
                        src={hotel.images[0]}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {hotel.isHalal && (
                        <Badge className="bg-emerald-500/90 text-white border-0 shadow-lg flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          Halal
                        </Badge>
                      )}
                      <Badge
                        className={cn(
                          'rounded-full',
                          hotel.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : hotel.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                              : 'bg-red-500/10 text-red-600 border-red-500/20'
                        )}
                      >
                        {hotel.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{hotel.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{hotel.address}, {hotel.city}</span>
                      </div>
                    </div>

                    {hotel.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{hotel.rating.toFixed(1)}</span>
                        {hotel.reviewCount && (
                          <span className="text-xs text-muted-foreground">({hotel.reviewCount} reviews)</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-4 border-t border-border/60">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTEL_DETAILS(hotel.id))}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTEL_DETAILS(hotel.id))}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTEL_DETAILS(hotel.id))}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(ROUTES.HOTEL_MANAGER_BOOKINGS)}>
                            <Calendar className="h-4 w-4 mr-2" />
                            View Bookings
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(ROUTES.HOTEL_DETAILS(hotel.id))}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Public Page
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No hotels yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by adding your first hotel to the platform
              </p>
              <Button onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTEL_CREATE)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Hotel
              </Button>
            </Card>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

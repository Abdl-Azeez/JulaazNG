import { useState, useEffect } from 'react'
import { Heart, Grid3x3, List, Search, MapPin, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { AuthDialog } from '@/widgets/auth-dialog'
import { LogoLoader } from '@/widgets/logo-loader'
import { sampleFavourites } from './data/sample-favourites'
import { Favourite } from '@/shared/types/activity.types'
import { useAuthStore } from '@/shared/store/auth.store'
import { useRoleStore } from '@/shared/store/role.store'
import { ROUTES } from '@/shared/constants/routes'
import { Card, CardContent } from '@/shared/ui/card'
import { cn } from '@/shared/lib/utils'

type ViewMode = 'grid' | 'list'
type FilterType = 'all' | 'property' | 'service' | 'provider'

export function FavouritesPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { activeRole } = useRoleStore()
  const [favourites, setFavourites] = useState(sampleFavourites)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isRemoving, setIsRemoving] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const visibleFavourites = favourites.filter((fav) =>
    activeRole === 'landlord' ? fav.type !== 'property' : true
  )

  const effectiveFilter =
    activeRole === 'landlord' && filter === 'property' ? 'all' : filter

  const filteredFavourites = visibleFavourites.filter((fav) => {
    const matchesFilter = effectiveFilter === 'all' || fav.type === effectiveFilter
    const matchesSearch = fav.item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fav.item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleRemoveFavourite = async (id: string) => {
    setIsRemoving(id)
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      setFavourites(prev => prev.filter(fav => fav.id !== id))
    } finally {
      setIsRemoving(null)
    }
  }

  const handleMenuClick = () => {
    setIsSidebarOpen(true)
  }

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate(ROUTES.PROFILE)
    } else {
      setIsDrawerOpen(true)
    }
  }

  const handleItemClick = (favourite: Favourite) => {
    if (favourite.type === 'property') {
      navigate(ROUTES.PROPERTY_DETAILS(favourite.itemId))
    } else if (favourite.type === 'service') {
      navigate(`${ROUTES.SERVICES}/${favourite.itemId}`)
    } else if (favourite.type === 'provider') {
      navigate(`${ROUTES.SERVICES}/providers/${favourite.itemId}`)
    }
  }

  // Calculate counts from original favourites array, not filtered
  const favouritesByType = visibleFavourites.reduce((acc, fav) => {
    if (!acc[fav.type]) {
      acc[fav.type] = []
    }
    acc[fav.type].push(fav)
    return acc
  }, {} as Record<string, Favourite[]>)

  const availableFilters: { label: string; value: FilterType }[] =
    activeRole === 'landlord'
      ? [
          { label: 'All', value: 'all' },
          { label: 'Services', value: 'service' },
          { label: 'Providers', value: 'provider' },
        ]
      : [
          { label: 'All', value: 'all' },
          { label: 'Properties', value: 'property' },
          { label: 'Services', value: 'service' },
          { label: 'Providers', value: 'provider' },
        ]

  useEffect(() => {
    if (activeRole === 'landlord' && filter === 'property') {
      setFilter('all')
    }
  }, [activeRole, filter])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      
      {/* Favourites Header */}
      <header className="sticky z-10 bg-surface/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-4 lg:py-6 max-w-7xl">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">Favourites</h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                {visibleFavourites.length} saved items
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? '' : 'bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary transition-colors'}
              >
                <Grid3x3 className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? '' : 'bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary transition-colors'}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search favourites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-surface border border-border shadow-sm text-foreground"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 lg:gap-3 overflow-x-auto pb-2">
            {availableFilters.map(({ label, value }) => (
            <Button
                key={value}
                variant={effectiveFilter === value ? 'default' : 'ghost'}
              size="sm"
                onClick={() => setFilter(value)}
              className={cn(
                  'rounded-full shrink-0 lg:px-6 transition-colors',
                  effectiveFilter !== value &&
                    'text-foreground border border-border hover:border-primary/50 hover:text-primary hover:bg-primary/10'
              )}
            >
                {label}{' '}
                {value === 'all'
                  ? `(${visibleFavourites.length})`
                  : `(${favouritesByType[value]?.length || 0})`}
            </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Favourites List */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-8 max-w-7xl">
          {filteredFavourites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'No favourites match your search' 
                  : 'No favourites yet'}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                  {filteredFavourites.map((favourite, index) => (
                    <motion.div
                      key={favourite.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 bg-surface border-0 shadow-sm hover:-translate-y-1"
                        onClick={() => handleItemClick(favourite)}
                      >
                        <div className="relative">
                          <img
                            src={favourite.item.image || 'https://via.placeholder.com/200'}
                            alt={favourite.item.title}
                            className="w-full h-32 object-cover"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveFavourite(favourite.id)
                            }}
                            disabled={isRemoving === favourite.id}
                          >
                            {isRemoving === favourite.id ? (
                              <LogoLoader size="sm" variant="primary" />
                            ) : (
                              <Heart className="h-4 w-4 fill-primary text-primary" />
                            )}
                          </Button>
                          {favourite.item.rating && (
                            <Badge className="absolute bottom-2 left-2 bg-background/80 text-foreground">
                              <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                              {favourite.item.rating}
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{favourite.item.title}</h3>
                          {favourite.item.location && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{favourite.item.location}</span>
                            </div>
                          )}
                          {favourite.item.price && (
                            <p className="text-sm font-bold text-primary">
                              ₦{favourite.item.price.toLocaleString()}
                              {favourite.type === 'property' && '/month'}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFavourites.map((favourite, index) => (
                    <motion.div
                      key={favourite.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 bg-surface border-0 shadow-sm hover:-translate-y-0.5"
                        onClick={() => handleItemClick(favourite)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={favourite.item.image || 'https://via.placeholder.com/100'}
                              alt={favourite.item.title}
                              className="w-20 h-20 object-cover rounded-lg shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h3 className="font-semibold text-foreground line-clamp-1">{favourite.item.title}</h3>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveFavourite(favourite.id)
                                  }}
                                  disabled={isRemoving === favourite.id}
                                >
                                  {isRemoving === favourite.id ? (
                                    <LogoLoader size="sm" variant="primary" />
                                  ) : (
                                    <Heart className="h-4 w-4 fill-primary text-primary" />
                                  )}
                                </Button>
                              </div>
                              {favourite.item.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {favourite.item.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  {favourite.item.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{favourite.item.location}</span>
                                    </div>
                                  )}
                                  {favourite.item.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-primary text-primary" />
                                      <span>{favourite.item.rating}</span>
                                    </div>
                                  )}
                                </div>
                                {favourite.item.price && (
                                  <p className="text-sm font-bold text-primary">
                                    ₦{favourite.item.price.toLocaleString()}
                                    {favourite.type === 'property' && '/month'}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}


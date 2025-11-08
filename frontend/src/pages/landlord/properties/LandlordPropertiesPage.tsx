import { useMemo } from 'react'
import { Plus, MoreVertical, Clock, Sparkles, TrendingUp, Building2, FileText, ShieldCheck } from 'lucide-react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AuthDrawer } from '@/widgets/auth-drawer'
import { useAuthStore } from '@/shared/store/auth.store'
import { useState } from 'react'
import { LandlordNav } from '@/widgets/landlord-nav'
import { landlordProperties } from '../data/sample-landlord-properties'
import type { LandlordProperty } from '@/shared/types/landlord.types'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const heroMetrics = useMemo(
    () => {
      const active = landlordProperties.filter((p) => p.status === 'active').length
      const occupancy = Math.round(
        landlordProperties.reduce((acc, curr) => acc + curr.occupancyRate, 0) / landlordProperties.length
      )
      const applications = landlordProperties.reduce((acc, curr) => acc + curr.applications, 0)
      const inspectionQueue = landlordProperties.filter((p) => p.status === 'inactive' || p.status === 'reserved').length

      return {
        active,
        occupancy,
        applications,
        inspectionQueue,
        cards: [
          {
            label: 'Active Listings',
            value: active,
            accent: 'from-primary/20 to-primary/5',
            icon: <Building2 className="h-5 w-5 text-primary" />,
          },
          {
            label: 'Portfolio Occupancy',
            value: `${occupancy}%`,
            accent: 'from-accent/20 to-accent/5',
            icon: <TrendingUp className="h-5 w-5 text-accent" />,
          },
          {
            label: 'Live Applications',
            value: applications,
            accent: 'from-emerald-500/20 to-emerald-500/5',
            icon: <FileText className="h-5 w-5 text-emerald-500" />,
          },
          {
            label: 'Inspection Queue',
            value: inspectionQueue,
            accent: 'from-primary/15 via-primary/5 to-transparent',
            icon: <ShieldCheck className="h-5 w-5 text-primary" />,
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
        <section className="container mx-auto px-4 lg:px-6 xl:px-8 max-w-6xl py-6 lg:py-10 space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/8 via-surface to-background shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.25),_transparent_55%)]" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 lg:p-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-xl border border-primary/20 shadow-lg">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-primary uppercase tracking-[0.25em]">
                    Landlord console
                  </p>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">
                    My Properties
                  </h1>
                  <p className="text-muted-foreground">
                    Track occupancy, nurture applicants, and keep listings inspection-ready with creative media. Your dashboard blends long-term and shortlet performance in one place.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-primary/80">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary/70" /> Shortlet-ready {heroMetrics.active} listings
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-accent" /> {heroMetrics.applications} active requests
                  </span>
                </div>
              </div>
              <Button
                className="h-12 rounded-2xl px-6 shadow-xl hover:shadow-2xl bg-primary text-primary-foreground gap-2"
                onClick={() => navigate(ROUTES.LANDLORD_PROPERTY_CREATE)}
              >
                <Plus className="h-5 w-5" />
                Post Property
              </Button>
            </div>
          </div>

          {/* KPI shimmering cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {heroMetrics.cards.map((metric) => (
              <div
                key={metric.label}
                className="group relative overflow-hidden rounded-3xl border border-border/60 bg-surface/90 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br', metric.accent)} />
                <div className="relative p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{metric.value}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-background/80 border border-border/50 shadow-inner">
                    {metric.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Properties grid */}
          <div className="grid gap-4 lg:gap-6">
            {landlordProperties.map((property) => {
              const config = statusConfig[property.status]
              return (
                <article
                  key={property.id}
                  onClick={() => navigate(ROUTES.LANDLORD_PROPERTY_DETAILS(property.id))}
                  className="group relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-[0_25px_45px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
                  <div className="relative flex gap-4 lg:gap-6 p-4 lg:p-6">
                    <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        className={cn(
                          'absolute top-2 left-2 px-2 py-1 text-[10px] font-semibold rounded-md border backdrop-blur-lg',
                          config.tone,
                          'relative after:absolute after:-inset-1 after:rounded-xl after:opacity-0 group-hover:after:opacity-60 after:blur-md after:-z-10 transition-opacity',
                          config.glow
                        )}
                      >
                        {config.label}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg lg:text-xl font-semibold text-foreground tracking-tight">
                            {property.name}
                          </h2>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="h-10 w-10 rounded-2xl border border-border/60 bg-background/70 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <Badge className="rounded-full bg-primary/10 text-primary border-0 px-3 py-1">
                          {property.priceLabel}
                        </Badge>
                        <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-0 px-3 py-1">
                          Applications • {property.applications}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                          <Clock className="h-3.5 w-3.5" />
                          Updated {property.lastUpdated}
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-muted-foreground w-full">
                        <div className="flex items-center justify-between">
                          <span>Occupancy (last 90 days)</span>
                          <span className="font-semibold text-foreground">{property.occupancyRate}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted/60 overflow-hidden w-full">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              property.occupancyRate >= 80
                                ? 'bg-emerald-500'
                                : property.occupancyRate >= 40
                                  ? 'bg-amber-500'
                                  : 'bg-destructive'
                            )}
                            style={{ width: `${property.occupancyRate}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground/80">
                          Measures confirmed bookings versus availability across annual leases and shortlets.
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <LandlordNav />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <Footer />
    </div>
  )
}

import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AuthDrawer } from '@/widgets/auth-drawer'
import { useAuthStore } from '@/shared/store/auth.store'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ROUTES } from '@/shared/constants/routes'
import { LandlordNav } from '@/widgets/landlord-nav'
import { TrendingUp, BarChart3, LineChart, Activity, ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export function LandlordPropertyInsightsPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleMenuClick = () => setIsSidebarOpen(true)
  const handleProfileClick = () => {
    if (!isAuthenticated) setIsDrawerOpen(true)
    else navigate(ROUTES.PROFILE)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted relative">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-br from-primary/15 via-accent/20 to-transparent blur-3xl opacity-80 pointer-events-none" />

      <main className="relative z-10 flex-1 pb-28 lg:pb-16">
        <section className="container mx-auto px-4 lg:px-6 xl:px-8 max-w-6xl py-6 lg:py-10 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-2xl border border-border/60 hover:bg-primary/10 hover:text-primary"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 backdrop-blur-xl border border-border/60 shadow-lg">
                <BarChart3 className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.25em]">
                  Insights
                </p>
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              Property Insights
            </h1>
            <p className="text-muted-foreground">Analytics for property ID: {id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <TrendingUp className="h-5 w-5 text-primary" />, label: 'Views (30d)', value: '1,248' },
              { icon: <LineChart className="h-5 w-5 text-accent" />, label: 'Saves (30d)', value: '178' },
              { icon: <Activity className="h-5 w-5 text-emerald-500" />, label: 'CTR', value: '5.7%' },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                </div>
                <div className="p-3 rounded-2xl bg-background/80 border border-border/50 shadow-inner">{kpi.icon}</div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">Discovery funnel</h2>
            <p className="text-sm text-muted-foreground mb-4">
              See how tenants discover and interact with your listing across the marketplace.
            </p>
            <div className="h-48 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border/60" />
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


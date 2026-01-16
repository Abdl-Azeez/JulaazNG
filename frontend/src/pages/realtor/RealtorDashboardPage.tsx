import { RealtorLayout } from '@/widgets/realtor-layout'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils/cn'
import {
  Building2,
  Users,
  MapPin,
  Percent,
  ArrowUpRight,
  Wallet,
  Calendar,
  Eye,
  Sparkles,
} from 'lucide-react'
import {
  realtorDashboardSummary,
  realtorPipeline,
  realtorEarningsTrend,
  realtorClientMix,
} from '@/__mocks__/data/realtor.mock'

export function RealtorDashboardPage() {
  const { managedPortfolios, activeTenants, citiesCovered, monthlyGmv, avgCommissionRate } =
    realtorDashboardSummary

  return (
    <RealtorLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted">
        <main className="flex-1">
          {/* Hero */}
          <section className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-background to-background">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="space-y-4 w-full lg:max-w-3xl">
                  <Badge className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold flex items-center gap-1 w-fit">
                    <Sparkles className="h-3 w-3" />
                    Realtor Command Center
                  </Badge>
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                      Rentals & shortlets at a glance
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                      See your managed portfolios, tenants, and commission pipeline in a single,
                      calm workspace.
                    </p>
                  </div>

                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                    {[
                      {
                        label: 'Managed portfolios',
                        value: managedPortfolios,
                        icon: Building2,
                        accent: 'text-primary',
                      },
                      {
                        label: 'Active tenants',
                        value: activeTenants,
                        icon: Users,
                        accent: 'text-emerald-500',
                      },
                      {
                        label: 'Cities covered',
                        value: citiesCovered,
                        icon: MapPin,
                        accent: 'text-amber-500',
                      },
                      {
                        label: 'Monthly GMV',
                        value: `₦${(monthlyGmv / 1_000_000).toFixed(1)}M`,
                        icon: Wallet,
                        accent: 'text-indigo-500',
                      },
                    ].map((tile) => (
                      <Card
                        key={tile.label}
                        className="rounded-2xl border border-border/60 bg-surface/95 shadow-lg px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-[0.18em]">
                            {tile.label}
                          </p>
                          <tile.icon className={cn('h-4 w-4', tile.accent)} />
                        </div>
                        <p className="text-lg sm:text-xl font-semibold text-foreground">
                          {tile.value}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-auto lg:min-w-[260px] space-y-3">
                  <Card className="rounded-2xl border-none bg-gradient-to-br from-primary/15 via-primary/5 to-background shadow-xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-primary/80 font-semibold uppercase tracking-[0.22em]">
                          Commission snapshot
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Avg. cut across all managed units
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-background/60 border border-primary/30 flex items-center justify-center">
                        <Percent className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-black text-foreground">
                        {(avgCommissionRate * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Blended rate on long-term + shortlet contracts
                      </p>
                    </div>
                    <Button className="w-full rounded-xl mt-2" variant="outline">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      View detailed earnings
                    </Button>
                  </Card>

                  <Card className="rounded-2xl border border-border/60 bg-surface/95 shadow-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-[0.22em]">
                          Today&apos;s focus
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          3 viewings • 2 renewals
                        </p>
                      </div>
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li>• Confirm shortlet check-in for Yaba Studio</li>
                      <li>• Send renewal offer for Lekki 3BR penthouse</li>
                      <li>• Call corporate HR about VI staff housing brief</li>
                    </ul>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Pipeline + Earnings */}
          <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1.4fr,0.6fr]">
              <Card className="rounded-3xl border-none bg-surface shadow-lg p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.24em]">
                      Deal pipeline
                    </p>
                    <p className="text-lg sm:text-xl font-semibold text-foreground">
                      Rentals & shortlets in motion
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    <Eye className="h-3 w-3 mr-1" />
                    {realtorPipeline.length} active
                  </Badge>
                </div>

                <div className="grid gap-3">
                  {realtorPipeline.map((deal) => (
                    <div
                      key={deal.id}
                      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl p-4 flex flex-col gap-2 hover:border-primary/40 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            {deal.propertyName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Landlord: {deal.landlordName}
                            {deal.tenantName ? ` • Tenant: ${deal.tenantName}` : null}
                          </p>
                        </div>
                        <Badge variant="outline" className="rounded-full text-[10px]">
                          {deal.stage.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <p className="text-muted-foreground">{deal.nextAction}</p>
                        <p className="font-semibold text-primary">
                          Potential: ₦{(deal.potentialCommission / 1_000_000).toFixed(2)}M
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="rounded-3xl border-none bg-surface shadow-lg p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.24em]">
                      Earnings trend
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      Commission vs expenses (last 4 months)
                    </p>
                  </div>
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-3">
                  {realtorEarningsTrend.map((row) => (
                    <div key={row.month} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{row.month}</span>
                        <span className="text-muted-foreground">
                          Net ₦{(row.net / 1_000_000).toFixed(2)}M
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                        <div
                          className="h-full bg-primary/80"
                          style={{
                            width: `${Math.min(
                              100,
                              (row.grossCommission / (row.grossCommission + row.expenses || 1)) *
                                100
                            )}%`,
                          }}
                        />
                        <div
                          className="h-full bg-destructive/60"
                          style={{
                            width: `${Math.min(
                              100,
                              (row.expenses / (row.grossCommission + row.expenses || 1)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-border/60 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.24em]">
                    Client mix
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {realtorClientMix.map((row) => (
                      <li key={row.label} className="flex items-center justify-between gap-2">
                        <span>{row.label}</span>
                        <span className="font-semibold text-foreground">{row.value}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </RealtorLayout>
  )
}


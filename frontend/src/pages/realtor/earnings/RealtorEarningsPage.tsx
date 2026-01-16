import { RealtorLayout } from '@/widgets/realtor-layout'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs'
import { Button } from '@/shared/ui/button'
import { Wallet, TrendingUp, Activity, ArrowUpRight, PiggyBank } from 'lucide-react'
import { realtorEarningsTrend } from '@/__mocks__/data/realtor.mock'

export function RealtorEarningsPage() {
  const grossThisMonth = realtorEarningsTrend[realtorEarningsTrend.length - 1]?.grossCommission ?? 0
  const expensesThisMonth = realtorEarningsTrend[realtorEarningsTrend.length - 1]?.expenses ?? 0
  const netThisMonth = realtorEarningsTrend[realtorEarningsTrend.length - 1]?.net ?? 0

  return (
    <RealtorLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted relative">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-br from-primary/15 via-accent/20 to-transparent blur-3xl opacity-70 pointer-events-none" />
        <main className="relative z-10 flex-1 pb-20">
          <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6 lg:py-10 space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-surface shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.18),_transparent_45%)]" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
              <div className="relative grid gap-6 lg:grid-cols-[1fr_320px] p-6 lg:p-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-lg border border-primary/20 shadow-lg">
                    <Wallet className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.25em]">
                      Realtor Earnings
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">
                      ₦{(netThisMonth / 1_000_000).toFixed(2)}M
                      <span className="text-2xl lg:text-3xl text-muted-foreground ml-2">
                        Net this month
                      </span>
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
                      See how landlord payouts, your commissions, and operational spend balance out
                      across long-term rentals and shortlets.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-600">+14%</span>
                      <span className="text-muted-foreground">vs last month net</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
                      <PiggyBank className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">
                        ₦{(grossThisMonth / 1_000_000).toFixed(2)}M
                      </span>
                      <span className="text-muted-foreground">gross commissions</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-background/80 to-background backdrop-blur-xl shadow-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      Earnings mix
                    </p>
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Long-term rentals</span>
                      <span className="font-semibold text-foreground">68%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shortlets</span>
                      <span className="font-semibold text-foreground">24%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Ancillary services</span>
                      <span className="font-semibold text-foreground">8%</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-primary/30 hover:bg-primary/10 hover:text-primary"
                  >
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    Export earnings report
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              defaultValue="income"
              className="w-full rounded-3xl border border-border/60 bg-surface/95 shadow-lg p-4 sm:p-6"
            >
              <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-muted/50 p-1 mb-4">
                <TabsTrigger
                  value="income"
                  className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Earnings pipeline
                </TabsTrigger>
                <TabsTrigger
                  value="financials"
                  className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Income & expenditure
                </TabsTrigger>
              </TabsList>

              <TabsContent value="income" className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-[1.3fr,0.7fr]">
                  <Card className="rounded-2xl border border-border/60 bg-background/90 backdrop-blur-xl p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.22em]">
                          Upcoming commissions
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Renewals, new move-ins, and shortlet turnovers
                        </p>
                      </div>
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        6 expected this month
                      </Badge>
                    </div>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li>• 3 long-term renewals across Lekki & Ikeja</li>
                      <li>• 2 corporate shortlets with 30+ nights booked</li>
                      <li>• 1 new landlord onboarding with exclusive mandate</li>
                    </ul>
                  </Card>
                  <Card className="rounded-2xl border border-border/60 bg-background/90 backdrop-blur-xl p-4 sm:p-5 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.22em]">
                      Health checks
                    </p>
                    <ul className="space-y-2 text-xs">
                      <li className="flex items-center justify-between">
                        <span>Landlords paid on time</span>
                        <span className="font-semibold text-emerald-600">92%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Unreconciled payouts</span>
                        <span className="font-semibold text-amber-600">₦0.4M</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Outstanding expenses</span>
                        <span className="font-semibold text-destructive">₦0.2M</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="financials" className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-[1.4fr,0.6fr]">
                  <Card className="rounded-2xl border border-border/60 bg-background/90 backdrop-blur-xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.22em]">
                        Income vs expenditure (monthly)
                      </p>
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        Last 4 months
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {realtorEarningsTrend.map((row) => (
                        <div key={row.month} className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{row.month}</span>
                            <span className="text-muted-foreground">
                              Net ₦{(row.net / 1_000_000).toFixed(2)}M
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-14 text-[11px] text-muted-foreground">Income</span>
                            <div className="flex-1 h-1.5 rounded-full bg-emerald-500/15 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (row.grossCommission / 3_000_000) * 100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-14 text-[11px] text-muted-foreground">Expenses</span>
                            <div className="flex-1 h-1.5 rounded-full bg-destructive/10 overflow-hidden">
                              <div
                                className="h-full bg-destructive"
                                style={{
                                  width: `${Math.min(100, (row.expenses / 1_200_000) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="rounded-2xl border border-border/60 bg-background/90 backdrop-blur-xl p-4 sm:p-5 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.22em]">
                      Expense categories
                    </p>
                    <ul className="space-y-2 text-xs">
                      <li className="flex items-center justify-between">
                        <span>Field inspections & viewings</span>
                        <span className="font-semibold text-foreground">38%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Marketing & listings</span>
                        <span className="font-semibold text-foreground">27%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Team & assistants</span>
                        <span className="font-semibold text-foreground">21%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Transport & logistics</span>
                        <span className="font-semibold text-foreground">14%</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </div>
    </RealtorLayout>
  )
}


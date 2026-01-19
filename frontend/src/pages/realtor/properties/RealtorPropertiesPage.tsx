import { RealtorLayout } from '@/widgets/realtor-layout'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Building2, Users, MapPin, Calendar, Filter } from 'lucide-react'

const sampleRealtorProperties = [
  {
    id: 'rp-lk-01',
    name: 'Lekki Phase 1 – 3BR Penthouse',
    city: 'Lagos',
    type: 'Long-term',
    units: 1,
    occupied: 1,
    nextRenewal: '2026-03-14',
    landlord: 'Femi Ogunleye',
  },
  {
    id: 'rp-yb-02',
    name: 'Yaba – Studio Shortlet Block (6 units)',
    city: 'Lagos',
    type: 'Shortlet',
    units: 6,
    occupied: 4,
    nextRenewal: '2026-02-01',
    landlord: 'Chioma Nwosu',
  },
  {
    id: 'rp-ik-03',
    name: 'Ikeja GRA – 4BR Duplex',
    city: 'Lagos',
    type: 'Long-term',
    units: 1,
    occupied: 0,
    nextRenewal: 'Vacant',
    landlord: 'Adekunle Ajayi',
  },
]

export function RealtorPropertiesPage() {
  const totalUnits = sampleRealtorProperties.reduce((sum, p) => sum + p.units, 0)
  const occupiedUnits = sampleRealtorProperties.reduce((sum, p) => sum + p.occupied, 0)
  const occupancyRate = totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0

  return (
    <RealtorLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted">
        <main className="flex-1">
          <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  Managed portfolios
                </h1>
                <p className="text-sm text-muted-foreground">
                  A quick overview of every unit you manage on behalf of landlords and corporate
                  clients.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="rounded-xl">
                  <Filter className="h-4 w-4 mr-1" />
                  Filters
                </Button>
                <Button className="rounded-xl">
                  + Onboard property
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="rounded-2xl border border-border/60 bg-surface/95 shadow-md p-4 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                  Total units
                </p>
                <p className="text-2xl font-bold text-foreground">{totalUnits}</p>
                <p className="text-xs text-muted-foreground">
                  Across long-term rentals and shortlets
                </p>
              </Card>
              <Card className="rounded-2xl border border-border/60 bg-surface/95 shadow-md p-4 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                  Occupied
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {occupiedUnits}/{totalUnits}
                </p>
                <p className="text-xs text-muted-foreground">Currently generating income</p>
              </Card>
              <Card className="rounded-2xl border border-border/60 bg-surface/95 shadow-md p-4 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                  Occupancy rate
                </p>
                <p className="text-2xl font-bold text-foreground">{occupancyRate}%</p>
                <p className="text-xs text-muted-foreground">Target: 90%+</p>
              </Card>
            </div>

            <div className="grid gap-4">
              {sampleRealtorProperties.map((property) => (
                <Card
                  key={property.id}
                  className="rounded-2xl border border-border/60 bg-surface/95 shadow-md p-4 sm:p-5 flex flex-col gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground">
                          {property.name}
                        </h2>
                        <Badge variant="outline" className="rounded-full text-[10px]">
                          {property.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.city} • Landlord: {property.landlord}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="rounded-xl">
                        View portfolio
                      </Button>
                      <Button size="sm" className="rounded-xl" variant="ghost">
                        Manage
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>
                        {property.occupied}/{property.units} units occupied
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Next renewal:{' '}
                        {property.nextRenewal === 'Vacant'
                          ? 'Vacant – focus on filling'
                          : property.nextRenewal}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </RealtorLayout>
  )
}


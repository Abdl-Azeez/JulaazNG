import { RealtorLayout } from '@/widgets/realtor-layout'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Users, Building2, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react'

const sampleRealtorClients = [
  {
    id: 'cl-001',
    name: 'Femi Ogunleye',
    type: 'Landlord',
    properties: 3,
    primaryCity: 'Lekki',
    status: 'active',
  },
  {
    id: 'cl-002',
    name: 'Bridges & Co.',
    type: 'Corporate',
    properties: 2,
    primaryCity: 'VI',
    status: 'active',
  },
  {
    id: 'cl-003',
    name: 'Adaeze Okafor',
    type: 'Tenant',
    properties: 1,
    primaryCity: 'Yaba',
    status: 'renewal_due',
  },
]

export function RealtorTenantsPage() {
  return (
    <RealtorLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted">
        <main className="flex-1">
          <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Clients & tenants
                </h1>
                <p className="text-sm text-muted-foreground">
                  A unified book of the landlords, corporate clients, and tenants you manage.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {sampleRealtorClients.map((client) => (
                <Card
                  key={client.id}
                  className="rounded-2xl border border-border/60 bg-surface/95 shadow-md p-4 sm:p-5 flex flex-col gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground">
                          {client.name}
                        </h2>
                        <Badge variant="outline" className="rounded-full text-[10px]">
                          {client.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {client.properties} managed {client.properties === 1 ? 'unit' : 'units'} •{' '}
                        Primary city: {client.primaryCity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <button className="inline-flex items-center gap-1 px-2 py-1 rounded-xl border border-border/70 hover:bg-background">
                        <Phone className="h-3 w-3" />
                        Call
                      </button>
                      <button className="inline-flex items-center gap-1 px-2 py-1 rounded-xl border border-border/70 hover:bg-background">
                        <Mail className="h-3 w-3" />
                        Message
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {client.status === 'active' ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Clock className="h-3 w-3 text-amber-500" />
                      )}
                      <span>
                        {client.status === 'active'
                          ? 'In good standing'
                          : 'Renewal & documentation due soon'}
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


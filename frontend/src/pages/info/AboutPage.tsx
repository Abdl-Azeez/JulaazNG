import { InfoPageTemplate } from './InfoPageTemplate'
import { Card } from '@/shared/ui/card'
import { Building2, Users, ShieldCheck, Sparkles } from 'lucide-react'

export function AboutPage() {
  return (
    <InfoPageTemplate
      title="Built for modern Nigerian living"
      subtitle="Julaaz pairs long-term rentals, flexible shortlets, and concierge-level support into one trusted ecosystem."
      badge="Our Story"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6 bg-surface/95 border-border/60 shadow-lg space-y-3">
          <div className="flex items-center gap-3 text-primary">
            <Building2 className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-foreground">Why we exist</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Renting in Nigeria shouldn’t be a maze of unverified listings and manual negotiations. We designed Julaaz to
            give landlords a digital assistant, and tenants a trusted concierge. From discovery to inspection, everything
            lives in one mobile-first flow.
          </p>
        </Card>
        <Card className="p-6 bg-surface/95 border-border/60 shadow-lg space-y-3">
          <div className="flex items-center gap-3 text-primary">
            <Users className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-foreground">Community-first marketplace</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We partner with vetted landlords, facility managers, and artisans. Every listing passes an inspection
            checklist, every tenant is KYC-backed, and every transaction is monitored for transparency.
          </p>
        </Card>
      </div>
      <Card className="p-6 lg:p-8 bg-gradient-to-br from-primary/10 via-background to-surface border border-border/60 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-10 gap-6">
          <div className="flex items-center gap-3 text-primary">
            <ShieldCheck className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-foreground">What we guarantee</h2>
          </div>
          <ul className="grid gap-3 text-sm text-muted-foreground">
            <li>• Verified listings, inspections, and digital agreements.</li>
            <li>• Seamless messaging, payments, and viewing schedules.</li>
            <li>• Shortlet-ready amenities for enterprise and leisure guests.</li>
            <li>• Persistent support from onboarding to renewals.</li>
          </ul>
        </div>
      </Card>
      <div className="rounded-3xl border border-border/60 bg-surface/95 p-6 shadow-lg flex flex-col gap-3">
        <div className="flex items-center gap-3 text-primary">
          <Sparkles className="h-6 w-6" />
          <h2 className="text-lg font-semibold text-foreground">Our ethos</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Creativity + compliance. We obsess over delightful UX and rock-solid trust. That means landlord dashboards
          with live metrics, tenant journeys with playful animations, and backend operations that run on policy, not
          guesswork.
        </p>
      </div>
    </InfoPageTemplate>
  )
}

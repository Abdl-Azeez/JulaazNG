import { InfoPageTemplate } from './InfoPageTemplate'
import { Card } from '@/shared/ui/card'

const clauses = [
  {
    title: '1. Introduction',
    text: 'By using Julaaz you agree to these terms. We provide a marketplace that connects verified landlords, tenants, and service providers.'
  },
  {
    title: '2. Listing obligations',
    text: 'Landlords must provide accurate property descriptions, pricing, and availability. All listings are subject to inspection before they appear publicly.'
  },
  {
    title: '3. Payments and commissions',
    text: 'Julaaz processes rent, shortlet fees, and service charges. Commission invoices are generated automatically upon successful bookings.'
  },
  {
    title: '4. Dispute resolution',
    text: 'We encourage parties to resolve issues via in-app messaging and support tickets. Formal disputes can be escalated to the Julaaz compliance team.'
  }
]

export function TermsPage() {
  return (
    <InfoPageTemplate
      title="Terms & Conditions"
      subtitle="The fine print that keeps rentals transparent and secure for everyone on the platform."
      badge="Legal"
    >
      <div className="grid gap-4">
        {clauses.map((clause) => (
          <Card key={clause.title} className="p-6 bg-surface/95 border-border/60 shadow-lg space-y-2">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">{clause.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{clause.text}</p>
          </Card>
        ))}
      </div>
    </InfoPageTemplate>
  )
}

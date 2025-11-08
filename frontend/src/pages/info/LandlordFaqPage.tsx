import { InfoPageTemplate } from './InfoPageTemplate'
import { Card } from '@/shared/ui/card'

const faqs = [
  {
    question: 'How long does approval take?',
    answer:
      'Once you publish a listing we schedule inspection within 48 hours. After verification the listing goes live instantly.',
  },
  {
    question: 'Can I accept both shortlet and long-term tenants?',
    answer:
      'Yes. Enable shortlet readiness during onboarding. You can keep earning from short stays while waiting for a long-term lease.',
  },
  {
    question: 'Who manages payments and reminders?',
    answer:
      'Julaaz handles invoicing, reminders, and payout reporting. You can trigger reminders manually from the Earnings dashboard.',
  },
  {
    question: 'Do I pay to list on Julaaz?',
    answer:
      'Listing is free. We earn a small commission on successful bookings and optional concierge services.',
  },
]

export function LandlordFaqPage() {
  return (
    <InfoPageTemplate
      title="Landlord Frequently Asked Questions"
      subtitle="Everything you need to know about onboarding, inspections, payouts, and tenant experiences."
      badge="Support"
    >
      <div className="grid gap-4">
        {faqs.map((faq) => (
          <Card key={faq.question} className="p-6 bg-surface/95 border-border/60 shadow-lg space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-foreground">{faq.question}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
          </Card>
        ))}
      </div>
    </InfoPageTemplate>
  )
}

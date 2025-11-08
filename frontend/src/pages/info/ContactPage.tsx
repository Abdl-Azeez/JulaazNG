import { InfoPageTemplate } from './InfoPageTemplate'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Button } from '@/shared/ui/button'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success('Message sent! Our support squad will buzz you shortly.')
    }, 1200)
  }

  return (
    <InfoPageTemplate
      title="Contact Julaaz Support"
      subtitle="Whether you’re onboarding 20 apartments or booking a shortlet for the weekend, our concierge team is within reach."
      badge="Support"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="p-6 lg:p-8 bg-surface/95 border-border/60 shadow-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-xs uppercase text-muted-foreground">
                Full name
              </label>
              <Input id="fullName" placeholder="Enter your name" className="mt-2 rounded-2xl bg-muted/40 border-border/60" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs uppercase text-muted-foreground">
                Email
              </label>
              <Input id="email" type="email" placeholder="name@email.com" className="mt-2 rounded-2xl bg-muted/40 border-border/60" required />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs uppercase text-muted-foreground">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Tell us how we can help..."
                className="mt-2 rounded-2xl bg-muted/40 border-border/60 min-h-[140px]"
                required
              />
            </div>
            <Button className="rounded-2xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl px-6 py-3" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send message'}
            </Button>
          </form>
        </Card>
        <Card className="p-6 bg-surface/95 border-border/60 shadow-lg space-y-4">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">Other ways to reach us</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Support hours:</span> Monday – Saturday, 9am – 7pm WAT.
            </p>
            <p>
              <span className="font-semibold text-foreground">WhatsApp concierge:</span> 0800-JULAAZ (coming soon)
            </p>
            <p>
              <span className="font-semibold text-foreground">Knowledge base:</span> Landlord FAQ covers onboarding, inspections, and payouts.
            </p>
          </div>
        </Card>
      </div>
    </InfoPageTemplate>
  )
}

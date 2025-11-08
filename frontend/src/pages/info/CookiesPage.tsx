import { InfoPageTemplate } from './InfoPageTemplate'
import { Card } from '@/shared/ui/card'

export function CookiesPage() {
  return (
    <InfoPageTemplate
      title="Cookies & Tracking"
      subtitle="We use lightweight analytics and session cookies to personalise listings without compromising privacy."
      badge="Privacy"
    >
      <Card className="p-6 bg-surface/95 border-border/60 shadow-lg space-y-3">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">What we store</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We store essential cookies for authentication, localisation, and analytics. No marketing pixels or third-party
          retargeting scripts are loaded without consent.
        </p>
      </Card>
      <Card className="p-6 bg-surface/95 border-border/60 shadow-lg space-y-3">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Managing preferences</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You can toggle optional cookies in Settings ▶ Privacy. Clearing cookies may sign you out or reset saved
          filters, but you can restore preferences after logging back in.
        </p>
      </Card>
    </InfoPageTemplate>
  )
}

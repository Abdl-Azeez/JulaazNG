import { InfoPageTemplate } from './InfoPageTemplate'
import { Card } from '@/shared/ui/card'

export function DisclaimerPage() {
  return (
    <InfoPageTemplate
      title="Disclaimer"
      subtitle="Transparency is core to Julaaz. Here’s our stance on listings, estimates, and third-party data."
      badge="Notice"
    >
      <Card className="p-6 bg-surface/95 border-border/60 shadow-lg space-y-3">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Content accuracy</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Property descriptions, pricing, and availability are supplied by landlords. Julaaz validates every listing prior to publishing but final due diligence is encouraged.
        </p>
      </Card>
      <Card className="p-6 bg-surface/95 border-border/60 shadow-lg space-y-3">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Financial estimates</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Forecasts and revenue metrics are indicative. Actual returns depend on seasonal demand, pricing strategies, and policy compliance.
        </p>
      </Card>
    </InfoPageTemplate>
  )
}

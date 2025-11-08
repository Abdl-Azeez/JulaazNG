import { InfoPageTemplate } from './InfoPageTemplate'
import { Card } from '@/shared/ui/card'
import home1 from '@/assets/images/home1.jpg'
import home2 from '@/assets/images/home2.jpg'
import home3 from '@/assets/images/home3.jpg'

const featured = [
  {
    name: 'Viva Residency',
    description: 'Smart highrise with concierge, rooftop pool, and zero downtime power. Perfect for corporate shortlets.',
    image: home1,
  },
  {
    name: 'Palmgrove Court',
    description: 'Premium waterfront penthouse with curated interiors and housekeeping options.',
    image: home2,
  },
  {
    name: 'Lekki Haven',
    description: 'Gated townhouses for families, with solar backup and workspace-ready rooms.',
    image: home3,
  },
]

export function BuildingsPage() {
  return (
    <InfoPageTemplate
      title="Featured buildings on Julaaz"
      subtitle="A rotating spotlight on spaces that blend design, safety, and wow-factor amenities across Nigeria."
      badge="Curated selection"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {featured.map((building) => (
          <Card key={building.name} className="overflow-hidden border-border/60 shadow-lg">
            <div className="h-40 w-full overflow-hidden">
              <img src={building.image} alt={building.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 space-y-2">
              <h2 className="text-base font-semibold text-foreground">{building.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{building.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </InfoPageTemplate>
  )
}

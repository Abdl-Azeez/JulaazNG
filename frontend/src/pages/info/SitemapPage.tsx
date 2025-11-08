import { InfoPageTemplate } from './InfoPageTemplate'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'

const sections = [
  {
    heading: 'Marketplace',
    links: [
      { label: 'Home', to: ROUTES.HOME },
      { label: 'Properties', to: ROUTES.PROPERTIES },
      { label: 'Services', to: ROUTES.SERVICES },
      { label: 'Shortlets', to: ROUTES.BUILDINGS },
    ],
  },
  {
    heading: 'Tenant',
    links: [
      { label: 'My Bookings', to: ROUTES.MY_BOOKINGS },
      { label: 'Payments', to: ROUTES.PAYMENTS },
      { label: 'Agreements', to: ROUTES.AGREEMENTS },
    ],
  },
  {
    heading: 'Landlord',
    links: [
      { label: 'My Properties', to: ROUTES.LANDLORD_PROPERTIES },
      { label: 'Applications', to: ROUTES.LANDLORD_APPLICATIONS },
      { label: 'Earnings', to: ROUTES.LANDLORD_EARNINGS },
      { label: 'Create Listing', to: ROUTES.LANDLORD_PROPERTY_CREATE },
    ],
  },
]

export function SitemapPage() {
  return (
    <InfoPageTemplate
      title="Platform sitemap"
      subtitle="Quick overview of every primary destination in the Julaaz ecosystem."
      badge="Navigation"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {sections.map((section) => (
          <div key={section.heading} className="rounded-2xl border border-border/60 bg-surface/95 shadow-lg p-6 space-y-3">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">{section.heading}</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-primary transition-colors font-semibold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </InfoPageTemplate>
  )
}

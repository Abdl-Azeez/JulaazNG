import { InfoPageTemplate } from './InfoPageTemplate'
import { Card } from '@/shared/ui/card'
import { Building2, Users, ShieldCheck, Sparkles, Globe2, HeartHandshake, Target, Zap, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const metrics = [
  { label: 'Shortlet ready homes', value: '120+', tone: 'from-primary/15 via-primary/5 to-transparent' },
  { label: 'Verified landlords onboard', value: '80+', tone: 'from-accent/15 via-accent/5 to-transparent' },
  { label: 'Tenant satisfaction', value: '96%', tone: 'from-emerald-500/15 via-emerald-500/5 to-transparent' },
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function AboutPage() {
  return (
    <InfoPageTemplate
      title="Built for modern Nigerian living"
      subtitle="Creating a one-stop ecosystem for property management—rentals, shortlets, and concierge support in one trusted platform."
      badge="Our Story"
    >
      <motion.div
        className="grid gap-4 lg:grid-cols-2"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp}>
          <Card className="group p-6 bg-surface/95 border-border/60 shadow-lg hover:shadow-2xl transition-all duration-500 space-y-3 hover:-translate-y-1">
            <div className="flex items-center gap-3 text-primary">
              <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Building2 className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Why we exist</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Renting in Nigeria shouldn't be a maze of unverified listings and manual negotiations. We designed Julaaz to
              give landlords a digital assistant, and tenants a trusted concierge. From discovery to inspection, everything
              lives in one mobile-first flow.
            </p>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card className="group p-6 bg-surface/95 border-border/60 shadow-lg hover:shadow-2xl transition-all duration-500 space-y-3 hover:-translate-y-1">
            <div className="flex items-center gap-3 text-primary">
              <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Community-first marketplace</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We partner with vetted landlords, facility managers, and artisans. Every listing passes an inspection
              checklist, every tenant is KYC-backed, and every transaction is monitored for transparency.
            </p>
          </Card>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="relative overflow-hidden p-6 lg:p-8 bg-gradient-to-br from-primary/10 via-background to-surface border border-border/60 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.15),_transparent_60%)]" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:gap-10 gap-6">
            <div className="flex items-center gap-3 text-primary">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">What we guarantee</h2>
            </div>
            <ul className="grid gap-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Verified listings, inspections, and digital agreements.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Security-first, no-scam zone payments through the platform.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Shortlet-ready amenities for enterprise and leisure guests.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Persistent support from onboarding to renewals.
              </li>
            </ul>
          </div>
        </Card>
      </motion.div>

      <motion.div
        className="grid gap-4 lg:grid-cols-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {[
          {
            icon: Target,
            title: 'Our mission',
            text: 'Democratize quality housing across Nigeria with tech-first workflows and human-first support.',
            color: 'text-primary',
            bgColor: 'bg-primary/10',
          },
          {
            icon: Zap,
            title: 'Our vision',
            text: 'Become the default rental OS for West Africa, blending compliance, creativity, and community.',
            color: 'text-accent',
            bgColor: 'bg-accent/10',
          },
          {
            icon: Heart,
            title: 'Our values',
            text: 'Transparency, delight, and relentless iteration. We ship fast, listen closely, and iterate boldly.',
            color: 'text-primary',
            bgColor: 'bg-primary/10',
          },
        ].map((item, index) => (
          <motion.div key={item.title} variants={fadeInUp} custom={index}>
            <Card className="group p-6 bg-surface/95 border-border/60 shadow-lg hover:shadow-2xl transition-all duration-500 space-y-3 hover:-translate-y-1">
              <div className={`p-3 rounded-2xl ${item.bgColor} group-hover:scale-110 transition-transform w-fit`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <h2 className="text-base font-semibold text-foreground">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="rounded-3xl border border-border/60 bg-surface/95 p-6 lg:p-8 shadow-lg flex flex-col gap-4">
          <div className="flex items-center gap-3 text-primary">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Our ethos</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Creativity + compliance. We obsess over delightful UX and rock-solid trust. That means landlord dashboards
            with live metrics, tenant journeys with playful animations, and backend operations that run on policy, not
            guesswork.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['Mobile-first', 'Theme-flexible', 'KYC-backed', 'Inspection-verified'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
      <Card className="p-6 lg:p-8 border border-border/60 bg-surface/95 shadow-lg space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <Globe2 className="h-6 w-6" />
          <h2 className="text-lg font-semibold text-foreground">Regional footprint</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/70 backdrop-blur-xl px-5 py-6 shadow"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.tone} opacity-80`} />
              <div className="relative space-y-2">
                <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6 lg:p-8 bg-gradient-to-br from-background via-background/95 to-muted border border-border/60 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <HeartHandshake className="h-6 w-6 text-primary" />
              Partnerships & concierge
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              From facility managers to relocation experts, we maintain a curated network so tenants and landlords can
              summon help instantly from the Services marketplace. Our concierge pods step in when you need hands-on
              support or remote hosting.
            </p>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-background/80 px-6 py-4 text-sm text-primary font-semibold shadow-lg">
            #LiveDifferent with verified homes, creative shortlets, and responsive support teams.
          </div>
        </div>
      </Card>
    </InfoPageTemplate>
  )
}

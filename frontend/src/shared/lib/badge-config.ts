export type BadgeTier = {
  id: string
  label: string
  minScore: number
  className: string
  description: string
  requirements: string[]
}

export type BadgeProgress = {
  key: string
  label: string
  current: number
  target?: number
  met: boolean
  unit?: string
}

export type BadgeResult = {
  tier: BadgeTier
  label: string
  className: string
  score: number
  totalPossible: number
  nextTier?: BadgeTier
  progress: BadgeProgress[]
}

export type HandymanBadgeMetrics = {
  servicesRendered: number
  companyRevenueNgn: number
  averageRating: number
}

export type HandymanBadgeTargets = {
  servicesRendered: number[]
  companyRevenueNgn: number[]
  averageRating: number[]
}

export const handymanBadgeTargetsDefault: HandymanBadgeTargets = {
  servicesRendered: [50, 150, 300],
  companyRevenueNgn: [500_000, 2_000_000, 5_000_000],
  averageRating: [4.5, 4.7, 4.85],
}

export const handymanBadgeTiers: BadgeTier[] = [
  {
    id: 'bronze',
    label: 'Bronze',
    minScore: 0,
    className: 'bg-primary/10 text-primary',
    description: 'Complete onboarding and start delivering consistent jobs.',
    requirements: ['Complete verification', 'Handle at least 10 jobs', 'Maintain 4.3★+ rating'],
  },
  {
    id: 'silver',
    label: 'Silver',
    minScore: 3,
    className: 'bg-muted text-muted-foreground',
    description: 'Reliability unlocked. You are in steady rotation for standard jobs.',
    requirements: ['50+ jobs completed', '₦500k+ revenue handled', '4.5★+ average rating'],
  },
  {
    id: 'gold',
    label: 'Gold',
    minScore: 6,
    className: 'bg-amber-600 text-amber-50',
    description: 'Trusted for emergency and concierge call-outs.',
    requirements: ['150+ jobs completed', '₦2m+ revenue handled', '4.7★+ average rating'],
  },
  {
    id: 'platinum',
    label: 'Platinum',
    minScore: 8,
    className: 'bg-primary text-primary-foreground',
    description: 'Elite tier with priority routing and referrals.',
    requirements: ['300+ jobs completed', '₦5m+ revenue handled', '4.85★+ average rating'],
  },
]

const countPoints = (current: number, thresholds: number[]) =>
  thresholds.reduce((score, threshold) => score + (current >= threshold ? 1 : 0), 0)

const nextThreshold = (current: number, thresholds: number[]) =>
  thresholds.find((threshold) => threshold > current)

const pickTier = (tiers: BadgeTier[], score: number) =>
  [...tiers].sort((a, b) => b.minScore - a.minScore).find((tier) => score >= tier.minScore) || tiers[0]

export const calculateHandymanBadge = (
  metrics: HandymanBadgeMetrics,
  targets: HandymanBadgeTargets = handymanBadgeTargetsDefault
): BadgeResult => {
  const servicePoints = countPoints(metrics.servicesRendered, targets.servicesRendered)
  const revenuePoints = countPoints(metrics.companyRevenueNgn, targets.companyRevenueNgn)
  const ratingPoints = countPoints(metrics.averageRating, targets.averageRating)

  const total = servicePoints + revenuePoints + ratingPoints
  const totalPossible = targets.servicesRendered.length + targets.companyRevenueNgn.length + targets.averageRating.length

  const tier = pickTier(handymanBadgeTiers, total)
  const nextTier = handymanBadgeTiers.find((candidate) => candidate.minScore > tier.minScore)

  const progress: BadgeProgress[] = [
    {
      key: 'servicesRendered',
      label: 'Services',
      current: metrics.servicesRendered,
      target: nextThreshold(metrics.servicesRendered, targets.servicesRendered),
      met: servicePoints === targets.servicesRendered.length,
    },
    {
      key: 'companyRevenueNgn',
      label: 'Revenue',
      current: metrics.companyRevenueNgn,
      target: nextThreshold(metrics.companyRevenueNgn, targets.companyRevenueNgn),
      met: revenuePoints === targets.companyRevenueNgn.length,
      unit: '₦',
    },
    {
      key: 'averageRating',
      label: 'Average rating',
      current: metrics.averageRating,
      target: nextThreshold(metrics.averageRating, targets.averageRating),
      met: ratingPoints === targets.averageRating.length,
    },
  ]

  return {
    tier,
    label: `${tier.label}`,
    className: tier.className,
    score: total,
    totalPossible,
    nextTier,
    progress,
  }
}

export type HomerunnerBadgeMetrics = {
  viewingsHosted: number
  inspectionsCompleted: number
  conversionRate: number
  averageRating: number
}

export type HomerunnerBadgeTargets = {
  viewingsHosted: number[]
  inspectionsCompleted: number[]
  conversionRate: number[]
  averageRating: number[]
}

export const homerunnerBadgeTargetsDefault: HomerunnerBadgeTargets = {
  viewingsHosted: [10, 40, 100],
  inspectionsCompleted: [5, 20, 50],
  conversionRate: [20, 35, 50],
  averageRating: [4.5, 4.7, 4.85],
}

export const homerunnerBadgeTiers: BadgeTier[] = [
  {
    id: 'bronze',
    label: 'Bronze',
    minScore: 0,
    className: 'bg-primary/10 text-primary',
    description: 'Completed onboarding and started hosting viewings.',
    requirements: ['Finish verification', 'Host first 5 viewings', 'Keep response time fast'],
  },
  {
    id: 'silver',
    label: 'Silver',
    minScore: 4,
    className: 'bg-muted text-muted-foreground',
    description: 'Reliable host trusted for standard appointments.',
    requirements: ['40+ viewings hosted', '20+ inspections completed', '4.5★+ rating', '20%+ conversion'],
  },
  {
    id: 'gold',
    label: 'Gold',
    minScore: 8,
    className: 'bg-amber-600 text-amber-50',
    description: 'High-performing host for premium properties.',
    requirements: ['100+ viewings', '50+ inspections', '4.7★+ rating', '35%+ conversion'],
  },
  {
    id: 'platinum',
    label: 'Platinum',
    minScore: 10,
    className: 'bg-primary text-primary-foreground',
    description: 'Elite homerunner with concierge-level service.',
    requirements: ['150+ viewings', '80+ inspections', '4.85★+ rating', '50%+ conversion'],
  },
]

export const calculateHomerunnerBadge = (
  metrics: HomerunnerBadgeMetrics,
  targets: HomerunnerBadgeTargets = homerunnerBadgeTargetsDefault
): BadgeResult => {
  const viewingPoints = countPoints(metrics.viewingsHosted, targets.viewingsHosted)
  const inspectionPoints = countPoints(metrics.inspectionsCompleted, targets.inspectionsCompleted)
  const conversionPoints = countPoints(metrics.conversionRate, targets.conversionRate)
  const ratingPoints = countPoints(metrics.averageRating, targets.averageRating)

  const total = viewingPoints + inspectionPoints + conversionPoints + ratingPoints
  const totalPossible =
    targets.viewingsHosted.length +
    targets.inspectionsCompleted.length +
    targets.conversionRate.length +
    targets.averageRating.length

  const tier = pickTier(homerunnerBadgeTiers, total)
  const nextTier = homerunnerBadgeTiers.find((candidate) => candidate.minScore > tier.minScore)

  const progress: BadgeProgress[] = [
    {
      key: 'viewingsHosted',
      label: 'Viewings hosted',
      current: metrics.viewingsHosted,
      target: nextThreshold(metrics.viewingsHosted, targets.viewingsHosted),
      met: viewingPoints === targets.viewingsHosted.length,
    },
    {
      key: 'inspectionsCompleted',
      label: 'Inspections',
      current: metrics.inspectionsCompleted,
      target: nextThreshold(metrics.inspectionsCompleted, targets.inspectionsCompleted),
      met: inspectionPoints === targets.inspectionsCompleted.length,
    },
    {
      key: 'conversionRate',
      label: 'Conversion rate',
      current: metrics.conversionRate,
      target: nextThreshold(metrics.conversionRate, targets.conversionRate),
      met: conversionPoints === targets.conversionRate.length,
      unit: '%',
    },
    {
      key: 'averageRating',
      label: 'Average rating',
      current: metrics.averageRating,
      target: nextThreshold(metrics.averageRating, targets.averageRating),
      met: ratingPoints === targets.averageRating.length,
    },
  ]

  return {
    tier,
    label: `${tier.label}`,
    className: tier.className,
    score: total,
    totalPossible,
    nextTier,
    progress,
  }
}

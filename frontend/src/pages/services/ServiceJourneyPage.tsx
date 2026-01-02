import { useEffect, useMemo, useState, useCallback } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { Sidebar } from '@/widgets/sidebar'
import { AuthDialog } from '@/widgets/auth-dialog'
import { ArrowLeft, CheckCircle2, NotebookPen, PhoneCall, Sparkles } from 'lucide-react'
import { howItWorksSteps, type HowItWorksStepId } from './data/how-it-works'
import { serviceCategories, type UIServiceCategory as ServiceCategory } from '@/__mocks__/data/services.mock'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/store/auth.store'
import { Label } from '@/shared/ui/label'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import toast from 'react-hot-toast'

type ServiceSummary = {
  title: string
  blurb: string
  stats?: Array<{ label: string; value: string }>
}

type StepDetail = {
  description: string
  bullets?: string[]
  outcome?: string
  helper?: string
}

type JourneyConfig = {
  slug: string
  eyebrow: string
  title: string
  description: string
  heroHighlight?: string
  heroHelper?: string
  primaryCta?: {
    label: string
    to?: string
    requiresAuth?: boolean
  }
  secondaryCta?: {
    label: string
    to?: string
  }
  steps: Record<HowItWorksStepId, StepDetail>
  resources?: Array<{ title: string; description: string }>
  serviceSummary?: ServiceSummary
}

type FlowContext = {
  serviceId?: string | null
  service?: ServiceCategory['services'][number]
  category?: ServiceCategory
}

type RequestFormState = {
  whatToRepair: string
  issueDetails: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  accessNotes: string
}

const createDefaultRequestFormState = (serviceTitle?: string): RequestFormState => ({
  whatToRepair: serviceTitle ?? '',
  issueDetails: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  accessNotes: '',
})

const flowConfigFactories: Record<string, (ctx: FlowContext) => JourneyConfig> = {
  'maintenance-plans': () => ({
    slug: 'maintenance-plans',
    eyebrow: 'Maintenance Concierge',
    title: 'Build your preventive maintenance plan',
    description:
      'Lock in predictable maintenance costs, proactive inspections and rapid response support tailored to your property portfolio.',
    heroHighlight: 'We craft aligned plans within 24 hours of your briefing.',
    primaryCta: {
      label: 'Start maintenance assessment',
      to: `${ROUTES.MY_SERVICES}?intent=maintenance-plan`,
      requiresAuth: true,
    },
    secondaryCta: {
      label: 'Speak with a concierge',
      to: ROUTES.CONTACT,
    },
    steps: {
      connect: {
        description:
          'Share property profiles, current issues and preferred schedule so we can benchmark the right crews.',
        bullets: [
          'Upload photos, voice notes or past reports for context.',
          'Select preferred visit cadence (weekly, monthly, quarterly).',
          'Tell us who to liaise with on-site and escalation preferences.',
        ],
        outcome: 'A tailored maintenance brief ready for costing.',
      },
      track: {
        description:
          'We curate vetted crews, plan coverage tiers and transparent pricing for your review in a live workspace.',
        bullets: [
          'Review itemised cost ranges and optional add-ons.',
          'Assign approvals and track milestone timelines in real-time.',
          'Chat with supervisors before sign-off inside the command center.',
        ],
        outcome: 'Confidence in scope, budget and SLAs before you commit.',
      },
      support: {
        description:
          'Activate the plan, get guaranteed response times and monthly performance insights from your concierge.',
        bullets: [
          'Book recurring visits or ad-hoc jobs from one dashboard.',
          'Receive digital reports with photos, invoices and recommendations.',
          'Escalate issues 24/7 with priority access to technical leads.',
        ],
        outcome: 'Predictable upkeep supported by a dedicated service team.',
      },
    },
    resources: [
      {
        title: 'What you receive',
        description:
          'Dedicated concierge, vetted artisan bench, quarterly asset health reports and warranty-backed workmanship.',
      },
      {
        title: 'Who it is for',
        description:
          'Landlords with multiple units, estate managers, co-working operators and busy homeowners seeking predictable care.',
      },
    ],
  }),
  'vetted-partner': () => ({
    slug: 'vetted-partner',
    eyebrow: 'Partner Programme',
    title: 'Join the vetted artisan network',
    description:
      'Become part of the top 5% of technicians we deploy across Nigeria. We back you with consistent jobs, digital tools and on-time payouts.',
    heroHighlight: 'Every partner passes skills, documentation and culture checks.',
    primaryCta: {
      label: 'Begin partner application',
      to: `${ROUTES.SIGNUP}?role=artisan`,
    },
    secondaryCta: {
      label: 'Review quality standards',
      to: `${ROUTES.SERVICES}?start=promise`,
    },
    steps: {
      connect: {
        description:
          'Tell us about your craft, team size and service regions so we can match you to the right categories.',
        bullets: [
          'Upload certifications, IDs and recent project evidence.',
          'Select preferred job types and emergency availability.',
          'Share references or testimonials to accelerate screening.',
        ],
        outcome: 'Application submitted to the partner concierge.',
      },
      track: {
        description:
          'Complete skills verification, virtual interviews and test jobs while tracking progress inside your portal.',
        bullets: [
          'Attend a quality orientation with our operations leads.',
          'Receive checklist feedback and update any compliance gaps.',
          'Preview our job management tools before activation.',
        ],
        outcome: 'Verified status and access to booking notifications.',
      },
      support: {
        description:
          'Accept assignments, deliver confidently and leverage our support squad for supplies, invoicing and client reviews.',
        bullets: [
          'Use the JulaazNG app to clock in, share updates and upload proof.',
          'Get paid fast with transparent metrics and bonus tiers.',
          'Access training refreshers and mentorship to scale your crew.',
        ],
        outcome: 'Sustained work pipeline with premium clients.',
      },
    },
    resources: [
      {
        title: 'Partner benefits',
        description:
          'Live job feed, dedicated coordinator, protective gear subsidies, dispute mediation and marketing exposure.',
      },
      {
        title: 'Expectations',
        description:
          'Background checks, punctuality scores, 4.7★+ average ratings and adherence to our code of conduct.',
      },
    ],
  }),
  request: ({ service, category, serviceId }) => {
    const serviceName = service?.title ?? 'Preferred crew'
    const averageRating = service?.rating ? `${service.rating.toFixed(2)}★ satisfaction` : 'Top-rated crews'
    const jobsCompleted = service?.jobsCompleted
      ? `${service.jobsCompleted.toLocaleString()} jobs delivered`
      : 'Hundreds of successful jobs'

    return {
      slug: 'request',
      eyebrow: category ? `${category.name} Crew` : 'Request a crew',
      title: `Request ${serviceName}`,
      description:
        service?.summary ??
        'Match with vetted professionals for your next project. Share context and we will deploy the best-fit crew.',
      heroHighlight: 'Your concierge reviews every request before assigning specialists.',
      primaryCta: {
        label: 'Confirm booking details',
        to: serviceId ? `${ROUTES.MY_SERVICES}?service=${serviceId}` : ROUTES.MY_SERVICES,
        requiresAuth: true,
      },
      secondaryCta: {
        label: 'Call the command center',
        to: ROUTES.CONTACT,
      },
      serviceSummary: {
        title: serviceName,
        blurb: service?.summary ?? 'Share your project goals and timelines to get started.',
        stats: [
          { label: 'Rating', value: averageRating },
          { label: 'Experience', value: jobsCompleted },
          { label: 'Starting from', value: service?.priceFrom ? `₦${service.priceFrom.toLocaleString()}` : 'Custom quote' },
        ],
      },
      steps: {
        connect: {
          description:
            'Give us the property access details, desired schedule and any materials already on-site. Upload media so we can brief the crew precisely.',
          bullets: [
            'Mention exact locations, asset models or measurements.',
            'Highlight previous fixes or warranties we should respect.',
            'Flag security protocols or estate permits we need to process.',
          ],
          outcome: 'Clarified scope and expectations for the assigned team.',
        },
        track: {
          description:
            'Your concierge shares the work plan, cost outline and live tracker so you approve milestones before work begins.',
          bullets: [
            'Approve or adjust the recommended crew line-up.',
            'Review digital job cards with timelines and dependencies.',
            'Chat with supervisors, share extra notes and approve start.',
          ],
          outcome: 'A scheduled crew with transparent milestones.',
        },
        support: {
          description:
            'Follow progress in-app, sign off with digital reports and schedule follow-up visits or maintenance plans seamlessly.',
          bullets: [
            'Receive photo/video updates as each milestone completes.',
            'Release payments securely once satisfied with outcomes.',
            'Convert the crew into a recurring maintenance squad if needed.',
          ],
          outcome: 'Job closed with warranty coverage and aftercare options.',
        },
      },
      resources: [
        {
          title: 'Need design or materials?',
          description: 'We can source materials, project managers and QS support. Mention it during Step 1.',
        },
        {
          title: 'Emergency request?',
          description: 'Tap the call button or mark as urgent so we dispatch standby crews within 90 minutes.',
        },
      ],
    }
  },
}

export function ServiceJourneyPage() {
  const navigate = useNavigate()
  const { journeySlug } = useParams<{ journeySlug: string }>()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, user } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  const slug = journeySlug ?? ''
  const serviceId = searchParams.get('service')

  const matchedService = useMemo(() => {
    if (!serviceId) return undefined

    for (const category of serviceCategories) {
      const service = category.services.find((item) => item.id === serviceId)
      if (service) {
        return { service, category }
      }
    }

    return undefined
  }, [serviceId])

  const configFactory = flowConfigFactories[slug]

  const [requestForm, setRequestForm] = useState<RequestFormState>(() =>
    createDefaultRequestFormState(matchedService?.service?.title)
  )
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false)
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)
  const [redeemPoints, setRedeemPoints] = useState(0)

  const resetRequestForm = useCallback(() => {
    setRequestForm(createDefaultRequestFormState(matchedService?.service?.title))
    setMediaFiles([])
  }, [matchedService])

  useEffect(() => {
    if (!configFactory) {
      navigate(ROUTES.SERVICES, { replace: true })
    }
  }, [configFactory, navigate])

  useEffect(() => {
    if (slug === 'request' && matchedService?.service?.title) {
      setRequestForm((prev) => ({
        ...prev,
        whatToRepair: prev.whatToRepair || matchedService.service.title,
      }))
    }
  }, [slug, matchedService])

  useEffect(() => {
    if (slug !== 'request') {
      setIsRequestFormOpen(false)
    }
  }, [slug])

  if (!configFactory) {
    return null
  }

  const config = configFactory({
    serviceId,
    service: matchedService?.service,
    category: matchedService?.category,
  })

  const orderedSteps = howItWorksSteps.map((step) => ({
    ...step,
    detail: config.steps[step.id],
  }))

  const isRequestJourney = config.slug === 'request'

  const handlePrimaryCta = () => {
    if (!config.primaryCta) return

    if (isRequestJourney) {
      if (!isAuthenticated) {
        setIsAuthOpen(true)
        return
      }

      resetRequestForm()
      setIsRequestFormOpen(true)
      return
    }

    if (config.primaryCta.requiresAuth && !isAuthenticated) {
      setIsAuthOpen(true)
      return
    }

    if (config.primaryCta.to) {
      navigate(config.primaryCta.to)
    }
  }

  const handleSecondaryCta = () => {
    if (!config.secondaryCta?.to) return
    navigate(config.secondaryCta.to)
  }

  const pointsBalance = user?.pointsBalance ?? 0
  const lifetimePoints = user?.lifetimePoints ?? pointsBalance
  const estimatedBase = matchedService?.service?.priceFrom ?? 150000
  const earnPoints = Math.floor(estimatedBase / 10000)
  const redemptionValuePerPoint = 100
  const maxRedeemable = pointsBalance
  const clampedRedeemPoints = Math.min(Math.max(redeemPoints, 0), maxRedeemable)
  const redeemValue = clampedRedeemPoints * redemptionValuePerPoint
  const estimatedPayable = Math.max(estimatedBase - redeemValue, 0)

  const handleMenuClick = () => setIsSidebarOpen(true)

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate(ROUTES.PROFILE)
    } else {
      setIsAuthOpen(true)
    }
  }

  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      setMediaFiles([])
      return
    }

    const files = Array.from(event.target.files).slice(0, 5)
    setMediaFiles(files)
  }

  const handleRequestSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmittingRequest(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsSubmittingRequest(false)
    setIsRequestFormOpen(false)
    toast.success('Thanks! Your request is now pending. Our concierge will reach out shortly.')

    resetRequestForm()

    const pendingRoute = `${ROUTES.MY_SERVICES}?status=pending${serviceId ? `&service=${serviceId}` : ''}`
    navigate(pendingRoute)
  }

  const handleCloseRequestForm = () => {
    setIsRequestFormOpen(false)
    resetRequestForm()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} className="lg:shadow-sm" />

      <main className="flex-1 text-foreground">
        <section className="border-b border-border/60 bg-surface/50">
          <div className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-12 md:py-16 lg:py-20 space-y-8">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="inline-flex items-center gap-2 px-3 py-1 text-xs md:text-sm"
                onClick={() => navigate(ROUTES.SERVICES)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to services
              </Button>
            </div>
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-4 w-4" />
                {config.eyebrow}
              </span>
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">{config.title}</h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-3xl">{config.description}</p>
              </div>
              {config.heroHighlight && (
                <Card className="border border-primary/20 bg-primary/10 text-primary p-6 rounded-3xl shadow-none">
                  <p className="text-sm md:text-base font-medium">{config.heroHighlight}</p>
                  {config.heroHelper && <p className="mt-2 text-xs md:text-sm text-primary/80">{config.heroHelper}</p>}
                </Card>
              )}

              {config.serviceSummary && (
                <Card className="border border-border/60 bg-background/80 rounded-3xl p-6 shadow-sm">
                  <div className="space-y-4 md:space-y-0 md:flex md:items-start md:justify-between gap-6">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">Crew snapshot</p>
                      <h2 className="text-2xl font-semibold">{config.serviceSummary.title}</h2>
                      <p className="text-sm text-muted-foreground max-w-xl">{config.serviceSummary.blurb}</p>
                    </div>
                    {config.serviceSummary.stats && (
                      <div className="grid gap-3 sm:grid-cols-3">
                        {config.serviceSummary.stats.map(({ label, value }) => (
                          <div key={label} className="rounded-2xl bg-muted/60 px-4 py-3 text-sm">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                            <p className="text-sm font-semibold text-foreground">{value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {config.primaryCta && (
                  <Button className="rounded-xl h-11 px-6" onClick={handlePrimaryCta}>
                    <NotebookPen className="mr-2 h-4 w-4" />
                    {config.primaryCta.label}
                  </Button>
                )}
                {config.secondaryCta && (
                  <Button variant="outline" className="rounded-xl h-11 px-6" onClick={handleSecondaryCta}>
                    <PhoneCall className="mr-2 h-4 w-4" />
                    {config.secondaryCta.label}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-12 md:py-16 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold">Follow the How It Works pathway</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
              Every journey follows the same trusted concierge flow. Here is what each step means for this request.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {orderedSteps.map(({ id, title, icon: Icon, detail }, index) => (
              <Card key={id} className="h-full border border-border/60 bg-background/80 rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
                  <p className="text-sm text-foreground leading-relaxed">{detail.description}</p>
                </div>
                {detail.bullets && (
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {detail.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {detail.helper && (
                  <p className="mt-4 text-xs text-muted-foreground/80 italic">{detail.helper}</p>
                )}
                {detail.outcome && (
                  <div className="mt-auto pt-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground/80">Outcome</p>
                    <p className="text-sm text-foreground">{detail.outcome}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {config.resources && config.resources.length > 0 && (
          <section className="border-t border-border/60 bg-surface/60">
            <div className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-12 md:py-16 space-y-6">
              <h3 className="text-xl md:text-2xl font-semibold">What else to expect</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {config.resources.map((resource) => (
                  <Card key={resource.title} className="border border-border/60 bg-background/80 rounded-2xl p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-foreground">{resource.title}</h4>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{resource.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      {isRequestJourney && isRequestFormOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-6"
          onClick={handleCloseRequestForm}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-background shadow-2xl border border-border/80 overflow-hidden flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-border/60 bg-muted/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Service intake
                  </p>
                  <h2 className="text-xl md:text-2xl font-semibold text-foreground">Confirm booking details</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCloseRequestForm}>
                  Close
                </Button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground max-w-xl">
                Share a quick brief so we can assign the right specialists and prepare for diagnostics.
              </p>
            </div>

            <form className="px-6 py-6 space-y-6 overflow-y-auto max-h-[75vh]" onSubmit={handleRequestSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="whatToRepair">What do you need us to work on?</Label>
                  <Input
                    id="whatToRepair"
                    value={requestForm.whatToRepair}
                    onChange={(event) =>
                      setRequestForm((prev) => ({ ...prev, whatToRepair: event.target.value }))
                    }
                    placeholder="e.g. 3HP Split AC not cooling"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="issueDetails">Helpful notes for diagnosis</Label>
                  <Textarea
                    id="issueDetails"
                    value={requestForm.issueDetails}
                    onChange={(event) =>
                      setRequestForm((prev) => ({ ...prev, issueDetails: event.target.value }))
                    }
                    placeholder="Tell us the symptoms, previous fixes attempted, error codes, recurring issues..."
                    required
                    rows={4}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="mediaFiles">Photos or videos (optional)</Label>
                  <Input
                    id="mediaFiles"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaChange}
                  />
                  {mediaFiles.length > 0 && (
                    <div className="rounded-2xl border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground space-y-1">
                      <p className="font-medium text-foreground">Attached files</p>
                      <ul className="space-y-1">
                        {mediaFiles.map((file) => (
                          <li key={file.name} className="truncate">
                            {file.name} ({Math.round(file.size / 1024)} KB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload up to 5 files. Clear media helps us prep parts and the right crew.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="addressLine1">Service address</Label>
                  <Input
                    id="addressLine1"
                    value={requestForm.addressLine1}
                    onChange={(event) =>
                      setRequestForm((prev) => ({ ...prev, addressLine1: event.target.value }))
                    }
                    placeholder="Street address or property name"
                    required
                  />
                </div>

                <Card className="border border-primary/20 bg-primary/5 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-primary font-semibold">Loyalty</p>
                      <p className="text-sm text-muted-foreground">Earn 1pt per ₦10,000 on services • first rental/booking/service: 1pt per ₦20,000</p>
                    </div>
                    <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                      {pointsBalance.toLocaleString('en-NG')} pts
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-border/60 bg-background/80 p-3 space-y-1">
                      <p className="text-xs text-muted-foreground">Estimated billable</p>
                      <p className="text-lg font-semibold text-foreground">₦{estimatedBase.toLocaleString('en-NG')}</p>
                      <p className="text-xs text-muted-foreground">Earn ≈ {earnPoints} pts</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/80 p-3 space-y-1">
                      <p className="text-xs text-muted-foreground">Redeem points on services</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={maxRedeemable}
                          value={clampedRedeemPoints}
                          onChange={(event) => {
                            const next = Number(event.target.value)
                            if (Number.isNaN(next)) {
                              setRedeemPoints(0)
                              return
                            }
                            setRedeemPoints(Math.min(Math.max(next, 0), maxRedeemable))
                          }}
                          className="h-10"
                        />
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          ₦{redeemValue.toLocaleString('en-NG')} off
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Balance after redeem: {(pointsBalance - clampedRedeemPoints).toLocaleString('en-NG')} pts</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-muted-foreground">Lifetime earned: {lifetimePoints.toLocaleString('en-NG')} pts</span>
                    <span className="font-semibold text-foreground">Estimated payable: ₦{estimatedPayable.toLocaleString('en-NG')}</span>
                  </div>
                </Card>
                <div className="grid gap-2">
                  <Label htmlFor="addressLine2">
                    Additional address details <span className="text-xs text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="addressLine2"
                    value={requestForm.addressLine2}
                    onChange={(event) =>
                      setRequestForm((prev) => ({ ...prev, addressLine2: event.target.value }))
                    }
                    placeholder="Gate code, apartment number, floor..."
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={requestForm.city}
                      onChange={(event) =>
                        setRequestForm((prev) => ({ ...prev, city: event.target.value }))
                      }
                      placeholder="e.g. Lagos"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={requestForm.state}
                      onChange={(event) =>
                        setRequestForm((prev) => ({ ...prev, state: event.target.value }))
                      }
                      placeholder="e.g. Lagos State"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="accessNotes">
                    Access / concierge notes <span className="text-xs text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="accessNotes"
                    value={requestForm.accessNotes}
                    onChange={(event) =>
                      setRequestForm((prev) => ({ ...prev, accessNotes: event.target.value }))
                    }
                    placeholder="Who we should meet on arrival, power cut-off instructions, parking info..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
                <Button variant="ghost" type="button" onClick={handleCloseRequestForm}>
                  Cancel
                </Button>
                <Button type="submit" className="sm:min-w-[160px]" disabled={isSubmittingRequest}>
                  {isSubmittingRequest ? 'Submitting...' : 'Submit request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


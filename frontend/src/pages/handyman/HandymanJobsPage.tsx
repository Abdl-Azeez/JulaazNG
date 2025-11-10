import { useMemo, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import {
  Briefcase,
  Filter,
  MapPin,
  Clock,
  Wallet,
  ChevronRight,
  Search,
  Layers,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import {
  JobBriefDrawer,
  ClaimJobDrawer,
  PlaybookDrawer,
} from './components'

const jobCategories = [
  { id: 'all', label: 'All jobs' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'maintenance', label: 'Maintenance cycles' },
  { id: 'installations', label: 'Installations' },
  { id: 'projects', label: 'Project support' },
]

const jobBoard = [
  {
    id: 'board-001',
    category: 'emergency',
    title: 'Emergency generator diagnostics',
    payout: '₦75,000',
    responseWindow: 'Dispatch within 45 min',
    location: 'Ikoyi, Lagos',
    shift: 'Today • 8:30 PM',
    badges: ['Priority', 'Requires two-man crew'],
  },
  {
    id: 'board-002',
    category: 'maintenance',
    title: 'Monthly water treatment cycle',
    payout: '₦40,000',
    responseWindow: 'Schedule by 11 AM',
    location: 'Magodo GRA, Lagos',
    shift: 'Tomorrow • 9:00 AM',
    badges: ['Recurring'],
  },
  {
    id: 'board-003',
    category: 'installations',
    title: 'Smart lock & CCTV installation',
    payout: '₦110,000',
    responseWindow: 'Confirm availability before 1 PM',
    location: 'Surulere, Lagos',
    shift: 'In 2 days • 12:00 PM',
    badges: ['Premium client', 'Materials supplied'],
  },
]

export function HandymanJobsPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isJobBriefOpen, setIsJobBriefOpen] = useState(false)
  const [isClaimJobOpen, setIsClaimJobOpen] = useState(false)
  const [isPlaybookOpen, setIsPlaybookOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>()

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE)
  }

  const filteredJobs = useMemo(() => {
    return jobBoard.filter((job) => {
      const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory
      const matchesSearch = searchTerm
        ? job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
        : true
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={handleProfileClick}
        className="lg:shadow-sm"
      />

      <main className="flex-1">
        <section className="border-b border-border/60 bg-surface/60">
          <div className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-10 lg:py-14 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-3">
                <Badge className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                  Jobs board
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Claim new assignments</h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Select jobs that match your skillset and service radius. Confirm availability to reserve a
                  slot. Emergency requests show up first—respond quickly to maintain elite ranking.
                </p>
              </div>
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-5 space-y-3 max-w-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Tips for bigger payouts</p>
                </div>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li>• Accept jobs within 15 minutes for priority bonus.</li>
                  <li>• Upload clear progress photos to unlock concierge reward.</li>
                  <li>• Mark tasks complete before requesting release of funds.</li>
                </ul>
                <Button
                  variant="ghost"
                  className="rounded-xl h-10 px-3 text-sm"
                  onClick={() => setIsPlaybookOpen(true)}
                >
                  View playbook
                </Button>
              </Card>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px] sm:max-w-xs">
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search jobs or locations"
                  className="pl-10 h-11 rounded-xl"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="outline" className="rounded-xl h-11 px-4 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced filters
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {jobCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-medium transition-all',
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-8 lg:py-12 space-y-5">
          {filteredJobs.length === 0 ? (
            <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-10 text-center space-y-3">
              <Layers className="h-10 w-10 mx-auto text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">No jobs match your filters yet</h2>
              <p className="text-sm text-muted-foreground">
                Adjust your categories or expand your service radius to see more opportunities.
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" className="rounded-xl h-10 px-4 text-sm">
                  Reset filters
                </Button>
                <Button className="rounded-xl h-10 px-4 text-sm">Update service radius</Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={cn(
                          'rounded-full px-3 py-1 text-xs font-medium',
                          job.category === 'emergency'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-primary/10 text-primary'
                        )}
                      >
                        {job.category === 'emergency'
                          ? 'Emergency response'
                          : job.category === 'maintenance'
                          ? 'Maintenance'
                          : job.category === 'installations'
                          ? 'Installation'
                          : 'Project'}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{job.responseWindow}</p>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">{job.title}</h2>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Wallet className="h-3.5 w-3.5 text-primary" />
                        {job.payout}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {job.shift}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {job.location}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.badges.map((badge) => (
                        <Badge key={badge} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Button
                      className="rounded-xl h-10 px-4 text-sm flex items-center gap-2"
                      onClick={() => {
                        setSelectedJobId(job.id)
                        setIsJobBriefOpen(true)
                      }}
                    >
                      <Briefcase className="h-4 w-4" />
                      View job brief
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl h-10 px-4 text-sm flex items-center gap-2"
                      onClick={() => {
                        setSelectedJobId(job.id)
                        setIsClaimJobOpen(true)
                      }}
                    >
                      Claim job
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <JobBriefDrawer
        open={isJobBriefOpen}
        onOpenChange={setIsJobBriefOpen}
        jobId={selectedJobId}
        onClaim={() => {
          setIsJobBriefOpen(false)
          setIsClaimJobOpen(true)
        }}
      />
      <ClaimJobDrawer
        open={isClaimJobOpen}
        onOpenChange={setIsClaimJobOpen}
        jobId={selectedJobId}
      />
      <PlaybookDrawer open={isPlaybookOpen} onOpenChange={setIsPlaybookOpen} />
    </div>
  )
}


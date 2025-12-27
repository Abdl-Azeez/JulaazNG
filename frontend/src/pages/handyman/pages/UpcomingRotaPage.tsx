import { useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Calendar, ChevronLeft, ChevronRight, MapPin, Phone, Clock, User, ArrowLeft } from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { JobSheetDrawer } from '../components'
import { rotaData } from '@/__mocks__/data/handyman.mock'

export function UpcomingRotaPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [isJobSheetOpen, setIsJobSheetOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>()

console.log(currentWeek)
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(true)} className="lg:shadow-sm" />

      <main className="flex-1">
        <section className="border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-10 lg:py-14">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl -ml-2"
                    onClick={() => navigate(ROUTES.HANDYMAN_DASHBOARD)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Badge className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                    Upcoming Rota
                  </Badge>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Your Schedule</h1>
                <p className="text-muted-foreground max-w-2xl">
                  View and manage your upcoming assignments. Confirm attendance and update your availability.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setCurrentWeek((prev) => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setCurrentWeek((prev) => prev + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl h-11 px-5 flex items-center gap-2"
                  onClick={() => navigate(ROUTES.HANDYMAN_DASHBOARD)}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-8 lg:py-12 space-y-6">
          {rotaData.map((day) => (
            <Card key={day.id} className="rounded-2xl border border-border/60 bg-background/80 shadow-sm">
              <div className="p-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{day.day}</h2>
                    <p className="text-xs text-muted-foreground">{day.date}</p>
                  </div>
                  <Badge className="ml-auto rounded-full bg-primary/10 text-primary px-3 py-1 text-xs">
                    {day.jobs.length} {day.jobs.length === 1 ? 'job' : 'jobs'}
                  </Badge>
                </div>
              </div>
              <div className="divide-y divide-border/60">
                {day.jobs.map((job) => (
                  <div key={job.id} className="p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">{job.time}</span>
                        </div>
                        <Badge
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-[11px]',
                            job.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-amber-500/10 text-amber-600'
                          )}
                        >
                          {job.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Duration: {job.duration}</span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{job.client}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-primary" />
                          {job.contact}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col lg:items-end gap-2">
                      <Button 
                        className="rounded-xl h-10 px-4 text-sm"
                        onClick={() => {
                          setSelectedJobId(job.id)
                          setIsJobSheetOpen(true)
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <JobSheetDrawer 
        open={isJobSheetOpen} 
        onOpenChange={setIsJobSheetOpen}
        jobId={selectedJobId}
      />
    </div>
  )
}


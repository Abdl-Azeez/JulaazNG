import { useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Search, Filter, MapPin, Phone, Calendar } from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { allAssignments, statusFilters } from '@/__mocks__/data/handyman.mock'

export function ViewAllAssignmentsPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredAssignments = allAssignments.filter((assignment) => {
    const matchesSearch =
      searchTerm === '' ||
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(true)} className="lg:shadow-sm" />

      <main className="flex-1">
        <section className="border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-10 lg:py-14">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-3">
                <Badge className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                  All Assignments
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Your Assignments</h1>
                <p className="text-muted-foreground max-w-2xl">
                  View and manage all your assigned jobs. Filter by status, search by client or location.
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded-xl h-11 px-5 flex items-center gap-2"
                onClick={() => navigate(ROUTES.HANDYMAN_DASHBOARD)}
              >
                Back to Dashboard
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px] sm:max-w-xs">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search assignments..."
                  className="pl-10 h-11 rounded-xl"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="outline" className="rounded-xl h-11 px-4 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedStatus(filter.id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-medium transition-all',
                    selectedStatus === filter.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-8 lg:py-12">
          {filteredAssignments.length === 0 ? (
            <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-10 text-center space-y-3">
              <p className="text-lg font-semibold text-foreground">No assignments found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAssignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-[11px]',
                          assignment.badge === 'Priority'
                            ? 'bg-destructive/10 text-destructive'
                            : assignment.badge === 'Premium'
                            ? 'bg-purple-500/10 text-purple-600'
                            : 'bg-primary/10 text-primary'
                        )}
                      >
                        {assignment.badge}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{assignment.scheduledFor}</span>
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">{assignment.client}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {assignment.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        {assignment.contact}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col lg:items-end gap-2">
                    <Badge
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium',
                        assignment.status === 'enroute'
                          ? 'bg-amber-500/10 text-amber-600'
                          : assignment.status === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {assignment.status === 'enroute' ? 'En Route' : assignment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </Badge>
                    <Button className="rounded-xl h-10 px-4 text-sm">Open job sheet</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}


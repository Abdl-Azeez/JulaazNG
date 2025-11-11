import { ResponsiveDrawer } from './ResponsiveDrawer'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { MapPin, Phone, Calendar, Clock, User, FileText, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'

interface JobSheetDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobId?: string
}

const jobSheetData = {
  id: 'job-001',
  title: 'Emergency Electrical Diagnostics',
  client: 'Victoria Crest Apartments',
  scheduledFor: 'Today • 4:00 PM',
  location: 'Lekki Phase 1, Lagos',
  fullAddress: '123 Victoria Island Road, Lekki Phase 1, Lagos State',
  contact: '+234 801 234 5678',
  contactName: 'Mr. Adebayo',
  status: 'enroute',
  priority: 'High',
  estimatedDuration: '2-3 hours',
  payout: '₦75,000',
  description:
    'Emergency electrical diagnostics required. Multiple power outages reported in building. Need to check main electrical panel, circuit breakers, and wiring integrity.',
  tasks: [
    { id: 'task-1', label: 'Inspect main electrical panel', completed: false },
    { id: 'task-2', label: 'Check circuit breakers functionality', completed: false },
    { id: 'task-3', label: 'Test wiring integrity', completed: false },
    { id: 'task-4', label: 'Document findings with photos', completed: false },
    { id: 'task-5', label: 'Provide diagnostic report', completed: false },
  ],
  notes: 'Building has backup generator. Ensure proper safety protocols. Client prefers evening visit.',
}

export function JobSheetDrawer({ open, onOpenChange, jobId }: JobSheetDrawerProps) {
  const completedTasks = jobSheetData.tasks.filter((task) => task.completed).length
  const progress = Math.round((completedTasks / jobSheetData.tasks.length) * 100)

  return (
    <ResponsiveDrawer open={open} onOpenChange={onOpenChange} title="Job Sheet" side="bottom">
      <div className="space-y-6">
        {/* Job Header */}
        <Card className="p-4 rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-background">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="rounded-full bg-destructive/10 text-destructive px-3 py-1 text-xs">
                  {jobSheetData.priority} Priority
                </Badge>
                <Badge
                  className={cn(
                    'rounded-full px-3 py-1 text-xs',
                    jobSheetData.status === 'enroute'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-emerald-500/10 text-emerald-600'
                  )}
                >
                  {jobSheetData.status === 'enroute' ? 'En Route' : 'Confirmed'}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{jobSheetData.title}</h3>
              <p className="text-sm text-muted-foreground">{jobSheetData.client}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{jobSheetData.estimatedDuration}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{jobSheetData.payout}</span>
            </div>
          </div>
        </Card>

        {/* Job Details */}
        <Card className="p-4 rounded-xl border border-border/60">
          <h4 className="text-sm font-semibold mb-3 text-foreground">Job Details</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-muted-foreground">Scheduled For</p>
                <p className="font-medium text-foreground">{jobSheetData.scheduledFor}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">{jobSheetData.location}</p>
                <p className="text-xs text-muted-foreground mt-1">{jobSheetData.fullAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-muted-foreground">Contact</p>
                <p className="font-medium text-foreground">{jobSheetData.contactName}</p>
                <p className="text-xs text-muted-foreground mt-1">{jobSheetData.contact}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-4 rounded-xl border border-border/60">
          <h4 className="text-sm font-semibold mb-3 text-foreground">Description</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{jobSheetData.description}</p>
        </Card>

        {/* Tasks */}
        <Card className="p-4 rounded-xl border border-border/60">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Tasks</h4>
            <Badge className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs">
              {progress}% Complete
            </Badge>
          </div>
          <div className="space-y-2">
            {jobSheetData.tasks.map((task) => (
              <label
                key={task.id}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors',
                  task.completed ? 'bg-primary/5' : 'hover:bg-muted/50'
                )}
              >
                <div className="flex-shrink-0">
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <span className={cn('text-sm', task.completed && 'line-through text-muted-foreground')}>
                  {task.label}
                </span>
              </label>
            ))}
          </div>
        </Card>

        {/* Notes */}
        {jobSheetData.notes && (
          <Card className="p-4 rounded-xl border border-border/60 bg-amber-50/50 dark:bg-amber-950/20">
            <h4 className="text-sm font-semibold mb-2 text-foreground">Important Notes</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{jobSheetData.notes}</p>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="flex-1 rounded-xl">Update Progress</Button>
        </div>
      </div>
    </ResponsiveDrawer>
  )
}


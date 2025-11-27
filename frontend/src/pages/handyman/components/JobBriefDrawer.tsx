import { ResponsiveDrawer } from './ResponsiveDrawer'
import { ReportButton } from '@/widgets/report-button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { MapPin, Calendar, Clock, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react'

interface JobBriefDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobId?: string
  onClaim?: () => void
}

const jobBriefData = {
  id: 'board-001',
  title: 'Emergency generator diagnostics',
  category: 'emergency',
  payout: '₦75,000',
  responseWindow: 'Dispatch within 45 min',
  location: 'Ikoyi, Lagos',
  fullAddress: '456 Bourdillon Road, Ikoyi, Lagos State',
  shift: 'Today • 8:30 PM',
  badges: ['Priority', 'Requires two-man crew'],
  description:
    'Emergency generator diagnostics required. Generator failed to start during power outage. Need immediate inspection and diagnosis of the issue.',
  requirements: [
    'Valid electrical certification',
    'Experience with generator systems',
    'Ability to work in confined spaces',
    'Own transportation required',
  ],
  estimatedDuration: '2-3 hours',
  materialsProvided: true,
  accessInstructions: 'Use side gate entrance. Security guard will be notified. Contact: +234 801 234 5678',
}

export function JobBriefDrawer({ open, onOpenChange, jobId, onClaim }: JobBriefDrawerProps) {
  const handleClaim = () => {
    onClaim?.()
    onOpenChange(false)
  }

  console.log('jobId', jobId)

  return (
    <ResponsiveDrawer open={open} onOpenChange={onOpenChange} title="Job Brief" side="bottom">
      <div className="space-y-6">
        {/* Job Header */}
        <Card className="p-4 rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-background">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className="rounded-full bg-destructive/10 text-destructive px-3 py-1 text-xs">
                  {jobBriefData.category === 'emergency' ? 'Emergency' : 'Standard'}
                </Badge>
                {jobBriefData.badges.map((badge) => (
                  <Badge key={badge} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{jobBriefData.title}</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{jobBriefData.payout}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{jobBriefData.estimatedDuration}</span>
            </div>
          </div>
        </Card>

        {/* Job Details */}
        <Card className="p-4 rounded-xl border border-border/60">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Job Details</h4>
            <ReportButton
              reportedEntity={{
                id: jobBriefData.id + '-client',
                name: jobBriefData.location || 'Client',
                type: 'user',
                role: 'customer',
              }}
              reportType="customer"
              relatedTo={{
                type: 'service_booking',
                id: jobBriefData.id,
                title: jobBriefData.title,
              }}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
            />
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-muted-foreground">Scheduled For</p>
                <p className="font-medium text-foreground">{jobBriefData.shift}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">{jobBriefData.location}</p>
                <p className="text-xs text-muted-foreground mt-1">{jobBriefData.fullAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-muted-foreground">Response Window</p>
                <p className="font-medium text-foreground">{jobBriefData.responseWindow}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-4 rounded-xl border border-border/60">
          <h4 className="text-sm font-semibold mb-3 text-foreground">Description</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{jobBriefData.description}</p>
        </Card>

        {/* Requirements */}
        <Card className="p-4 rounded-xl border border-border/60">
          <h4 className="text-sm font-semibold mb-3 text-foreground">Requirements</h4>
          <div className="space-y-2">
            {jobBriefData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{requirement}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Additional Info */}
        <Card className="p-4 rounded-xl border border-border/60">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Materials {jobBriefData.materialsProvided ? 'Provided' : 'Not Provided'}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Access Instructions</p>
              <p className="text-sm text-foreground">{jobBriefData.accessInstructions}</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="flex-1 rounded-xl" onClick={handleClaim}>
            Claim Job
          </Button>
        </div>
      </div>
    </ResponsiveDrawer>
  )
}


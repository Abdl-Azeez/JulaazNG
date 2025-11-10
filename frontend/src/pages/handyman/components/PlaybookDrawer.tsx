import { ResponsiveDrawer } from './ResponsiveDrawer'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { BookOpen, CheckCircle2, Star, Clock, DollarSign, Camera, FileText } from 'lucide-react'

const playbookSections = [
  {
    id: 'acceptance',
    title: 'Job Acceptance',
    icon: CheckCircle2,
    tips: [
      'Accept jobs within 15 minutes for priority bonus (₦5,000-₦10,000 extra)',
      'Review job brief thoroughly before claiming',
      'Confirm your availability matches the response window',
      'Check travel distance and ensure you can arrive on time',
    ],
  },
  {
    id: 'documentation',
    title: 'Documentation & Photos',
    icon: Camera,
    tips: [
      'Take clear before/after photos of all work completed',
      'Document any issues or unexpected findings',
      'Upload progress photos at each milestone',
      'Submit photos within 2 hours of job completion for bonus',
    ],
  },
  {
    id: 'completion',
    title: 'Job Completion',
    icon: FileText,
    tips: [
      'Mark all tasks complete before requesting payment release',
      'Provide detailed completion notes',
      'Get client signature/approval when required',
      'Submit all documentation within 24 hours',
    ],
  },
  {
    id: 'payouts',
    title: 'Maximizing Payouts',
    icon: DollarSign,
    tips: [
      'Complete jobs on time to maintain elite status',
      'Maintain 4.8+ star rating for premium job access',
      'Upload quality photos to unlock concierge rewards',
      'Accept emergency jobs quickly for priority bonuses',
    ],
  },
  {
    id: 'ratings',
    title: 'Building Your Rating',
    icon: Star,
    tips: [
      'Communicate clearly with clients throughout the job',
      'Arrive on time or notify of delays immediately',
      'Clean up work area after completion',
      'Follow up with clients after 24 hours for feedback',
    ],
  },
  {
    id: 'response',
    title: 'Response Time',
    icon: Clock,
    tips: [
      'Average response time affects your ranking',
      'Aim for under 30 minutes average response',
      'Set up job notifications for instant alerts',
      'Keep app open during work hours for faster response',
    ],
  },
]

export function PlaybookDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <ResponsiveDrawer open={open} onOpenChange={onOpenChange} title="Handyman Playbook" side="bottom">
      <div className="space-y-6">
        {/* Header */}
        <Card className="p-4 rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-background">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Tips for Bigger Payouts</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Follow these best practices to maximize your earnings and maintain your elite status on the platform.
          </p>
        </Card>

        {/* Playbook Sections */}
        <div className="space-y-4">
          {playbookSections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.id} className="p-4 rounded-xl border border-border/60">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
                </div>
                <ul className="space-y-2">
                  {section.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </div>

        {/* Elite Badge Info */}
        <Card className="p-4 rounded-xl border border-border/60 bg-gradient-to-br from-amber-50/50 to-background dark:from-amber-950/20">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-5 w-5 text-amber-600" />
            <h4 className="text-sm font-semibold text-foreground">Elite Badge Benefits</h4>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Priority access to high-value emergency jobs</li>
            <li>• Concierge referrals and premium clients</li>
            <li>• Higher payout rates (10-15% premium)</li>
            <li>• Exclusive training and certification programs</li>
          </ul>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="flex-1 rounded-xl">Download PDF</Button>
        </div>
      </div>
    </ResponsiveDrawer>
  )
}


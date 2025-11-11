import { useState } from 'react'
import { ResponsiveDrawer } from './ResponsiveDrawer'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ClaimJobDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobId?: string
}

const jobData = {
  id: 'board-001',
  title: 'Emergency generator diagnostics',
  payout: '₦75,000',
  location: 'Ikoyi, Lagos',
  shift: 'Today • 8:30 PM',
  responseWindow: 'Dispatch within 45 min',
}

export function ClaimJobDrawer({ open, onOpenChange, jobId }: ClaimJobDrawerProps) {
  const [estimatedArrival, setEstimatedArrival] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!estimatedArrival) {
      toast.error('Please provide your estimated arrival time')
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success('Job claimed successfully! The client will be notified.')

    setIsSubmitting(false)
    onOpenChange(false)
    // Reset form
    setEstimatedArrival('')
    setNotes('')
  }

  return (
    <ResponsiveDrawer open={open} onOpenChange={onOpenChange} title="Claim Job" side="bottom">
      <div className="space-y-6">
        {/* Job Summary */}
        <Card className="p-4 rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-background">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <Badge className="rounded-full bg-destructive/10 text-destructive px-3 py-1 text-xs mb-2">
                Emergency
              </Badge>
              <h3 className="text-lg font-semibold text-foreground mb-1">{jobData.title}</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{jobData.shift}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{jobData.location}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Payout</span>
              <span className="text-sm font-semibold text-foreground">{jobData.payout}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-xs text-amber-600">{jobData.responseWindow}</span>
            </div>
          </div>
        </Card>

        {/* Claim Form */}
        <Card className="p-4 rounded-xl border border-border/60">
          <h4 className="text-sm font-semibold mb-4 text-foreground">Confirm Your Availability</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="arrival" className="text-sm">
                Estimated Arrival Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="arrival"
                type="time"
                value={estimatedArrival}
                onChange={(e) => setEstimatedArrival(e.target.value)}
                className="mt-2 rounded-xl"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                When will you arrive at the job site?
              </p>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 rounded-xl min-h-[100px]"
                placeholder="Any special requirements, questions, or information for the client..."
              />
            </div>
          </div>
        </Card>

        {/* Terms */}
        <Card className="p-4 rounded-xl border border-border/60 bg-muted/30">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">By claiming this job, you agree to:</p>
              <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                <li>Arrive at the scheduled time or notify the client of any delays</li>
                <li>Complete the job according to the specifications</li>
                <li>Update job progress and submit required documentation</li>
                <li>Maintain professional conduct throughout the assignment</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-xl"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Claiming...' : 'Confirm & Claim Job'}
          </Button>
        </div>
      </div>
    </ResponsiveDrawer>
  )
}


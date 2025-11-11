import { ResponsiveDrawer } from './ResponsiveDrawer'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { CheckCircle2, Circle, ClipboardCheck } from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'

interface JobChecklistDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const checklistItems = [
  {
    id: 'tools',
    title: 'Essential tools',
    items: [
      { id: 'multimeter', label: 'Digital multimeter', checked: true },
      { id: 'screwdriver', label: 'Screwdriver set', checked: true },
      { id: 'pliers', label: 'Pliers & wire cutters', checked: true },
      { id: 'voltage_tester', label: 'Voltage tester', checked: false },
    ],
  },
  {
    id: 'safety',
    title: 'Safety equipment',
    items: [
      { id: 'gloves', label: 'Insulated gloves', checked: true },
      { id: 'goggles', label: 'Safety goggles', checked: true },
      { id: 'boots', label: 'Safety boots', checked: true },
      { id: 'helmet', label: 'Hard hat', checked: false },
    ],
  },
  {
    id: 'materials',
    title: 'Materials & supplies',
    items: [
      { id: 'wire', label: 'Electrical wire (various gauges)', checked: true },
      { id: 'connectors', label: 'Wire connectors & terminals', checked: true },
      { id: 'fuses', label: 'Fuses & circuit breakers', checked: false },
      { id: 'tape', label: 'Electrical tape', checked: true },
    ],
  },
  {
    id: 'preparation',
    title: 'Pre-job preparation',
    items: [
      { id: 'location', label: 'Confirm job location & access', checked: true },
      { id: 'contact', label: 'Contact client for entry', checked: false },
      { id: 'parking', label: 'Arrange parking if needed', checked: true },
      { id: 'photos', label: 'Prepare camera for progress photos', checked: true },
    ],
  },
]

export function JobChecklistDrawer({ open, onOpenChange }: JobChecklistDrawerProps) {
  const totalItems = checklistItems.reduce((acc, category) => acc + category.items.length, 0)
  const checkedItems = checklistItems.reduce(
    (acc, category) => acc + category.items.filter((item) => item.checked).length,
    0
  )
  const progress = Math.round((checkedItems / totalItems) * 100)

  return (
    <ResponsiveDrawer open={open} onOpenChange={onOpenChange} title="Job Checklist" side="bottom">
      <div className="space-y-6">
        {/* Progress Summary */}
        <Card className="p-4 rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-background">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">Checklist Progress</span>
            </div>
            <Badge className="rounded-full bg-primary/10 text-primary px-3 py-1">
              {progress}%
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {checkedItems} of {totalItems} items completed
          </p>
        </Card>

        {/* Checklist Categories */}
        <div className="space-y-4">
          {checklistItems.map((category) => (
            <Card key={category.id} className="p-4 rounded-xl border border-border/60">
              <h3 className="text-sm font-semibold mb-3 text-foreground">{category.title}</h3>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors',
                      item.checked ? 'bg-primary/5' : 'hover:bg-muted/50'
                    )}
                  >
                    <div className="flex-shrink-0">
                      {item.checked ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <span className={cn('text-sm', item.checked && 'line-through text-muted-foreground')}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="flex-1 rounded-xl">
            Mark all complete
          </Button>
        </div>
      </div>
    </ResponsiveDrawer>
  )
}


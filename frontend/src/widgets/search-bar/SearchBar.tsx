import { Search } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import FilterIcon from '@/assets/icons/filter-horizontal.svg?react'
import { cn } from '@/shared/lib/utils/cn'

interface SearchBarProps {
  onSearch?: (query: string) => void
  onFilterClick?: () => void
  className?: string
}

export function SearchBar({ onSearch, onFilterClick, className }: SearchBarProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 shrink-0 text-muted-foreground hover:text-foreground bg-surface"
          onClick={onFilterClick}
          aria-label="Filter options"
        >
          <FilterIcon className="h-5 w-5" />
        </Button>
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search properties, locations..."
            className="pl-12 pr-4 h-[41px] rounded-[10px] border-0 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)] focus:shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)] transition-shadow bg-surface"
            // style={{ paddingTop: '8px', paddingRight: '16px', paddingBottom: '8px', paddingLeft: '44px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch?.(e.currentTarget.value)
              }
            }}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        </div>
      </div>
    </div>
  )
}


import { useState } from 'react'
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
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    onSearch?.(searchQuery)
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 shrink-0 text-foreground hover:text-primary bg-surface hover:bg-primary/10 transition-colors"
          onClick={onFilterClick}
          aria-label="Filter options"
        >
          <FilterIcon className="h-5 w-5 text-foreground" />
        </Button>
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search properties, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-[41px] rounded-[10px] border border-border shadow-sm focus:shadow-md focus:border-primary/50 transition-shadow bg-surface text-foreground"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            onClick={handleSearch}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}


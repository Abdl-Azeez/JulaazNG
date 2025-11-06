import { Bed, Bath, Car, Share2 } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import type { PropertyCardProps } from '@/entities/property/model/types'
import HouseIcon from '@/assets/icons/house.svg?react'

export function PropertyCard({ property, onChat, onShare }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`
    }
    return `₦${(price / 1000).toFixed(1)}K`
  }

  return (
    <Card className="overflow-hidden bg-surface hover:shadow-lg transition-shadow border-0 shadow-sm rounded-[20px]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="py-4 px-2 space-y-2.5">
        <h3 className="font-bold text-base text-foreground text-center">{property.name}</h3>
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <HouseIcon className="h-4 w-4" />
            <div className="flex items-center gap-1 whitespace-nowrap">
              {property.area} sqft |
            </div>
          </span>
          {/* <div className="h-3 w-px bg-border">|</div> */}
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {property.bedrooms} |
          </span>
          {/* <span className="h-3 w-px bg-border">|</span> */}
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.bathrooms}
          </span>
          {/* <span className="h-3 w-px bg-border"></span> */}
          <span className="flex items-center gap-1">
            <Car className="h-4 w-4" />
            {property.parking}
          </span>
        </div>
        <p className="text-lg font-bold text-foreground text-center">
          {formatPrice(property.price)}
        </p>
        <div className="flex items-center justify-between pt-1 gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 bg-icon-bg shrink-0 rounded-[10px]"
            onClick={() => onShare?.(property.id)}
            aria-label="Share property"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onChat?.(property.id)}
            className="h-9 px-4 text-sm rounded-[10px]"
            size="sm"
          >
            Chat with owner
          </Button>
        </div>
      </div>
    </Card>
  )
}


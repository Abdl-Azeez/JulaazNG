import { useState } from 'react'
import { Bed, Bath, Car, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import type { PropertyCardProps } from '@/entities/property/model/types'
import HouseIcon from '@/assets/icons/house.svg?react'

export function PropertyCard({ property, onChat, onShare, layout = 'grid' }: PropertyCardProps) {
  const images = property.images || [property.image]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`
    }
    return `₦${(price / 1000).toFixed(1)}K`
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const isRowLayout = layout === 'row'
  const hasMultipleImages = images.length > 1

  return (
    <Card className="overflow-hidden bg-surface hover:shadow-lg transition-shadow border-0 shadow-sm rounded-[20px]">
      <div className={`
        relative overflow-hidden group
        ${isRowLayout 
          ? 'h-[280px]' 
          : 'aspect-[4/3]'
        }
      `}>
        <img
          src={images[currentImageIndex]}
          alt={`${property.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Navigation Arrows - Only show if multiple images */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Image Indicator Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'w-4 bg-background'
                      : 'w-1.5 bg-background/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className={`
        py-4 space-y-2.5
        ${isRowLayout ? 'px-4' : 'px-2'}
      `}>
        <h3 className={`
          font-bold text-foreground
          ${isRowLayout 
            ? 'text-left text-lg' 
            : 'text-center text-base'
          }
        `}>
          {property.name}
        </h3>
        
        {isRowLayout ? (
          // List view: amenities and price on same row
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center text-xs text-muted-foreground gap-1.5 flex-wrap">
              <span className="flex items-center gap-1">
                <HouseIcon className="h-4 w-4" />
                <span className="whitespace-nowrap">
                  {property.area} sqft
                </span>
              </span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {property.bedrooms}
              </span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                {property.bathrooms}
              </span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <Car className="h-4 w-4" />
                {property.parking}
              </span>
            </div>
            <p className="text-xl font-bold text-foreground whitespace-nowrap">
              {formatPrice(property.price)}
            </p>
          </div>
        ) : (
          // Grid view: compact for mobile
          <>
            <div className="flex items-center justify-center gap-0.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <HouseIcon className="h-3.5 w-3.5" />
                {property.area}
              </span>
              <span className="mx-0.5">|</span>
              <span className="flex items-center gap-0.5">
                <Bed className="h-3.5 w-3.5" />
                {property.bedrooms}
              </span>
              <span className="mx-0.5">|</span>
              <span className="flex items-center gap-0.5">
                <Bath className="h-3.5 w-3.5" />
                {property.bathrooms}
              </span>
              <span className="mx-0.5">|</span>
              <span className="flex items-center gap-0.5">
                <Car className="h-3.5 w-3.5" />
                {property.parking}
              </span>
            </div>
            <p className="text-lg font-bold text-foreground text-center">
              {formatPrice(property.price)}
            </p>
          </>
        )}
        
        <div className={`
          flex items-center pt-1
          ${isRowLayout ? 'justify-start gap-3' : 'justify-between gap-2'}
        `}>
          <Button
            variant="ghost"
            size="icon"
            className={`
              bg-icon-bg shrink-0 rounded-[10px]
              ${isRowLayout ? 'h-10 w-10' : 'h-9 w-9'}
            `}
            onClick={() => onShare?.(property.id)}
            aria-label="Share property"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onChat?.(property.id)}
            className={`
              rounded-[10px] flex-1
              ${isRowLayout ? 'h-10 px-8 text-sm' : 'h-9 px-2 text-xs'}
            `}
            size="sm"
          >
            {isRowLayout ? 'Chat with owner' : 'Chat'}
          </Button>
        </div>
      </div>
    </Card>
  )
}


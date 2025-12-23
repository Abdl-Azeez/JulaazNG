import { useState } from 'react'
import { Bed, Bath, Car, Share2, ChevronLeft, ChevronRight, Calendar, Moon } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import type { PropertyCardProps } from '@/entities/property/model/types'
import HouseIcon from '@/assets/icons/house.svg?react'
import { useRoleStore } from '@/shared/store/role.store'

export function PropertyCard({ property, onRequestViewing, onShare, onSelect, layout = 'grid' }: PropertyCardProps) {
  const images = property.images || [property.image]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { activeRole } = useRoleStore()
  const isLandlordView = activeRole === 'landlord'
  const isHandymanView = activeRole === 'handyman'
  const canRequestViewing = !activeRole || activeRole === 'tenant'
  
  const formatPrice = (price: number) => {
    if (!price) return '₦0'
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`
    }
    return `₦${(price / 1000).toFixed(1)}K`
  }

  const hasLongTerm = property.rentalCategories?.includes('long_term')
  const hasShortlet = property.rentalCategories?.includes('shortlet')
  const annualPrice = property.annualRent ?? (hasLongTerm ? property.price : undefined)
  const nightlyRate = property.nightlyRate ?? (hasShortlet && property.price && !hasLongTerm ? property.price : undefined)

  const annualLabel = annualPrice ? `${formatPrice(annualPrice)}/yr` : undefined
  const nightlyLabel = nightlyRate ? `${formatPrice(nightlyRate)}/night` : undefined

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
    <Card
      className="overflow-hidden bg-surface hover:shadow-xl transition-all duration-300 border-0 shadow-sm rounded-[20px] lg:rounded-2xl hover:-translate-y-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
      onClick={() => onSelect?.(property.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect?.(property.id)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${property.name}`}
    >
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
        
        {/* Creative Rental Type Badges - Top Right Corner */}
        {(hasLongTerm || hasShortlet) && (
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            {hasLongTerm && (
              <div className="group/badge relative">
                {/* Animated Glow Effect */}
                <div className="absolute inset-0 bg-primary/40 rounded-lg blur-md opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300" />
                
                {/* Badge Content */}
                <div className={`relative flex items-center rounded-lg bg-background/95 backdrop-blur-md border border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                  isRowLayout ? 'gap-1.5 px-2.5 py-1.5' : 'gap-1.5 px-2.5 py-1.5 md:gap-1.5 md:px-2.5 md:py-1.5'
                }`}>
                  <Calendar className={`text-primary ${isRowLayout ? 'h-3.5 w-3.5' : 'h-4 w-4 md:h-3.5 md:w-3.5'}`} />
                  <span className={`font-bold text-primary uppercase tracking-wider ${
                    isRowLayout ? 'text-[10px]' : 'hidden md:inline text-[10px]'
                  }`}>
                    Annual
                  </span>
                </div>
              </div>
            )}
            {hasShortlet && (
              <div className="group/badge relative">
                {/* Animated Glow Effect */}
                <div className="absolute inset-0 bg-emerald-500/40 rounded-lg blur-md opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300" />
                
                {/* Badge Content */}
                <div className={`relative flex items-center rounded-lg bg-background/95 backdrop-blur-md border border-emerald-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                  isRowLayout ? 'gap-1.5 px-2.5 py-1.5' : 'gap-1.5 px-2.5 py-1.5 md:gap-1.5 md:px-2.5 md:py-1.5'
                }`}>
                  <Moon className={`text-emerald-600 dark:text-emerald-400 ${isRowLayout ? 'h-3.5 w-3.5' : 'h-4 w-4 md:h-3.5 md:w-3.5'}`} />
                  <span className={`font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider ${
                    isRowLayout ? 'text-[10px]' : 'hidden md:inline text-[10px]'
                  }`}>
                    Shortlet
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

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
          <div className="flex flex-col gap-2">
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
              <div className="flex flex-col items-end">
                {annualLabel && (
                  <p className="text-xl font-bold text-foreground whitespace-nowrap">
                    {annualLabel}
                  </p>
                )}
                {nightlyLabel && (
                  <p className="text-xs font-semibold text-primary whitespace-nowrap">
                    {hasLongTerm ? `Shortlet from ${nightlyLabel}` : nightlyLabel}
                  </p>
                )}
              </div>
            </div>
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
            <div className="h-[44px] flex flex-col justify-center">
              {annualLabel && (
                <p className="text-lg font-bold text-foreground text-center leading-tight">
                  {annualLabel}
                </p>
              )}
              {nightlyLabel && (
                <p className="text-[11px] font-semibold text-primary text-center leading-tight">
                  {hasLongTerm ? `Shortlet from ${nightlyLabel}` : nightlyLabel}
                </p>
              )}
            </div>
          </>
        )}
        
        <div
          className={`
            flex items-center pt-1
            ${isRowLayout ? 'justify-start gap-3' : 'justify-between gap-2'}
          `}
        >
          {canRequestViewing && (
            <Button
              variant="ghost"
              size="icon"
              className={`
                bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary shrink-0 rounded-[10px] transition-colors
                ${isRowLayout ? 'h-10 w-10' : 'h-9 w-9'}
              `}
              onClick={(event) => {
                event.stopPropagation()
                onShare?.(property.id)
              }}
              aria-label="Share property"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}

          {isLandlordView || isHandymanView ? (
            <Button
              onClick={(event) => {
                event.stopPropagation()
                onSelect?.(property.id)
              }}
              className={`
                rounded-[10px] flex-1
                ${isRowLayout ? 'h-10 px-8 text-sm' : 'h-9 px-2 text-xs'}
              `}
              size="sm"
              variant="outline"
              aria-label="View property details"
            >
              View Details
            </Button>
          ) : (
            <Button
              onClick={(event) => {
                event.stopPropagation()
                onRequestViewing?.(property.id)
              }}
              className={`
                rounded-[10px] flex-1
                ${isRowLayout ? 'h-10 px-8 text-sm' : 'h-9 px-2 text-xs'}
              `}
              size="sm"
              aria-label="Request viewing"
            >
              Request Viewing
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}


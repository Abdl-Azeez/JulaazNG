import { useState } from 'react'
import { MapPin, Star, Play, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils/cn'
import type { Hotel } from '@/shared/types/hotel.types'

interface HotelCardProps {
  hotel: Hotel
  onSelect?: (hotelId: string) => void
  layout?: 'grid' | 'row'
}

export function HotelCard({ hotel, onSelect, layout = 'grid' }: HotelCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const images = hotel.images || []
  const videos = hotel.videos || []
  const media = [...images, ...videos]

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
    setIsVideoPlaying(false)
  }

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
    setIsVideoPlaying(false)
  }

  const currentMedia = media[currentImageIndex]
  const isVideo = currentMedia && videos.includes(currentMedia)
  const hasMultipleMedia = media.length > 1

  const isRowLayout = layout === 'row'

  return (
    <Card
      className={cn(
        'overflow-hidden bg-surface hover:shadow-xl transition-all duration-300 border-0 shadow-sm rounded-[20px] lg:rounded-2xl hover:-translate-y-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none',
        isRowLayout && 'flex'
      )}
      onClick={() => onSelect?.(hotel.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect?.(hotel.id)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${hotel.name}`}
    >
      <div
        className={cn(
          'relative overflow-hidden group',
          isRowLayout ? 'w-64 h-full' : 'aspect-[4/3]'
        )}
      >
        {currentMedia && (
          <>
            {isVideo ? (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <video
                  src={currentMedia}
                  className="w-full h-full object-cover"
                  controls={isVideoPlaying}
                  autoPlay={isVideoPlaying}
                  onPlay={() => setIsVideoPlaying(true)}
                />
                {!isVideoPlaying && (
                  <Button
                    size="icon"
                    className="absolute inset-0 m-auto bg-black/50 hover:bg-black/70 text-white rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsVideoPlaying(true)
                    }}
                  >
                    <Play className="h-8 w-8 fill-white" />
                  </Button>
                )}
              </div>
            ) : (
              <img
                src={currentMedia}
                alt={`${hotel.name} - Media ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </>
        )}

        {/* Media Navigation */}
        {hasMultipleMedia && (
          <>
            <button
              onClick={handlePrevMedia}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Previous media"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextMedia}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Next media"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {media.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    index === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                  )}
                />
              ))}
            </div>
          </>
        )}

        {/* Halal Badge */}
        {hotel.isHalal && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-emerald-500/90 text-white border-0 shadow-lg flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Halal
            </Badge>
          </div>
        )}

        {/* Rating Badge */}
        {hotel.rating && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {hotel.rating.toFixed(1)}
            </Badge>
          </div>
        )}
      </div>

      <div className={cn('p-4 space-y-3', isRowLayout && 'flex-1')}>
        <div>
          <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-1">{hotel.name}</h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{hotel.address}, {hotel.city}</span>
          </div>
        </div>

        {hotel.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{hotel.description}</p>
        )}

        {/* Facilities Preview */}
        {hotel.facilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {hotel.facilities.slice(0, 4).map((facility) => (
              <Badge key={facility} variant="outline" className="text-xs">
                {facility}
              </Badge>
            ))}
            {hotel.facilities.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{hotel.facilities.length - 4} more
              </Badge>
            )}
          </div>
        )}

        {/* Review Count */}
        {hotel.reviewCount && hotel.reviewCount > 0 && (
          <p className="text-xs text-muted-foreground">
            {hotel.reviewCount} {hotel.reviewCount === 1 ? 'review' : 'reviews'}
          </p>
        )}
      </div>
    </Card>
  )
}

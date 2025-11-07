export interface Property {
  id: string
  name: string
  image: string
  images?: string[] // Multiple images for slider
  area: number // in sqft
  bedrooms: number
  bathrooms: number
  parking: number
  price: number // in Naira
  location?: string
  ownerId?: string
}

export interface PropertyCardProps {
  property: Property
  onChat?: (propertyId: string) => void
  onShare?: (propertyId: string) => void
  layout?: 'grid' | 'row'
}


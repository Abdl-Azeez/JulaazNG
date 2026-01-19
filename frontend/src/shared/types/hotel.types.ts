/**
 * Hotel Type Definitions
 */

export interface Hotel {
  id: string
  name: string
  address: string
  city: string
  state: string
  country: string
  latitude?: number
  longitude?: number
  description: string
  images: string[]
  videos?: string[]
  facilities: string[]
  isHalal: boolean
  halalFeatures?: string[]
  hotelManagerId: string
  hotelManagerName: string
  rating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
  status: 'active' | 'pending' | 'suspended'
}

export interface HotelRoom {
  id: string
  hotelId: string
  type: 'standard' | 'deluxe' | 'suite' | 'executive' | 'presidential' | 'family' | 'studio'
  name: string
  description: string
  maxOccupancy: number
  bedType: string
  size: string // e.g., "25 sqm"
  pricePerNight: number
  images: string[]
  amenities: string[]
  availableServices: string[] // Services available for this room type
  totalRooms: number
  availableRooms: number
  isAvailable: boolean
}

export interface HotelBooking {
  id: string
  hotelId: string
  hotelName: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  roomId: string
  roomType: string
  roomName: string
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  numberOfRooms: number
  totalAmount: number
  status: 'pending' | 'approved' | 'rejected' | 'payment_pending' | 'payment_completed' | 'checked_in' | 'checked_out' | 'cancelled'
  approvalStatus: 'pending' | 'approved' | 'rejected'
  approvedBy?: string // hotel_manager or admin
  approvedAt?: string
  rejectionReason?: string
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentDeadline?: string // Time limit for payment after approval
  paymentCompletedAt?: string
  checkInCode: string // Code for hotel manager to verify check-in
  checkedInAt?: string
  checkedOutAt?: string
  checkedInBy?: string
  specialRequests?: string
  createdAt: string
  updatedAt: string
}

export interface HotelSearchFilters {
  location?: string
  city?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  rooms?: number
  minPrice?: number
  maxPrice?: number
  roomType?: HotelRoom['type']
  facilities?: string[]
  isHalal?: boolean
  rating?: number
}

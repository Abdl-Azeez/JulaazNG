import type { RentTerm } from '@/shared/types/property.types'

export type RentRequestChannel = 'In-app notifications & chat'

export interface RentRequest {
  id: string
  createdAt: string
  location: string
  rooms: number
  rentTerm: RentTerm
  furnished: boolean
  budgetRange: string
  channel: RentRequestChannel
  status: 'new' | 'in_progress' | 'matched'
}

const STORAGE_KEY = 'julaaz_rent_requests_v1'

function safeParse<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export function listRentRequests(): RentRequest[] {
  if (typeof window === 'undefined') return []
  const parsed = safeParse<RentRequest[]>(window.localStorage.getItem(STORAGE_KEY))
  return Array.isArray(parsed) ? parsed : []
}

export function addRentRequest(request: Omit<RentRequest, 'id' | 'createdAt' | 'status' | 'channel'> & { channel?: RentRequestChannel }): RentRequest {
  const next: RentRequest = {
    id: `rr-${Math.random().toString(16).slice(2)}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'new',
    channel: request.channel ?? 'In-app notifications & chat',
    location: request.location,
    rooms: request.rooms,
    rentTerm: request.rentTerm,
    furnished: request.furnished,
    budgetRange: request.budgetRange || 'Any price',
  }

  if (typeof window === 'undefined') return next

  const current = listRentRequests()
  const updated = [next, ...current]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return next
}

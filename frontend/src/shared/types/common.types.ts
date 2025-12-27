/**
 * Common TypeScript types used across the application
 */

export type Nullable<T> = T | null
export type Optional<T> = T | undefined

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  meta?: PaginationMeta
  timestamp: string
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  timestamp: string
}

export type AsyncData<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}


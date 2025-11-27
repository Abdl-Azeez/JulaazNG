/**
 * Report-related TypeScript types and interfaces
 */

export type ReportType = 
  | 'property'           // Report property/landlord/homerunner
  | 'service_provider'    // Report service provider
  | 'tenant'             // Report tenant
  | 'landlord'           // Report landlord
  | 'homerunner'         // Report homerunner
  | 'customer'           // Report customer (for service providers/artisans)
  | 'handyman'           // Report handyman
  | 'artisan'            // Report artisan
  | 'payment'            // Report payment issue
  | 'behavior'           // Report behavioral issue

export type ReportReason = 
  | 'fraud'              // Fraudulent activity
  | 'misrepresentation'  // False information
  | 'harassment'         // Harassment or abuse
  | 'safety'             // Safety concerns
  | 'quality'             // Quality issues
  | 'payment'             // Payment problems
  | 'contract'            // Contract violations
  | 'other'               // Other issues

export type ReportStatus = 
  | 'pending'            // Report submitted, awaiting review
  | 'investigating'       // Under investigation
  | 'resolved'            // Resolved by admin
  | 'dismissed'          // Dismissed as invalid
  | 'closed'             // Closed

export interface Report {
  id: string
  reference: string      // e.g., "REP-2025-001"
  type: ReportType
  reason: ReportReason
  status: ReportStatus
  reporter: {
    id: string
    name: string
    role: string
    email?: string
  }
  reportedEntity: {
    id: string
    type: 'user' | 'property' | 'service' | 'booking'
    name: string
    role?: string
  }
  title: string
  description: string
  relatedTo?: {
    type: 'property' | 'booking' | 'service_booking' | 'payment'
    id: string
    title?: string
  }
  documents?: {
    id: string
    name: string
    type: 'image' | 'pdf' | 'document'
    url: string
  }[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  resolvedBy?: string
  resolutionNotes?: string
  disputeId?: string     // Link to dispute if escalated
}

export interface ReportFormData {
  type: ReportType
  reason: ReportReason
  title: string
  description: string
  relatedTo?: {
    type: 'property' | 'booking' | 'service_booking' | 'payment'
    id: string
    title?: string
  }
  documents?: File[]
}

// Report eligibility rules
export interface ReportEligibility {
  canReport: boolean
  reason?: string        // Why they can't report (e.g., "You can only report after viewing or move-in")
  requiresViewing?: boolean
  requiresMoveIn?: boolean
  requiresBooking?: boolean
}


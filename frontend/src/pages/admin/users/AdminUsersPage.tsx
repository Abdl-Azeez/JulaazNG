import { useState, useMemo } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  Users,
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  UserPlus,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  ShieldOff,
  Ban,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  MessageSquare,
  FileText,
  Home,
  Calendar,
  Upload,
  AlertCircle,
  Download,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/ui/dropdown-menu'
import toast from 'react-hot-toast'
import { useMessagingStore } from '@/shared/store/messaging.store'
import { useAuthStore } from '@/shared/store/auth.store'
import type { Conversation, Message } from '@/shared/types/activity.types'

interface BackgroundCheckDocument {
  id: string
  name: string
  status: 'pending' | 'approved' | 'rejected' | 'not_submitted'
  submittedAt?: string
  reviewedAt?: string
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'tenant' | 'landlord' | 'homerunner' | 'admin' | 'handyman' | 'service_provider'
  status: 'active' | 'pending' | 'suspended' | 'banned'
  verified: boolean
  joinedAt: string
  lastActive: string
  propertiesCount?: number
  bookingsCount?: number
  // Tenant-specific stats
  viewingsRequested?: number
  currentRentals?: number
  shortletsUsed?: number
  // Background check
  backgroundCheck: {
    status: 'not_started' | 'in_progress' | 'completed' | 'failed'
    progress: number
    documents: BackgroundCheckDocument[]
  }
}

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Tosin Adeyemi',
    email: 'tosin@example.com',
    phone: '08012345678',
    role: 'tenant',
    status: 'active',
    verified: true,
    joinedAt: '2024-01-15',
    lastActive: '2 hours ago',
    bookingsCount: 3,
    viewingsRequested: 12,
    currentRentals: 1,
    shortletsUsed: 2,
    backgroundCheck: {
      status: 'completed',
      progress: 100,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2024-01-16', reviewedAt: '2024-01-17' },
        { id: 'd2', name: 'Proof of Address', status: 'approved', submittedAt: '2024-01-16', reviewedAt: '2024-01-17' },
        { id: 'd3', name: 'Employment Letter', status: 'approved', submittedAt: '2024-01-16', reviewedAt: '2024-01-18' },
        { id: 'd4', name: 'Bank Statement', status: 'approved', submittedAt: '2024-01-16', reviewedAt: '2024-01-18' },
      ],
    },
  },
  {
    id: '2',
    name: 'Femi Ogunleye',
    email: 'femi@example.com',
    phone: '08023456789',
    role: 'landlord',
    status: 'active',
    verified: true,
    joinedAt: '2023-11-20',
    lastActive: '1 day ago',
    propertiesCount: 5,
    backgroundCheck: {
      status: 'completed',
      progress: 100,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2023-11-21', reviewedAt: '2023-11-22' },
        { id: 'd2', name: 'Property Ownership Docs', status: 'approved', submittedAt: '2023-11-21', reviewedAt: '2023-11-23' },
        { id: 'd3', name: 'Tax Clearance', status: 'approved', submittedAt: '2023-11-22', reviewedAt: '2023-11-24' },
      ],
    },
  },
  {
    id: '3',
    name: 'Adebayo Johnson',
    email: 'adebayo@example.com',
    phone: '08034567890',
    role: 'homerunner',
    status: 'active',
    verified: true,
    joinedAt: '2024-02-01',
    lastActive: '30 minutes ago',
    backgroundCheck: {
      status: 'in_progress',
      progress: 75,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2024-02-02', reviewedAt: '2024-02-03' },
        { id: 'd2', name: 'Proof of Address', status: 'approved', submittedAt: '2024-02-02', reviewedAt: '2024-02-03' },
        { id: 'd3', name: 'Police Clearance', status: 'approved', submittedAt: '2024-02-03', reviewedAt: '2024-02-04' },
        { id: 'd4', name: 'Guarantor Form', status: 'pending', submittedAt: '2024-02-05' },
      ],
    },
  },
  {
    id: '4',
    name: 'Chioma Nwosu',
    email: 'chioma@example.com',
    phone: '08045678901',
    role: 'tenant',
    status: 'pending',
    verified: false,
    joinedAt: '2024-03-10',
    lastActive: '5 hours ago',
    bookingsCount: 1,
    viewingsRequested: 3,
    currentRentals: 0,
    shortletsUsed: 0,
    backgroundCheck: {
      status: 'in_progress',
      progress: 25,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2024-03-11', reviewedAt: '2024-03-12' },
        { id: 'd2', name: 'Proof of Address', status: 'pending', submittedAt: '2024-03-12' },
        { id: 'd3', name: 'Employment Letter', status: 'not_submitted' },
        { id: 'd4', name: 'Bank Statement', status: 'not_submitted' },
      ],
    },
  },
  {
    id: '5',
    name: 'Kunle Balogun',
    email: 'kunle@example.com',
    phone: '08056789012',
    role: 'handyman',
    status: 'suspended',
    verified: true,
    joinedAt: '2023-12-05',
    lastActive: '3 days ago',
    backgroundCheck: {
      status: 'failed',
      progress: 50,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2023-12-06', reviewedAt: '2023-12-07' },
        { id: 'd2', name: 'Skill Certification', status: 'rejected', submittedAt: '2023-12-06', reviewedAt: '2023-12-08' },
        { id: 'd3', name: 'Police Clearance', status: 'not_submitted' },
      ],
    },
  },
  {
    id: '6',
    name: 'Grace Eze',
    email: 'grace@example.com',
    phone: '08067890123',
    role: 'service_provider',
    status: 'active',
    verified: true,
    joinedAt: '2024-01-28',
    lastActive: '1 hour ago',
    backgroundCheck: {
      status: 'completed',
      progress: 100,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2024-01-29', reviewedAt: '2024-01-30' },
        { id: 'd2', name: 'Business Registration', status: 'approved', submittedAt: '2024-01-29', reviewedAt: '2024-01-31' },
        { id: 'd3', name: 'Service License', status: 'approved', submittedAt: '2024-01-30', reviewedAt: '2024-02-01' },
      ],
    },
  },
  {
    id: '7',
    name: 'Emeka Obi',
    email: 'emeka@example.com',
    phone: '08078901234',
    role: 'tenant',
    status: 'active',
    verified: true,
    joinedAt: '2024-02-15',
    lastActive: '4 hours ago',
    bookingsCount: 2,
    viewingsRequested: 8,
    currentRentals: 1,
    shortletsUsed: 0,
    backgroundCheck: {
      status: 'completed',
      progress: 100,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2024-02-16', reviewedAt: '2024-02-17' },
        { id: 'd2', name: 'Proof of Address', status: 'approved', submittedAt: '2024-02-16', reviewedAt: '2024-02-17' },
        { id: 'd3', name: 'Employment Letter', status: 'approved', submittedAt: '2024-02-17', reviewedAt: '2024-02-18' },
        { id: 'd4', name: 'Bank Statement', status: 'approved', submittedAt: '2024-02-17', reviewedAt: '2024-02-18' },
      ],
    },
  },
  {
    id: '8',
    name: 'Aisha Mohammed',
    email: 'aisha@example.com',
    phone: '08089012345',
    role: 'landlord',
    status: 'active',
    verified: true,
    joinedAt: '2023-10-10',
    lastActive: '6 hours ago',
    propertiesCount: 8,
    backgroundCheck: {
      status: 'completed',
      progress: 100,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2023-10-11', reviewedAt: '2023-10-12' },
        { id: 'd2', name: 'Property Ownership Docs', status: 'approved', submittedAt: '2023-10-11', reviewedAt: '2023-10-13' },
        { id: 'd3', name: 'Tax Clearance', status: 'approved', submittedAt: '2023-10-12', reviewedAt: '2023-10-14' },
      ],
    },
  },
  {
    id: '9',
    name: 'David Okoro',
    email: 'david@example.com',
    phone: '08090123456',
    role: 'homerunner',
    status: 'pending',
    verified: false,
    joinedAt: '2024-03-15',
    lastActive: '1 day ago',
    backgroundCheck: {
      status: 'not_started',
      progress: 0,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'not_submitted' },
        { id: 'd2', name: 'Proof of Address', status: 'not_submitted' },
        { id: 'd3', name: 'Police Clearance', status: 'not_submitted' },
        { id: 'd4', name: 'Guarantor Form', status: 'not_submitted' },
      ],
    },
  },
  {
    id: '10',
    name: 'Ngozi Ibe',
    email: 'ngozi@example.com',
    phone: '08001234567',
    role: 'tenant',
    status: 'banned',
    verified: false,
    joinedAt: '2023-09-01',
    lastActive: '2 weeks ago',
    bookingsCount: 0,
    viewingsRequested: 5,
    currentRentals: 0,
    shortletsUsed: 1,
    backgroundCheck: {
      status: 'failed',
      progress: 25,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'rejected', submittedAt: '2023-09-02', reviewedAt: '2023-09-05' },
        { id: 'd2', name: 'Proof of Address', status: 'not_submitted' },
        { id: 'd3', name: 'Employment Letter', status: 'not_submitted' },
        { id: 'd4', name: 'Bank Statement', status: 'not_submitted' },
      ],
    },
  },
]

const roleColors: Record<User['role'], string> = {
  tenant: 'bg-blue-500/10 text-blue-600',
  landlord: 'bg-purple-500/10 text-purple-600',
  homerunner: 'bg-emerald-500/10 text-emerald-600',
  admin: 'bg-violet-500/10 text-violet-600',
  handyman: 'bg-amber-500/10 text-amber-600',
  service_provider: 'bg-cyan-500/10 text-cyan-600',
}

const statusColors: Record<User['status'], string> = {
  active: 'bg-emerald-500/10 text-emerald-600',
  pending: 'bg-amber-500/10 text-amber-600',
  suspended: 'bg-red-500/10 text-red-600',
  banned: 'bg-gray-500/10 text-gray-600',
}

const statusIcons: Record<User['status'], React.ReactNode> = {
  active: <CheckCircle className="h-3 w-3" />,
  pending: <Clock className="h-3 w-3" />,
  suspended: <XCircle className="h-3 w-3" />,
  banned: <Ban className="h-3 w-3" />,
}

const bgCheckStatusColors: Record<User['backgroundCheck']['status'], string> = {
  not_started: 'bg-gray-500/10 text-gray-600',
  in_progress: 'bg-amber-500/10 text-amber-600',
  completed: 'bg-emerald-500/10 text-emerald-600',
  failed: 'bg-red-500/10 text-red-600',
}

type SortField = 'name' | 'joinedAt' | 'lastActive' | 'role' | 'status'
type SortDirection = 'asc' | 'desc'

const ITEMS_PER_PAGE = 5

export function AdminUsersPage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const conversations = useMessagingStore((state) => state.conversations)
  const messagesByConversation = useMessagingStore((state) => state.messages)
  const addConversation = useMessagingStore((state) => state.addConversation)
  const addMessage = useMessagingStore((state) => state.addMessage)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<User['status'] | 'all'>('all')
  const [users, setUsers] = useState<User[]>(initialUsers)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Sorting
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Modals
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [messageContent, setMessageContent] = useState('')
  const [viewingDocument, setViewingDocument] = useState<{ user: User; doc: BackgroundCheckDocument } | null>(null)

  // Add user form
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'tenant' as User['role'],
    password: '',
  })

  const filteredAndSortedUsers = useMemo(() => {
    let result = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'joinedAt':
          comparison = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
          break
        case 'lastActive':
          comparison = a.lastActive.localeCompare(b.lastActive)
          break
        case 'role':
          comparison = a.role.localeCompare(b.role)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [users, searchQuery, roleFilter, statusFilter, sortField, sortDirection])

  const totalPages = Math.ceil(filteredAndSortedUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3 w-3 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1" />
    )
  }

  const handleViewProfile = (user: User) => {
    setSelectedUser(user)
    setIsUserDetailsOpen(true)
  }

  const handleSendMessage = (user: User) => {
    setSelectedUser(user)
    setMessageContent('')
    setIsMessageOpen(true)
  }

  const handleSubmitMessage = () => {
    if (!selectedUser || !messageContent.trim() || !currentUser) return

    const adminId = currentUser.id || 'admin'
    const recipientId = selectedUser.id

    // Check if conversation already exists
    const existingConversation = conversations.find((conv) => {
      const participants = conv.participants
      return (
        participants.includes(adminId) &&
        participants.includes(recipientId) &&
        conv.type === 'direct' &&
        participants.length === 2
      )
    })

    let conversationId: string
    const now = new Date()

    if (existingConversation) {
      // Use existing conversation, but update title if needed
      conversationId = existingConversation.id
      
      // Update participantDetails to ensure correct title format
      const existingMessages = messagesByConversation[conversationId] || []
      const updatedConversation: Conversation = {
        ...existingConversation,
        participantDetails: existingConversation.participantDetails?.map((p) => {
          if (p.id === recipientId) {
            return {
              ...p,
              name: `Admin - ${selectedUser.name}`,
            }
          }
          return p
        }) || [
          {
            id: recipientId,
            name: `Admin - ${selectedUser.name}`,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedUser.name)}`,
            isOnline: false,
            lastSeen: new Date(),
          },
        ],
      }
      
      // Re-add conversation to update it in the store, preserving existing messages
      addConversation(updatedConversation, existingMessages)
    } else {
      // Create new conversation
      const generateId = (prefix: string) => {
        if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
          return `${prefix}_${crypto.randomUUID()}`
        }
        return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
      }

      conversationId = generateId('conv')

      const conversation: Conversation = {
        id: conversationId,
        participants: [adminId, recipientId],
        type: 'direct',
        status: 'active',
        createdAt: now,
        updatedAt: now,
        unreadCount: {
          [adminId]: 0,
          [recipientId]: 0,
        },
        participantDetails: [
          {
            id: recipientId,
            name: `Admin - ${selectedUser.name}`,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedUser.name)}`,
            isOnline: false,
            lastSeen: new Date(),
          },
          {
            id: adminId,
            name: currentUser.name || currentUser.email || 'Admin',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name || currentUser.email || 'Admin')}`,
            isOnline: true,
            lastSeen: now,
          },
        ],
      }

      addConversation(conversation, [])
    }

    // Create and add the message
    const generateMessageId = (prefix: string) => {
      if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return `${prefix}_${crypto.randomUUID()}`
      }
      return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
    }

    const message: Message = {
      id: generateMessageId('msg'),
      conversationId,
      senderId: adminId,
      recipientId,
      type: 'text',
      content: messageContent.trim(),
      status: 'sent',
      createdAt: now,
    }

    addMessage(conversationId, message)

    toast.success(`Message sent to ${selectedUser.name}`)
    setIsMessageOpen(false)
    setMessageContent('')

    // Navigate to the messaging page with the conversation
    navigate(ROUTES.MESSAGING_CHAT(conversationId))
  }

  const handleSuspendUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'suspended' as const } : u))
    )
    toast.success('User suspended')
  }

  const handleReactivateUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'active' as const } : u))
    )
    toast.success('User reactivated')
  }

  const handleBanUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'banned' as const } : u))
    )
    toast.success('User banned')
  }

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    toast.success('User deleted')
    setIsUserDetailsOpen(false)
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.password) {
      toast.error('Please fill all required fields')
      return
    }

    const user: User = {
      id: `new-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      status: 'pending',
      verified: false,
      joinedAt: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      backgroundCheck: {
        status: 'not_started',
        progress: 0,
        documents: [],
      },
    }

    setUsers((prev) => [user, ...prev])
    setIsAddUserOpen(false)
    setNewUser({ name: '', email: '', phone: '', role: 'tenant', password: '' })
    toast.success(`User ${newUser.name} created successfully`)
  }

  const handleApproveDocument = (userId: string, docId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u
        const updatedDocs = u.backgroundCheck.documents.map((d) =>
          d.id === docId ? { ...d, status: 'approved' as const, reviewedAt: new Date().toISOString().split('T')[0] } : d
        )
        const approvedCount = updatedDocs.filter((d) => d.status === 'approved').length
        const progress = Math.round((approvedCount / updatedDocs.length) * 100)
        const allApproved = updatedDocs.every((d) => d.status === 'approved')
        const anyRejected = updatedDocs.some((d) => d.status === 'rejected')
        return {
          ...u,
          backgroundCheck: {
            ...u.backgroundCheck,
            documents: updatedDocs,
            progress,
            status: allApproved ? 'completed' : anyRejected ? 'failed' : 'in_progress',
          },
        }
      })
    )
    if (selectedUser) {
      const updatedUser = users.find((u) => u.id === userId)
      if (updatedUser) {
        const updatedDocs = updatedUser.backgroundCheck.documents.map((d) =>
          d.id === docId ? { ...d, status: 'approved' as const, reviewedAt: new Date().toISOString().split('T')[0] } : d
        )
        const approvedCount = updatedDocs.filter((d) => d.status === 'approved').length
        const progress = Math.round((approvedCount / updatedDocs.length) * 100)
        const allApproved = updatedDocs.every((d) => d.status === 'approved')
        const anyRejected = updatedDocs.some((d) => d.status === 'rejected')
        setSelectedUser({
          ...updatedUser,
          backgroundCheck: {
            ...updatedUser.backgroundCheck,
            documents: updatedDocs,
            progress,
            status: allApproved ? 'completed' : anyRejected ? 'failed' : 'in_progress',
          },
        })
      }
    }
    toast.success('Document approved')
  }

  const handleRejectDocument = (userId: string, docId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u
        const updatedDocs = u.backgroundCheck.documents.map((d) =>
          d.id === docId ? { ...d, status: 'rejected' as const, reviewedAt: new Date().toISOString().split('T')[0] } : d
        )
        return {
          ...u,
          backgroundCheck: {
            ...u.backgroundCheck,
            documents: updatedDocs,
            status: 'failed',
          },
        }
      })
    )
    if (selectedUser) {
      const updatedUser = users.find((u) => u.id === userId)
      if (updatedUser) {
        const updatedDocs = updatedUser.backgroundCheck.documents.map((d) =>
          d.id === docId ? { ...d, status: 'rejected' as const, reviewedAt: new Date().toISOString().split('T')[0] } : d
        )
        setSelectedUser({
          ...updatedUser,
          backgroundCheck: {
            ...updatedUser.backgroundCheck,
            documents: updatedDocs,
            status: 'failed',
          },
        })
      }
    }
    toast.success('Document rejected')
  }

  const handleUploadDocumentForUser = (userId: string, docId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u
        const updatedDocs = u.backgroundCheck.documents.map((d) =>
          d.id === docId ? { ...d, status: 'pending' as const, submittedAt: new Date().toISOString().split('T')[0] } : d
        )
        const hasSubmitted = updatedDocs.some((d) => d.status !== 'not_submitted')
        return {
          ...u,
          backgroundCheck: {
            ...u.backgroundCheck,
            documents: updatedDocs,
            status: hasSubmitted ? 'in_progress' : 'not_started',
          },
        }
      })
    )
    if (selectedUser) {
      const updatedUser = users.find((u) => u.id === userId)
      if (updatedUser) {
        const updatedDocs = updatedUser.backgroundCheck.documents.map((d) =>
          d.id === docId ? { ...d, status: 'pending' as const, submittedAt: new Date().toISOString().split('T')[0] } : d
        )
        const hasSubmitted = updatedDocs.some((d) => d.status !== 'not_submitted')
        setSelectedUser({
          ...updatedUser,
          backgroundCheck: {
            ...updatedUser.backgroundCheck,
            documents: updatedDocs,
            status: hasSubmitted ? 'in_progress' : 'not_started',
          },
        })
      }
    }
    toast.success('Document uploaded on behalf of user')
  }

  const handleViewDocument = (user: User, doc: BackgroundCheckDocument) => {
    if (doc.status === 'not_submitted') {
      toast.error('Document has not been submitted yet')
      return
    }
    setViewingDocument({ user, doc })
  }

  const handleDownloadDocument = (user: User, doc: BackgroundCheckDocument) => {
    if (doc.status === 'not_submitted') {
      toast.error('Document has not been submitted yet')
      return
    }
    // Simulate download - in real app, this would fetch the actual file
    const link = document.createElement('a')
    link.href = `#document-${doc.id}` // Placeholder - would be actual file URL
    link.download = `${user.name}-${doc.name.replace(/\s+/g, '-')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Downloading ${doc.name}...`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => navigate(ROUTES.PROFILE)}
        className="lg:shadow-sm"
      />

      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-purple-500/5 via-background to-background">
          <div className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
            <Button
              variant="ghost"
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                      User Management
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {filteredAndSortedUsers.length} users • Manage all platform users
                    </p>
                  </div>
                </div>
              </div>

              <Button className="rounded-xl" onClick={() => setIsAddUserOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 rounded-xl h-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  Role: {roleFilter === 'all' ? 'All' : roleFilter.replace('_', ' ')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => { setRoleFilter('all'); setCurrentPage(1) }}>All Roles</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setRoleFilter('tenant'); setCurrentPage(1) }}>Tenant</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setRoleFilter('landlord'); setCurrentPage(1) }}>Landlord</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setRoleFilter('homerunner'); setCurrentPage(1) }}>Homerunner</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setRoleFilter('handyman'); setCurrentPage(1) }}>Handyman</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setRoleFilter('service_provider'); setCurrentPage(1) }}>Service Provider</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setRoleFilter('admin'); setCurrentPage(1) }}>Admin</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  Status: {statusFilter === 'all' ? 'All' : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => { setStatusFilter('all'); setCurrentPage(1) }}>All Status</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setStatusFilter('active'); setCurrentPage(1) }}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setStatusFilter('pending'); setCurrentPage(1) }}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setStatusFilter('suspended'); setCurrentPage(1) }}>Suspended</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setStatusFilter('banned'); setCurrentPage(1) }}>Banned</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Users Table */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-6 lg:pb-10">
          <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border/60">
                  <tr>
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <span className="flex items-center">
                        User
                        {getSortIcon('name')}
                      </span>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                      Contact
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('role')}
                    >
                      <span className="flex items-center">
                        Role
                        {getSortIcon('role')}
                      </span>
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <span className="flex items-center">
                        Status
                        {getSortIcon('status')}
                      </span>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                      BGC
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('joinedAt')}
                    >
                      <span className="flex items-center">
                        Joined
                        {getSortIcon('joinedAt')}
                      </span>
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm flex items-center gap-1.5">
                              {user.name}
                              {user.verified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />}
                            </p>
                            <p className="text-xs text-muted-foreground">{user.lastActive}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          <p className="text-xs text-foreground flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn('rounded-full capitalize text-[10px] px-2 py-0.5', roleColors[user.role])}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={cn(
                            'rounded-full capitalize flex items-center gap-1 w-fit text-[10px] px-2 py-0.5',
                            statusColors[user.status]
                          )}
                        >
                          {statusIcons[user.status]}
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                user.backgroundCheck.status === 'completed'
                                  ? 'bg-emerald-500'
                                  : user.backgroundCheck.status === 'failed'
                                  ? 'bg-red-500'
                                  : 'bg-amber-500'
                              )}
                              style={{ width: `${user.backgroundCheck.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground">{user.backgroundCheck.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{user.joinedAt}</td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendMessage(user)}>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === 'active' ? (
                              <DropdownMenuItem className="text-amber-600" onClick={() => handleSuspendUser(user.id)}>
                                <ShieldOff className="h-4 w-4 mr-2" />
                                Suspend User
                              </DropdownMenuItem>
                            ) : user.status === 'suspended' ? (
                              <DropdownMenuItem className="text-emerald-600" onClick={() => handleReactivateUser(user.id)}>
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Reactivate User
                              </DropdownMenuItem>
                            ) : null}
                            {user.status !== 'banned' && (
                              <DropdownMenuItem className="text-red-600" onClick={() => handleBanUser(user.id)}>
                                <Ban className="h-4 w-4 mr-2" />
                                Ban User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAndSortedUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No users found matching your criteria</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedUsers.length)} of{' '}
                  {filteredAndSortedUsers.length} users
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* User Details Dialog */}
      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
                    {selectedUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <span className="flex items-center gap-2">
                      {selectedUser.name}
                      {selectedUser.verified && <ShieldCheck className="h-5 w-5 text-emerald-600" />}
                    </span>
                    <p className="text-sm font-normal text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </DialogTitle>
                <DialogDescription className="sr-only">User profile details</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Status & Role */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={cn('rounded-full capitalize', roleColors[selectedUser.role])}>
                    {selectedUser.role.replace('_', ' ')}
                  </Badge>
                  <Badge className={cn('rounded-full capitalize flex items-center gap-1', statusColors[selectedUser.status])}>
                    {statusIcons[selectedUser.status]}
                    {selectedUser.status}
                  </Badge>
                  <Badge className={cn('rounded-full capitalize', bgCheckStatusColors[selectedUser.backgroundCheck.status])}>
                    BGC: {selectedUser.backgroundCheck.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Contact Info */}
                <Card className="p-4 rounded-xl border border-border/60">
                  <h4 className="text-sm font-semibold mb-3">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedUser.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {selectedUser.joinedAt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Active {selectedUser.lastActive}</span>
                    </div>
                  </div>
                </Card>

                {/* Role-specific Stats */}
                {selectedUser.role === 'tenant' && (
                  <Card className="p-4 rounded-xl border border-border/60">
                    <h4 className="text-sm font-semibold mb-3">Tenant Activity</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <Eye className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                        <p className="text-xl font-bold">{selectedUser.viewingsRequested ?? 0}</p>
                        <p className="text-xs text-muted-foreground">Viewings Requested</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <Home className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                        <p className="text-xl font-bold">{selectedUser.currentRentals ?? 0}</p>
                        <p className="text-xs text-muted-foreground">Current Rentals</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <Calendar className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                        <p className="text-xl font-bold">{selectedUser.shortletsUsed ?? 0}</p>
                        <p className="text-xs text-muted-foreground">Shortlets Used</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <FileText className="h-5 w-5 mx-auto mb-1 text-amber-600" />
                        <p className="text-xl font-bold">{selectedUser.bookingsCount ?? 0}</p>
                        <p className="text-xs text-muted-foreground">Total Bookings</p>
                      </div>
                    </div>
                  </Card>
                )}

                {selectedUser.role === 'landlord' && (
                  <Card className="p-4 rounded-xl border border-border/60">
                    <h4 className="text-sm font-semibold mb-3">Properties</h4>
                    <div className="flex items-center gap-4">
                      <div className="text-center p-3 rounded-lg bg-muted/50 flex-1">
                        <Building2 className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                        <p className="text-xl font-bold">{selectedUser.propertiesCount ?? 0}</p>
                        <p className="text-xs text-muted-foreground">Listed Properties</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Background Check Section */}
                <Card className="p-4 rounded-xl border border-border/60">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold">Background Check</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            selectedUser.backgroundCheck.status === 'completed'
                              ? 'bg-emerald-500'
                              : selectedUser.backgroundCheck.status === 'failed'
                              ? 'bg-red-500'
                              : 'bg-amber-500'
                          )}
                          style={{ width: `${selectedUser.backgroundCheck.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{selectedUser.backgroundCheck.progress}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selectedUser.backgroundCheck.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{doc.name}</p>
                            {doc.submittedAt && (
                              <p className="text-xs text-muted-foreground">Submitted: {doc.submittedAt}</p>
                            )}
                            {doc.reviewedAt && (
                              <p className="text-xs text-muted-foreground">Reviewed: {doc.reviewedAt}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.status === 'approved' && (
                            <>
                              <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 text-[10px]">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approved
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs rounded-lg"
                                onClick={() => handleViewDocument(selectedUser, doc)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs rounded-lg"
                                onClick={() => handleDownloadDocument(selectedUser, doc)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </>
                          )}
                          {doc.status === 'rejected' && (
                            <>
                              <Badge className="rounded-full bg-red-500/10 text-red-600 text-[10px]">
                                <XCircle className="h-3 w-3 mr-1" />
                                Rejected
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs rounded-lg"
                                onClick={() => handleViewDocument(selectedUser, doc)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs rounded-lg"
                                onClick={() => handleDownloadDocument(selectedUser, doc)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </>
                          )}
                          {doc.status === 'pending' && (
                            <>
                              <Badge className="rounded-full bg-amber-500/10 text-amber-600 text-[10px]">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs rounded-lg"
                                onClick={() => handleViewDocument(selectedUser, doc)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs rounded-lg"
                                onClick={() => handleDownloadDocument(selectedUser, doc)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs rounded-lg text-emerald-600 border-emerald-600/30 hover:bg-emerald-50"
                                onClick={() => handleApproveDocument(selectedUser.id, doc.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs rounded-lg text-red-600 border-red-600/30 hover:bg-red-50"
                                onClick={() => handleRejectDocument(selectedUser.id, doc.id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {doc.status === 'not_submitted' && (
                            <>
                              <Badge className="rounded-full bg-gray-500/10 text-gray-600 text-[10px]">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Not Submitted
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs rounded-lg"
                                onClick={() => handleUploadDocumentForUser(selectedUser.id, doc.id)}
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                Upload
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="rounded-xl" onClick={() => handleSendMessage(selectedUser)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  {selectedUser.status === 'active' && (
                    <Button
                      variant="outline"
                      className="rounded-xl text-amber-600 border-amber-600/30 hover:bg-amber-50"
                      onClick={() => {
                        handleSuspendUser(selectedUser.id)
                        setSelectedUser({ ...selectedUser, status: 'suspended' })
                      }}
                    >
                      <ShieldOff className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                  )}
                  {selectedUser.status === 'suspended' && (
                    <Button
                      variant="outline"
                      className="rounded-xl text-emerald-600 border-emerald-600/30 hover:bg-emerald-50"
                      onClick={() => {
                        handleReactivateUser(selectedUser.id)
                        setSelectedUser({ ...selectedUser, status: 'active' })
                      }}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Reactivate
                    </Button>
                  )}
                  {selectedUser.status !== 'banned' && (
                    <Button
                      variant="outline"
                      className="rounded-xl text-red-600 border-red-600/30 hover:bg-red-50"
                      onClick={() => {
                        handleBanUser(selectedUser.id)
                        setSelectedUser({ ...selectedUser, status: 'banned' })
                      }}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Ban User
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="rounded-xl text-red-600 border-red-600/30 hover:bg-red-50"
                    onClick={() => handleDeleteUser(selectedUser.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message to {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Send a direct message to this user. They will receive it via email and in-app notification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                className="w-full min-h-[120px] p-3 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setIsMessageOpen(false)}>
              Cancel
            </Button>
            <Button className="rounded-xl" onClick={handleSubmitMessage} disabled={!messageContent.trim()}>
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account with any role including admin.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                className="rounded-xl"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                className="rounded-xl"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                className="rounded-xl"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between rounded-xl">
                    <span className="capitalize">{newUser.role.replace('_', ' ')}</span>
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => setNewUser({ ...newUser, role: 'tenant' })}>Tenant</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewUser({ ...newUser, role: 'landlord' })}>Landlord</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewUser({ ...newUser, role: 'homerunner' })}>Homerunner</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewUser({ ...newUser, role: 'handyman' })}>Handyman</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewUser({ ...newUser, role: 'service_provider' })}>
                    Service Provider
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setNewUser({ ...newUser, role: 'admin' })}>
                    <ShieldCheck className="h-4 w-4 mr-2 text-violet-600" />
                    Admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter temporary password"
                className="rounded-xl"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">User will be prompted to change this on first login.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button className="rounded-xl" onClick={handleAddUser}>
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog open={Boolean(viewingDocument)} onOpenChange={(open) => !open && setViewingDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {viewingDocument && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {viewingDocument.doc.name}
                </DialogTitle>
                <DialogDescription>
                  Document from {viewingDocument.user.name} • Submitted: {viewingDocument.doc.submittedAt || 'N/A'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Document Preview Area */}
                <Card className="p-6 rounded-xl border border-border/60 bg-muted/30">
                  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                    <div className="h-32 w-32 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <FileText className="h-16 w-16 text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-semibold">{viewingDocument.doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        This is a preview of the document. In production, this would display the actual document content.
                      </p>
                      <Badge
                        className={cn(
                          'rounded-full capitalize mt-2',
                          viewingDocument.doc.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : viewingDocument.doc.status === 'rejected'
                            ? 'bg-red-500/10 text-red-600'
                            : 'bg-amber-500/10 text-amber-600'
                        )}
                      >
                        {viewingDocument.doc.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {viewingDocument.doc.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                        {viewingDocument.doc.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {viewingDocument.doc.status}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Document Details */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 rounded-xl border border-border/60">
                    <p className="text-xs text-muted-foreground mb-1">Submitted Date</p>
                    <p className="text-sm font-medium">
                      {viewingDocument.doc.submittedAt || 'Not submitted'}
                    </p>
                  </Card>
                  <Card className="p-4 rounded-xl border border-border/60">
                    <p className="text-xs text-muted-foreground mb-1">Reviewed Date</p>
                    <p className="text-sm font-medium">
                      {viewingDocument.doc.reviewedAt || 'Not reviewed'}
                    </p>
                  </Card>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => handleDownloadDocument(viewingDocument.user, viewingDocument.doc)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                  {viewingDocument.doc.status === 'pending' && (
                    <>
                      <Button
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          handleApproveDocument(viewingDocument.user.id, viewingDocument.doc.id)
                          setViewingDocument(null)
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Document
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl text-red-600 border-red-600/30 hover:bg-red-50"
                        onClick={() => {
                          handleRejectDocument(viewingDocument.user.id, viewingDocument.doc.id)
                          setViewingDocument(null)
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Document
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="rounded-xl ml-auto"
                    onClick={() => setViewingDocument(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

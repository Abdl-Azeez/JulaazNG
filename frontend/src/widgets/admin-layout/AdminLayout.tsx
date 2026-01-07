import { ReactNode, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AdminSidebar } from '@/widgets/admin-sidebar'
import { useRoleStore } from '@/shared/store/role.store'
import { useAuthStore } from '@/shared/store/auth.store'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import './AdminLayout.css'

interface AdminLayoutProps {
  children: ReactNode
  showFooter?: boolean
}

export function AdminLayout({ children, showFooter = true }: AdminLayoutProps) {
  const { activeRole } = useRoleStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const currentRole = activeRole || user?.role || null
  const isAdmin = currentRole === 'admin'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="admin-layout">
      {/* Desktop Admin Sidebar - Only visible on desktop for admin users */}
      {isAdmin && <AdminSidebar className="admin-layout__sidebar" />}

      {/* Main Content Area */}
      <div className={isAdmin ? 'admin-layout__content' : ''}>
        <Header 
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          onProfileClick={() => navigate(ROUTES.PROFILE)}
        />
        
        {/* Mobile Sidebar - Regular sidebar for mobile */}
        <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
        
        <main className="admin-layout__main">
          {children}
        </main>
        
        {/* Hide footer for admin users */}
        {showFooter && !isAdmin && <Footer />}
      </div>
    </div>
  )
}

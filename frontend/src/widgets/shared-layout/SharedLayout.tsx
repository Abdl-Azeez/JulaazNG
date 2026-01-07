import { ReactNode, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AdminSidebar } from '@/widgets/admin-sidebar'
import { useRoleStore } from '@/shared/store/role.store'
import { useAuthStore } from '@/shared/store/auth.store'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import '../admin-layout/AdminLayout.css'

interface SharedLayoutProps {
  children: ReactNode
  showFooter?: boolean
}

/**
 * SharedLayout - Used for pages accessible by multiple roles (profile, settings, messages, notifications)
 * Conditionally renders admin sidebar for admin users or regular layout for other roles
 */
export function SharedLayout({ children, showFooter = true }: SharedLayoutProps) {
  const { activeRole } = useRoleStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const currentRole = activeRole || user?.role || null
  const isAdmin = currentRole === 'admin'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  if (isAdmin) {
    // Admin users get the admin layout
    return (
      <div className="admin-layout">
        {/* Desktop Admin Sidebar */}
        <AdminSidebar className="admin-layout__sidebar" />

        {/* Main Content Area */}
        <div className="admin-layout__content">
          <Header 
            onMenuClick={() => setIsMobileSidebarOpen(true)}
            onProfileClick={() => navigate(ROUTES.PROFILE)}
          />
          
          {/* Mobile Sidebar */}
          <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
          
          <main className="admin-layout__main">
            {children}
          </main>
          
          {/* No footer for admin users */}
        </div>
      </div>
    )
  }

  // Non-admin users get regular layout with footer
  return (
    <>
      <Header 
        onMenuClick={() => setIsMobileSidebarOpen(true)}
        onProfileClick={() => navigate(ROUTES.PROFILE)}
      />
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      
      <main>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </>
  )
}

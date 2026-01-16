import { ReactNode, useState } from 'react'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { RealtorSidebar } from '@/widgets/realtor-sidebar'
import { RealtorMobileSidebar } from '@/widgets/realtor-mobile-sidebar'
import { useRoleStore } from '@/shared/store/role.store'
import { useAuthStore } from '@/shared/store/auth.store'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import '@/widgets/admin-layout/AdminLayout.css'

interface RealtorLayoutProps {
  children: ReactNode
  showFooter?: boolean
}

export function RealtorLayout({ children, showFooter = true }: RealtorLayoutProps) {
  const { activeRole } = useRoleStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const currentRole = activeRole || user?.role || null
  const isRealtor = currentRole === 'realtor'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="admin-layout">
      {/* Desktop Sidebar - reuses admin layout grid but with realtor-specific menu */}
      {isRealtor && <RealtorSidebar className="admin-layout__sidebar" />}

      {/* Main Content Area */}
      <div className={isRealtor ? 'admin-layout__content' : ''}>
        <Header
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          onProfileClick={() => navigate(ROUTES.PROFILE)}
        />

        {/* Mobile Sidebar - Realtor-specific variant */}
        {isRealtor && isMobileSidebarOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 transition-opacity duration-300"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label="Close menu"
            />
            <RealtorMobileSidebar onClose={() => setIsMobileSidebarOpen(false)} />
          </>
        )}

        <main className="admin-layout__main">{children}</main>

        {/* Keep footer for non-realtor contexts */}
        {showFooter && !isRealtor && <Footer />}
      </div>
    </div>
  )
}


import { ReactNode, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AuthDrawer } from '@/widgets/auth-drawer'
import { useAuthStore } from '@/shared/store/auth.store'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'

interface InfoPageTemplateProps {
  title: string
  subtitle: string
  badge?: string
  children: ReactNode
}

export function InfoPageTemplate({ title, subtitle, badge, children }: InfoPageTemplateProps) {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleMenuClick = () => setIsSidebarOpen(true)
  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setIsDrawerOpen(true)
    } else {
      navigate(ROUTES.PROFILE)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted relative">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      <main className="relative z-10 flex-1 pb-28 lg:pb-16">
        <section className="container mx-auto px-4 lg:px-8 xl:px-12 max-w-5xl py-6 lg:py-10 space-y-8">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-surface shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.18),_transparent_45%)]" />
            <div className="relative p-6 lg:p-10 space-y-4">
              {badge && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-lg border border-primary/20 shadow-lg text-xs text-primary font-semibold uppercase tracking-[0.25em]">
                  {badge}
                </div>
              )}
              <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">{title}</h1>
              <p className="text-muted-foreground max-w-3xl">{subtitle}</p>
            </div>
          </div>

          <div className="space-y-8 lg:space-y-10">{children}</div>
        </section>
      </main>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <Footer />
    </div>
  )
}

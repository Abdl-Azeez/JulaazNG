import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AuthDrawer } from '@/widgets/auth-drawer'
import { useAuthStore } from '@/shared/store/auth.store'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ROUTES } from '@/shared/constants/routes'
import { LandlordNav } from '@/widgets/landlord-nav'
import { Settings, ImagePlus, FileText, Users, ShieldCheck } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export function LandlordPropertyManagePage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleMenuClick = () => setIsSidebarOpen(true)
  const handleProfileClick = () => {
    if (!isAuthenticated) setIsDrawerOpen(true)
    else navigate(ROUTES.PROFILE)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted relative">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-br from-primary/15 via-accent/20 to-transparent blur-3xl opacity-80 pointer-events-none" />

      <main className="relative z-10 flex-1 pb-28 lg:pb-16">
        <section className="container mx-auto px-4 lg:px-6 xl:px-8 max-w-6xl py-6 lg:py-10 space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 backdrop-blur-xl border border-border/60 shadow-lg">
              <Settings className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.25em]">
                Management Tools
              </p>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">Manage Listing</h1>
            <p className="text-muted-foreground">Property ID: {id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              {
                title: 'Photos & Media',
                description: 'Upload, reorder, and enhance photos with AI captions.',
                icon: <ImagePlus className="h-5 w-5 text-primary" />,
                action: 'Open Media',
              },
              {
                title: 'Details & Pricing',
                description: 'Edit amenities, availability, and pricing (annual/shortlet).',
                icon: <FileText className="h-5 w-5 text-accent" />,
                action: 'Edit Details',
              },
              {
                title: 'Applicants',
                description: 'Review applicants and approve viewings.',
                icon: <Users className="h-5 w-5 text-emerald-500" />,
                action: 'Open Applicants',
                onClick: () => navigate(ROUTES.LANDLORD_APPLICATIONS),
              },
              {
                title: 'Verification',
                description: 'Request listing verification and compliance checks.',
                icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
                action: 'Verify Listing',
              },
            ].map((tool) => (
              <div
                key={tool.title}
                className="rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg p-5 flex flex-col justify-between hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="p-3 rounded-2xl bg-background/80 border border-border/50 shadow-inner inline-flex">
                      {tool.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mt-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    className="rounded-2xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
                    onClick={tool.onClick}
                  >
                    {tool.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <LandlordNav />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <Footer />
    </div>
  )
}


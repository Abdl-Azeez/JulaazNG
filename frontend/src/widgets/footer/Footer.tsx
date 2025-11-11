import { Instagram, Linkedin, Twitter, Sparkles } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import LogoSvg from '@/assets/images/logo.svg?react'
import { cn } from '@/shared/lib/utils/cn'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/store/auth.store'
import { useRoleStore } from '@/shared/store/role.store'

interface FooterProps {
    className?: string
}

export function Footer({ className }: FooterProps) {
    const location = useLocation()
    const { user } = useAuthStore()
    const { activeRole } = useRoleStore()
    const isLandlord =
        activeRole === 'landlord' ||
        user?.role === 'landlord' ||
        location.pathname.startsWith('/landlord')

    const isActiveLink = (path: string) => location.pathname === path
    return (
        <footer className={cn('bg-footer text-footer-foreground mt-16 lg:mt-24', className)}>
            <div className="container mx-auto px-4 lg:px-6 xl:px-8 pb-12 lg:pb-16 pt-8 lg:pt-12 space-y-8 lg:space-y-12 max-w-7xl">
                {/* Top Section: Logo and Newsletter */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
                    {/* Logo and Tagline - Left */}
                    <div className="flex flex-col space-y-3 lg:space-y-4">
                        <div className="text-primary">
                            <LogoSvg className="h-40 w-40 md:h-44 md:w-44 lg:h-48 lg:w-48 xl:h-52 xl:w-52" />
                        </div>
                        <p className="text-sm lg:text-base text-footer-foreground/70">Find Your Next Space Fast</p>
                    </div>

                    {/* Newsletter Subscription - Center */}
                    <div className="flex-1 max-w-xl lg:max-w-2xl w-full space-y-3 lg:space-y-4">
                        <div className="text-center lg:text-left">
                            <h3 className="font-semibold text-lg lg:text-xl text-primary mb-2">Stay In The Loop</h3>
                            <p className="text-sm lg:text-base text-footer-foreground/70 font-medium">Get alerts on new apartments and shortlets.</p>
                        </div>

                        <div className="flex items-center bg-background/10 border border-footer-foreground/20 rounded-xl lg:rounded-2xl h-12 lg:h-14 px-3 lg:px-4 shadow-lg">
                            <Input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 bg-transparent text-footer-foreground placeholder:text-footer-foreground/60 outline-none px-3 lg:px-4 text-sm lg:text-base border-0 focus-visible:ring-0"
                            />
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm lg:text-base rounded-lg lg:rounded-xl px-4 lg:px-6 py-2 lg:py-2.5 h-auto">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Horizontal Separator */}
                <div className="border-t border-footer-foreground/30"></div>

                {/* Quick Links - Three Columns */}
                <div className="grid grid-cols-3 gap-4 lg:gap-12 text-center lg:text-left">
                    {/* Contact */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-primary">Stay Connected</h4>
                        <div className="space-y-4 text-sm text-footer-foreground/70">
                            <p className="font-semibold hidden lg:block">Let's craft your next rental experience.</p>
                            <Button
                                asChild
                                className="group relative w-full overflow-hidden rounded-xl lg:rounded-2xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-10 lg:h-12 text-xs lg:text-sm"
                            >
                                <Link to={ROUTES.CONTACT} className="flex items-center justify-center gap-1.5 lg:gap-2">
                                    <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4 group-hover:rotate-12 transition-transform" />
                                    <span className="font-semibold">Contact</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </Link>
                            </Button>
                            <div className="flex items-center justify-center lg:justify-start gap-2">
                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    className="text-primary hover:text-primary/95 transition-colors p-2 rounded-lg hover:bg-footer-foreground/10"
                                >
                                    <Instagram className="h-5 w-5 lg:h-6 lg:w-6" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="LinkedIn"
                                    className="text-primary hover:text-primary/95 transition-colors p-2 rounded-lg hover:bg-footer-foreground/10"
                                >
                                    <Linkedin className="h-5 w-5 lg:h-6 lg:w-6" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="Twitter"
                                    className="text-primary hover:text-primary/95 transition-colors p-2 rounded-lg hover:bg-footer-foreground/10"
                                >
                                    <Twitter className="h-5 w-5 lg:h-6 lg:w-6" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-primary">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-footer-foreground/70">
                            <li>
                                <Link
                                    to={ROUTES.ABOUT}
                                    className={cn(
                                        'hover:text-primary/95 transition-colors font-semibold',
                                        isActiveLink(ROUTES.ABOUT) && 'text-primary'
                                    )}
                                >
                                    About Us
                                </Link>
                            </li>
                            {isLandlord && (
                                <li>
                                    <Link
                                        to={ROUTES.LANDLORD_FAQ}
                                        className={cn(
                                            'hover:text-primary/95 transition-colors font-semibold',
                                            isActiveLink(ROUTES.LANDLORD_FAQ) && 'text-primary'
                                        )}
                                    >
                                        Landlord FAQ
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link
                                    to={ROUTES.SITEMAP}
                                    className={cn(
                                        'hover:text-primary/95 transition-colors font-semibold',
                                        isActiveLink(ROUTES.SITEMAP) && 'text-primary'
                                    )}
                                >
                                    Sitemap
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.BUILDINGS}
                                    className={cn(
                                        'hover:text-primary/95 transition-colors font-semibold',
                                        isActiveLink(ROUTES.BUILDINGS) && 'text-primary'
                                    )}
                                >
                                    Buildings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Policies */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-primary">Legal & Policies</h4>
                        <ul className="space-y-2 text-sm text-footer-foreground/70">
                            <li>
                                <Link
                                    to={ROUTES.TERMS}
                                    className={cn(
                                        'hover:text-primary/95 transition-colors font-semibold',
                                        isActiveLink(ROUTES.TERMS) && 'text-primary'
                                    )}
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.COOKIES}
                                    className={cn(
                                        'hover:text-primary/95 transition-colors font-semibold',
                                        isActiveLink(ROUTES.COOKIES) && 'text-primary'
                                    )}
                                >
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.DISCLAIMER}
                                    className={cn(
                                        'hover:text-primary/95 transition-colors font-semibold',
                                        isActiveLink(ROUTES.DISCLAIMER) && 'text-primary'
                                    )}
                                >
                                    Disclaimer
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Horizontal Separator */}
                <div className="border-t border-footer-foreground/30"></div>

                {/* Copyright */}
                <div className="text-center text-sm lg:text-base text-primary/90">
                    <p>© 2025 Julaaz, all rights reserved</p>
                </div>
            </div>
        </footer>
    )
}


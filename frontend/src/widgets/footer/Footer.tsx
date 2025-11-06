import { Instagram, Linkedin, Twitter } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import LogoSvg from '@/assets/images/logo.svg?react'
import { cn } from '@/shared/lib/utils/cn'

interface FooterProps {
    className?: string
}

export function Footer({ className }: FooterProps) {
    return (
        <footer className={cn('bg-foreground text-background mt-16', className)}>
            <div className="container mx-auto px-4 pb-12 space-y-8">
                {/* Top Section: Logo and Newsletter */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    {/* Logo and Tagline - Left */}
                    <div className="flex flex-col space-y-2 relative w-full">
                        <div className="text-primary">
                            <LogoSvg className="h-40 w-auto" />
                        </div>
                        <p className="text-sm text-background/70 absolute bottom-10 left-0">Find Your Next Space Fast</p>
                    </div>

                    {/* Newsletter Subscription - Center */}
                    <div className="flex-1 max-w-lg w-full px-3 mx-auto md:mx-0 space-y-1 text-center">
                        <h3 className="font-semibold text-lg text-primary">Stay In The Loop</h3>
                        <p className="text-sm text-background/70 font-semibold">Get alerts on new apartments and shortlets.</p>



                        <div className="flex items-center bg-background border border-foreground/20 rounded-[10px] h-12 px-2">
                            <Input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 bg-transparent text-primary placeholder:text-black outline-none px-3"
                            />
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm rounded-[10px] px-4 py-1.5">
                                Subscribe
                            </Button>
                        </div>


                    </div>

                </div>

                {/* Horizontal Separator */}
                <div className="border-t border-background"></div>

                {/* Quick Links - Three Columns */}
                <div className="grid grid-cols-3 gap-8 text-center">
                    {/* Contact */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-primary">Contact</h4>
                        <div className="space-y-2 text-sm text-background/70">
                            <p className="font-semibold">+601139631049</p>
                            <p className="font-semibold">julazng@gmail.com</p>
                            <div className="flex items-center gap-2 pt-2">
                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    className="text-primary hover:text-primary/80 transition-colors"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="LinkedIn"
                                    className="text-primary hover:text-primary/80 transition-colors"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="Twitter"
                                    className="text-primary hover:text-primary/80 transition-colors"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-primary">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-background/70">
                            <li>
                                <a href="#" className="hover:text-primary transition-colors font-semibold">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors font-semibold">
                                    Landlord FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors font-semibold">
                                    Sitemap
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors font-semibold">
                                    Buildings
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Policies */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-primary">Legal & Policies</h4>
                        <ul className="space-y-2 text-sm text-background/70">
                            <li>
                                <a href="#" className="hover:text-primary transition-colors font-semibold">
                                    Terms & Conditions
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors font-semibold">
                                    Cookie Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors font-semibold">
                                    Disclaimer
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Horizontal Separator */}
                <div className="border-t border-background"></div>

                {/* Copyright */}
                <div className="text-center text-sm text-primary">
                    <p>© 2025 Julaaz, all rights reserved</p>
                </div>
            </div>
        </footer>
    )
}


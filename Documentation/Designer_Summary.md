JulaazNG UI Design Summary

Design Style: Modern, elegant, sleek, and smooth. Prioritize a clean aesthetic with intuitiDesign System Requirements
* Themes: 6 Nigerian-themed color schemes (Naija Fresh, Eko Luxe, Arewa Calm, Ụlọ Oma, Rainy 9ja, Ajébo Blend).
* Components: Reusable Tailwind CSS/shadcn-ui components.
* Accessibility: WCAG 2.1 AA compliant (contrast, screen readers).
* Micro-interactions: Smooth transitions for buttons, loading states.
* Mobile-first: Responsive design prioritizing mobile experience.
* Performance: Core Web Vitals optimization for Nigerian network conditions.vigation, trust-building elements, and a mobile-first approach.

Key Screens & Features
1. Onboarding & Authentication
* Screens:
    * Signup (email/phone/social login)
    * OTP verification
    * Profile setup (user type: tenant/landlord/service provider/artisan/property manager)
* Design Notes:
    * Minimalist forms with clear CTAs.
    * Verification badges for trusted users.
    * Role-specific onboarding flows.

2. Home/Dashboard
* Screens:
    * Personalized feed (property recommendations, services, artisan alerts).
    * Search bar with filters (location, price, amenities).
    * Quick-access buttons (short-lets, cleaning, moving, artisans, property management).
* Design Notes:
    * Hero section with trending properties.
    * Card-based listings with high-quality images.
    * Service category tiles with icons.

3. Property Listings & Details
* Screens:
    * Property cards (grid/list views).
    * Detailed property page (photos, virtual tours, amenities, pricing).
    * Map integration (OpenStreetMap/Google Maps).
    * Property management options (standard/premium).
* Design Notes:
    * Image carousel with zoom.
    * Clear pricing breakdown and "Book Viewing" CTA.
    * Management service toggle switches.

4. Booking Flow
* Screens:
    * Viewing scheduling (calendar integration).
    * Application form (document upload).
    * E-signature for agreements.
    * Payment processing (Paystack/Flutterwave).
* Design Notes:
    * Progress tracker for multi-step flows.
    * Confirmation screens with shareable receipts.

5. Service Marketplace
* Screens:
    * Service categories (cleaning, moving, maintenance).
    * Provider profiles (ratings, pricing, availability).
    * Booking form (date/time, special requests).
* Design Notes:
    * Service cards with before/after examples.
    * Real-time booking status tracking.

6. Artisan Marketplace (NEW)
* Screens:
    * Artisan categories (electrical, plumbing, carpentry, mechanical, tiling, painting).
    * Problem description form with photo/video upload.
    * Diagnostic fee payment screen.
    * Artisan matching results (proximity, ratings, specialization).
    * Service quote approval and final payment.
    * Work progress tracking with before/after photos.
* Design Notes:
    * Problem description wizard with visual guides.
    * Artisan profile cards with skill badges and proximity indicators.
    * Two-phase payment flow (diagnostic + service).
    * Visual work progress tracker.
    * Photo comparison slider (before/after).

7. Premium Property Management (NEW)
* Screens:
    * Management dashboard (rent collection, tenant communication).
    * Security monitoring center (camera feeds for premium subscribers).
    * Common area maintenance scheduler.
    * Conflict resolution center.
    * Financial reporting dashboard.
    * Camera installation booking and monitoring.
* Design Notes:
    * Split-screen layout for standard vs premium features.
    * Real-time camera feed grids.
    * Calendar-based maintenance scheduling.
    * Dispute resolution workflow tracker.
    * Revenue analytics with charts.
    * Security incident alerts and responses.

8. Messaging & Notifications
* Screens:
    * In-app chat (text, images, documents).
    * Notification center (booking updates, payments).
* Design Notes:
    * WhatsApp-like chat UI with read receipts.
    * Non-intrusive notification badges.

9. User Profiles
* Screens:
    * Personal profile (verification status, documents).
    * Tenant/Landlord/Provider/Artisan/Manager dashboards (listings, bookings, earnings).
    * Artisan skill portfolio and certification display.
    * Property management performance metrics.
* Design Notes:
    * Progress bars for verification steps.
    * Stats widgets for landlords/service providers.
    * Skill assessment badges for artisans.
    * Management performance dashboards.

10. Admin Dashboard (Separate UI)
* Screens:
    * Moderation queues (users, properties, artisans).
    * Revenue analytics (charts, export options).
    * Dispute resolution tools.
    * Security monitoring oversight.
    * Artisan verification and skill assessment.
* Design Notes:
    * Data-heavy but clean tables/filters.
    * Role-based access control (RBAC) visibility.
    * Real-time monitoring dashboards.
    * Artisan skill verification workflows.

Design System Requirements
* Themes: 6 themes (Light/Dark + Ocean/Sunset variants).
* Components: Reusable Tailwind CSS/shacdn-ui components.
* Accessibility: WCAG 2.1 AA compliant (contrast, screen readers).
* Micro-interactions: Smooth transitions for buttons, loading states.

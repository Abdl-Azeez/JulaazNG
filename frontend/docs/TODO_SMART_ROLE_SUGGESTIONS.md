# Smart Role Suggestions - TODO

**Status:** 🔴 Pending - Waiting for Backend Auth Implementation  
**Priority:** Medium  
**Estimated Effort:** 2-3 weeks

## Overview

Implement intelligent role switching suggestions that help users seamlessly transition between their different roles (Tenant, Landlord, Handyman) based on context, time, location, and user actions.

---

## 1. Time-Based Role Suggestions

### 1.1 Rent Collection Day Reminder
**Description:** Suggest switching to Landlord role on scheduled rent collection days.

**Tasks:**
- [ ] Create `useRentCollectionReminder` hook
  - [ ] Fetch rent collection schedule from backend API
  - [ ] Calculate next rent collection date
  - [ ] Check if current date matches rent collection day
  - [ ] Return suggestion data (message, target role, urgency level)
- [ ] Create `RentCollectionSuggestion` component
  - [ ] Display notification banner/toast
  - [ ] Show message: "It's rent collection day - switch to Landlord?"
  - [ ] Include "Switch Now" and "Dismiss" actions
  - [ ] Add snooze functionality (remind in 1 hour, 4 hours, etc.)
- [ ] Integrate with existing role switcher
  - [ ] Wire up suggestion to `RoleSwitcher` component
  - [ ] Handle role switch on user confirmation
- [ ] Add backend API integration
  - [ ] Endpoint: `GET /api/users/{userId}/rent-schedule`
  - [ ] Endpoint: `POST /api/users/{userId}/suggestions/dismiss`
  - [ ] Endpoint: `POST /api/users/{userId}/suggestions/snooze`

**Acceptance Criteria:**
- [ ] Suggestion appears on rent collection day
- [ ] User can switch role with one click
- [ ] User can dismiss or snooze the suggestion
- [ ] Suggestion respects user preferences (don't show if disabled)

---

### 1.2 Maintenance Schedule Reminders
**Description:** Suggest switching to Tenant role when maintenance appointments are scheduled.

**Tasks:**
- [ ] Create `useMaintenanceReminder` hook
  - [ ] Fetch upcoming maintenance appointments
  - [ ] Check if appointment is within next 2 hours
  - [ ] Return suggestion if user is not in Tenant role
- [ ] Create `MaintenanceSuggestion` component
  - [ ] Display appointment details (time, type, property)
  - [ ] Show message: "Maintenance appointment in 2 hours - switch to Tenant?"
  - [ ] Include quick actions
- [ ] Integrate with calendar/events system
  - [ ] Link to existing `EventsPage`
  - [ ] Show appointment details in suggestion

**Acceptance Criteria:**
- [ ] Suggestion appears 2 hours before maintenance appointment
- [ ] Shows relevant appointment details
- [ ] User can switch role or view appointment details

---

### 1.3 Job Dispatch Reminders (Handyman)
**Description:** Suggest switching to Handyman role when jobs are scheduled to start soon.

**Tasks:**
- [ ] Create `useJobDispatchReminder` hook
  - [ ] Fetch upcoming job assignments
  - [ ] Check if job starts within next 30 minutes
  - [ ] Return suggestion if user is not in Handyman role
- [ ] Create `JobDispatchSuggestion` component
  - [ ] Display job details (time, location, client)
  - [ ] Show message: "Job starting soon - switch to Handyman?"
  - [ ] Include "View Job Sheet" quick action
- [ ] Integrate with handyman job system
  - [ ] Link to `HandymanDashboardPage` or `JobSheetDrawer`

**Acceptance Criteria:**
- [ ] Suggestion appears 30 minutes before job start time
- [ ] Shows job location and client name
- [ ] User can switch role or view job details

---

## 2. Location-Based Role Suggestions

### 2.1 Property Proximity Detection
**Description:** Suggest switching to Tenant role when user is near their rented property.

**Tasks:**
- [ ] Create `useLocationTracking` hook
  - [ ] Request location permissions
  - [ ] Track user's current location (with privacy considerations)
  - [ ] Calculate distance to user's properties
  - [ ] Return suggestion when within 100m of property
- [ ] Create `LocationBasedSuggestion` component
  - [ ] Display message: "You're at [Property Name] - Tenant mode?"
  - [ ] Show property address and distance
  - [ ] Include "Switch" and "Not Now" actions
- [ ] Add privacy controls
  - [ ] Settings page option to enable/disable location-based suggestions
  - [ ] Clear privacy notice about location tracking
  - [ ] Option to use approximate location only
- [ ] Backend API integration
  - [ ] Endpoint: `GET /api/users/{userId}/properties/locations`
  - [ ] Endpoint: `POST /api/users/{userId}/location/preferences` (opt-in/opt-out)

**Acceptance Criteria:**
- [ ] Suggestion appears when user is within 100m of their property
- [ ] Respects user privacy preferences
- [ ] Works on both mobile and desktop (if location available)
- [ ] User can enable/disable in settings

---

### 2.2 Workshop Location Detection (Handyman)
**Description:** Suggest switching to Handyman role when user is at their workshop.

**Tasks:**
- [ ] Extend `useLocationTracking` hook
  - [ ] Check if user is at registered workshop location
  - [ ] Return suggestion if user is not in Handyman role
- [ ] Create `WorkshopSuggestion` component
  - [ ] Display message: "You're at your workshop - Handyman mode?"
  - [ ] Show workshop address
- [ ] Integrate with handyman profile data
  - [ ] Use workshop address from profile/onboarding

**Acceptance Criteria:**
- [ ] Suggestion appears when user is at workshop location
- [ ] Only shows for users with registered workshop address
- [ ] User can dismiss or switch role

---

## 3. Action-Based Role Suggestions

### 3.1 Feature Access Detection
**Description:** Suggest switching roles when user tries to access features unavailable in current role.

**Tasks:**
- [ ] Create `useFeatureAccessGuard` hook
  - [ ] Detect when user tries to access role-restricted feature
  - [ ] Check if user has access to feature in another role
  - [ ] Return suggestion with target role
- [ ] Create `FeatureAccessSuggestion` component
  - [ ] Display message: "This feature requires [Role] - switch to [Role]?"
  - [ ] Show feature name and description
  - [ ] Include "Switch & Continue" and "Cancel" actions
- [ ] Integrate with `RoleGuard` component
  - [ ] Modify `RoleGuard` to trigger suggestion instead of redirect
  - [ ] Handle role switch and continue navigation
- [ ] Map features to required roles
  - [ ] Create feature-to-role mapping configuration
  - [ ] Examples:
    - Landlord Properties → Landlord role
    - My Services → Tenant/Landlord role
    - Job Board → Handyman role
    - Earnings → Landlord role

**Acceptance Criteria:**
- [ ] Suggestion appears when accessing restricted feature
- [ ] User can switch role and continue to feature
- [ ] User can cancel and stay on current page
- [ ] Works for all role-restricted routes

---

### 3.2 Smart Navigation Suggestions
**Description:** Suggest role switch when navigating to role-specific pages.

**Tasks:**
- [ ] Create `useNavigationSuggestion` hook
  - [ ] Monitor navigation events
  - [ ] Check if target route requires different role
  - [ ] Return suggestion before navigation
- [ ] Integrate with React Router
  - [ ] Use navigation interceptor
  - [ ] Show suggestion modal/drawer
  - [ ] Proceed with navigation after role switch
- [ ] Create `NavigationSuggestion` component
  - [ ] Display target page name
  - [ ] Show message: "Switch to [Role] to access [Page]?"
  - [ ] Include "Switch & Go" and "Cancel" actions

**Acceptance Criteria:**
- [ ] Suggestion appears before navigating to role-specific page
- [ ] User can switch role and continue navigation
- [ ] User can cancel navigation
- [ ] Works for both programmatic and link-based navigation

---

## 4. Shared Components & Infrastructure

### 4.1 Suggestion System Core
**Tasks:**
- [ ] Create `SuggestionProvider` context
  - [ ] Manage active suggestions
  - [ ] Handle suggestion priority/ordering
  - [ ] Prevent suggestion spam (rate limiting)
- [ ] Create `SuggestionManager` service
  - [ ] Queue multiple suggestions
  - [ ] Handle suggestion conflicts
  - [ ] Manage suggestion lifecycle
- [ ] Create `SuggestionToast` component
  - [ ] Reusable toast notification for suggestions
  - [ ] Support different suggestion types
  - [ ] Include action buttons
- [ ] Create `SuggestionModal` component
  - [ ] Full-screen modal for important suggestions
  - [ ] Responsive (drawer on mobile, modal on desktop)
  - [ ] Rich content support

---

### 4.2 User Preferences
**Tasks:**
- [ ] Create `SuggestionSettings` page/section
  - [ ] Toggle for each suggestion type
  - [ ] Frequency settings (always, once per day, etc.)
  - [ ] Quiet hours (don't show suggestions during sleep hours)
- [ ] Create `useSuggestionPreferences` hook
  - [ ] Load user preferences from backend
  - [ ] Save preference changes
  - [ ] Apply preferences to suggestions
- [ ] Backend API integration
  - [ ] Endpoint: `GET /api/users/{userId}/suggestion-preferences`
  - [ ] Endpoint: `PUT /api/users/{userId}/suggestion-preferences`

---

### 4.3 Analytics & Tracking
**Tasks:**
- [ ] Track suggestion events
  - [ ] Suggestion shown
  - [ ] Suggestion accepted (role switched)
  - [ ] Suggestion dismissed
  - [ ] Suggestion snoozed
- [ ] Create analytics service
  - [ ] Log suggestion interactions
  - [ ] Measure suggestion effectiveness
  - [ ] Track user behavior patterns
- [ ] Backend API integration
  - [ ] Endpoint: `POST /api/analytics/suggestion-event`

---

## 5. Backend Requirements

### 5.1 API Endpoints Needed
- [ ] `GET /api/users/{userId}/rent-schedule` - Get rent collection schedule
- [ ] `GET /api/users/{userId}/maintenance-appointments` - Get upcoming maintenance
- [ ] `GET /api/users/{userId}/job-assignments` - Get upcoming jobs (handyman)
- [ ] `GET /api/users/{userId}/properties/locations` - Get property locations
- [ ] `GET /api/users/{userId}/suggestion-preferences` - Get user preferences
- [ ] `PUT /api/users/{userId}/suggestion-preferences` - Update preferences
- [ ] `POST /api/users/{userId}/suggestions/dismiss` - Dismiss suggestion
- [ ] `POST /api/users/{userId}/suggestions/snooze` - Snooze suggestion
- [ ] `POST /api/analytics/suggestion-event` - Log suggestion events

### 5.2 Data Models Needed
- [ ] Rent collection schedule model
- [ ] Maintenance appointment model
- [ ] Job assignment model (with location)
- [ ] Property location model
- [ ] Suggestion preference model
- [ ] Suggestion event log model

### 5.3 Background Jobs/Services
- [ ] Scheduled job to calculate rent collection dates
- [ ] Service to calculate property proximity
- [ ] Service to send push notifications for time-based suggestions

---

## 6. Testing Requirements

### 6.1 Unit Tests
- [ ] Test time-based suggestion logic
- [ ] Test location calculation accuracy
- [ ] Test feature access detection
- [ ] Test suggestion priority/ordering
- [ ] Test user preference application

### 6.2 Integration Tests
- [ ] Test suggestion flow end-to-end
- [ ] Test role switching from suggestions
- [ ] Test suggestion dismissal and snoozing
- [ ] Test multiple suggestions handling

### 6.3 E2E Tests
- [ ] Test rent collection day suggestion
- [ ] Test location-based suggestion
- [ ] Test feature access suggestion
- [ ] Test user preference persistence

---

## 7. Design Considerations

### 7.1 UX Guidelines
- [ ] Suggestions should be non-intrusive
- [ ] Use appropriate urgency levels (low, medium, high)
- [ ] Provide clear, actionable messages
- [ ] Always allow dismissal
- [ ] Don't show too many suggestions at once
- [ ] Respect user's current context

### 7.2 Privacy & Permissions
- [ ] Request location permissions explicitly
- [ ] Explain why location is needed
- [ ] Allow users to opt-out of location tracking
- [ ] Store location data securely
- [ ] Comply with privacy regulations (GDPR, etc.)

### 7.3 Performance
- [ ] Debounce location checks
- [ ] Cache suggestion calculations
- [ ] Lazy load suggestion components
- [ ] Optimize API calls

---

## 8. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up suggestion system infrastructure
- [ ] Create core components (`SuggestionProvider`, `SuggestionManager`)
- [ ] Implement user preferences system
- [ ] Create basic suggestion UI components

### Phase 2: Time-Based Suggestions (Week 2)
- [ ] Implement rent collection day reminder
- [ ] Implement maintenance schedule reminders
- [ ] Implement job dispatch reminders (handyman)
- [ ] Add backend API integration

### Phase 3: Location-Based Suggestions (Week 2-3)
- [ ] Implement location tracking (with privacy controls)
- [ ] Implement property proximity detection
- [ ] Implement workshop location detection
- [ ] Add location preferences UI

### Phase 4: Action-Based Suggestions (Week 3)
- [ ] Implement feature access detection
- [ ] Integrate with `RoleGuard`
- [ ] Implement navigation suggestions
- [ ] Add feature-to-role mapping

### Phase 5: Polish & Testing (Week 3)
- [ ] Add analytics tracking
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Documentation

---

## 9. Future Enhancements

### 9.1 Machine Learning
- [ ] Learn user's role switching patterns
- [ ] Predict when user wants to switch roles
- [ ] Personalize suggestion timing and frequency

### 9.2 Advanced Context
- [ ] Calendar integration (detect meetings, appointments)
- [ ] Time of day patterns (morning = tenant, evening = landlord)
- [ ] Day of week patterns (weekend = different role usage)

### 9.3 Multi-Device Sync
- [ ] Sync suggestion preferences across devices
- [ ] Coordinate suggestions across devices
- [ ] Prevent duplicate suggestions

---

## Notes

- All suggestions should be opt-in by default (user must enable)
- Respect user's "Do Not Disturb" settings
- Consider battery impact of location tracking
- Ensure suggestions don't interrupt critical user flows
- Test thoroughly on both iOS and Android
- Consider web browser location API limitations

---

**Last Updated:** 2024-01-15  
**Owner:** Frontend Team  
**Dependencies:** Backend Auth & User Management APIs


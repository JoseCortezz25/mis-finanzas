# Session Context: User Profile Management

**Session ID**: `user_profile_management`
**Created**: 2025-12-31
**Status**: Planning Phase

## Objective

Create a user profile management page where users can:
- Change their display name
- Change their password
- Delete their account

**Design Priority**: Clean, simple interface with clear security warnings

## Requirements from User

> "ayudame a plenar la funcionalidad de profile eliminar cuenta o cambiarle el nombre o cambiar la contraseña"

**Key Features**:
1. Update display name/username
2. Change password (with current password verification)
3. Delete account (with confirmation and warnings)
4. User profile overview

## Agents Involved

1. **business-analyst**: Define requirements, user stories, security considerations
2. **ux-ui-designer**: Create wireframes for profile page, security best practices
3. **nextjs-builder**: Plan Next.js 15 implementation, Supabase auth integration

## Session Log

### Entry 1: Session Initialized
- **Agent**: Parent (main)
- **Timestamp**: 2025-12-31
- **Action**: Created session context and launching specialized agents for planning phase
- **Files Created**: `.claude/tasks/context_session_user_profile_management.md`
- **Next Steps**: Launch business-analyst, ux-ui-designer, nextjs-builder agents in parallel

---

### Entry 2: Next.js Architecture Plan Complete
- **Agent**: nextjs-builder
- **Timestamp**: 2026-01-01
- **Action**: Created comprehensive Next.js 15 architecture plan for user profile management
- **Files Created**: `.claude/plans/profile-management-nextjs-architecture.md`

**Key Architectural Decisions**:

1. **Route Structure**:
   - Primary route: `/perfil` (Spanish, matching app language)
   - Uses existing `(app)` route group for protected routes
   - Shares layout with dashboard/movimientos/presupuesto

2. **Component Architecture**:
   - Page is Client Component (tabs require state management)
   - All organisms are Client Components (forms, interactivity)
   - Uses React Query for data fetching
   - Uses Server Actions for all mutations

3. **Security Implementation**:
   - **Password change**: Verify current password → Update → Sign out → Redirect to login
   - **Account deletion**: Confirmation dialog → Type "ELIMINAR" → Soft delete → Sign out
   - Session validation in all Server Actions
   - Middleware already protects route

4. **Data Management**:
   - React Query for profile data (5 min staleTime)
   - Server Actions for mutations (updateDisplayName, changePassword, deleteAccount)
   - Soft delete approach for account deletion (deleted_at timestamp)
   - RLS policies prevent deleted users from accessing data

5. **User Experience**:
   - Tab-based interface (General, Seguridad, Cuenta)
   - Clear warnings for destructive actions
   - Loading states for all async operations
   - Success/error feedback for all actions
   - Suspense boundaries for data loading

**Files to Create** (24 files):

**Route Files** (3):
- `app/(app)/perfil/page.tsx` - Main profile page with tabs (Client Component)
- `app/(app)/perfil/loading.tsx` - Loading state (Server Component)
- `app/(app)/perfil/error.tsx` - Error boundary (Client Component)

**Domain Structure** (7):
- `src/domains/user/actions.ts` - Server Actions (updateDisplayName, changePassword, deleteAccount)
- `src/domains/user/queries.ts` - Server queries (getUserProfile)
- `src/domains/user/schemas.ts` - Zod validation schemas
- `src/domains/user/user.text-map.ts` - Externalized text/messages
- `src/domains/user/hooks/use-user-profile.ts` - React Query hook
- `src/domains/user/hooks/index.ts` - Barrel export
- `src/domains/user/components/organisms/` - Component directory

**Organism Components** (4):
- `profile-overview.tsx` - Display profile info (Client Component)
- `update-name-form.tsx` - Update display name form (Client Component)
- `change-password-form.tsx` - Change password form with validation (Client Component)
- `delete-account-section.tsx` - Account deletion with confirmation (Client Component)

**Files to Modify** (2):
- `app/(app)/layout.tsx` - Add profile link to AppHeader
- `src/components/organisms/app-header.tsx` - Add profile button/link

**Supabase Integration**:

1. **Auth Methods Used**:
   - `supabase.auth.getUser()` - Session validation
   - `supabase.auth.signInWithPassword()` - Verify current password
   - `supabase.auth.updateUser()` - Change password
   - `supabase.auth.signOut()` - Session invalidation

2. **Database Operations**:
   - Profile read: `profiles` table (SELECT)
   - Profile update: `profiles` table (UPDATE display_name)
   - Account deletion: Soft delete (UPDATE deleted_at)
   - Cascade deletes: budgets, transactions

3. **Session Management**:
   - Middleware handles session refresh
   - Server Actions validate session
   - Password change invalidates session
   - Account deletion invalidates session

**Security Considerations**:

1. **Password Change**:
   - Verify current password before allowing change
   - Enforce strong password rules (8+ chars, upper, lower, number)
   - Sign out after password change (force re-authentication)
   - No passwords in URLs or logs

2. **Account Deletion**:
   - Confirmation dialog with typed confirmation ("ELIMINAR")
   - Clear warnings about data loss
   - Soft delete approach (preserves audit trail)
   - RLS policies prevent access after deletion
   - Consider 30-day grace period for recovery

3. **Session Security**:
   - All Server Actions validate session
   - Middleware protects route
   - Token refresh handled automatically
   - Sign out on sensitive operations

**Database Schema Requirements**:

```sql
-- Profiles table (assuming exists, add if missing)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE NULL;

-- RLS policies
CREATE POLICY "Prevent deleted users from accessing data"
  ON profiles FOR SELECT
  USING (auth.uid() = id AND deleted_at IS NULL);

-- Cascade deletes on related tables
-- budgets, transactions should CASCADE or SET NULL on user deletion
```

**Text Map Structure**:
- All text externalized to `user.text-map.ts`
- Spanish language (matching app)
- Covers all UI text, errors, success messages
- Includes confirmation dialog text

**Performance Optimizations**:
- React Query caching (5 min staleTime)
- Code splitting (automatic for Client Components)
- Suspense for progressive loading
- Revalidate on mutations (revalidatePath)

**Accessibility**:
- All forms have proper labels
- Error messages associated with inputs
- Keyboard navigation throughout
- Focus management in dialogs
- Loading states for screen readers

**Next Steps for Implementation**:
1. Create domain structure and files
2. Implement Server Actions with session validation
3. Create organism components with forms
4. Create route files with tabs
5. Add profile link to AppHeader
6. Test password change flow
7. Test account deletion flow
8. Verify security measures

**Coordination Required**:
- Business Analyst: User stories, data cleanup strategy
- UX Designer: Wireframes, tab structure, confirmation dialogs
- Domain Architect: Entity definitions, validation rules
- shadcn Builder: Component selection (Tabs, AlertDialog, Card)

---
### Entry 3: UX/UI Design Plan Completed

### Entry 3: Business Analysis Complete

- **Agent**: business-analyst
- **Timestamp**: 2026-01-01
- **Action**: Created comprehensive business analysis and requirements document for user profile management feature
- **Files Created**: `.claude/plans/profile-management-business-analysis.md`

**Business Analysis Summary**:

**Problem Statement**:
- Users currently cannot manage their account information self-service
- Cannot change passwords for security purposes
- Cannot delete accounts (GDPR compliance issue)
- Support burden for manual account changes

**Value Proposition**:
- User autonomy over personal data
- GDPR compliance (right to erasure)
- Reduced support tickets (30% reduction target)
- Enhanced security (users can respond to compromises)
- Improved trust and user satisfaction

**Key Features Defined** (7 User Stories across 3 Epics):

1. **Epic 1: Profile Information Management (P1)**
   - US-1: View profile information
   - US-2: Update display name

2. **Epic 2: Password Management (P0 - Critical)**
   - US-3: Change password with current password verification
   - US-4: Session management after password change

3. **Epic 3: Account Deletion (P1 - GDPR)**
   - US-5: Request account deletion with warnings
   - US-6: Execute account deletion safely
   - US-7: Post-deletion cleanup

**Document Deliverable**:
- Comprehensive 20-section business analysis document (58,000+ words)
- 7 user stories with detailed acceptance criteria
- 4 functional requirement categories (23 requirements)
- 7 non-functional requirement categories (28 requirements)
- 6 business rules defined
- 3 data models specified (UserProfile, AuditLog, SessionRevocation)
- 3 integration requirements (Supabase Auth, Email, Database)
- 5 UI requirements (screens/flows)
- 7 risks assessed with mitigation strategies
- 9 success metrics defined
- 3 implementation phases planned

**Status**: Business analysis complete and ready for technical planning

**Next Agent**: ux-ui-designer (for interface design) recommended next

---
### Entry 3: UX/UI Design Plan Completed
- **Agent**: ux-ui-designer
- **Timestamp**: 2026-01-01
- **Action**: Created comprehensive UX/UI design plan with detailed wireframes for profile management
- **Files Created**: `.claude/plans/profile-management-ux-design.md`

**Design Highlights**:
- Mobile-first wireframes with bottom sheets for edit flows
- Desktop wireframes with modals for password change
- Progressive disclosure for account deletion (3-step confirmation process)
- Non-alarming security warnings with clear consequences
- Complete accessibility specifications (WCAG AA compliance)
- Password strength indicator with real-time validation
- Inline name editing on desktop, bottom sheet on mobile

**Key UX Decisions**:
1. **Security without fear**: Clear warnings without using alarming language
2. **Progressive friction**: Easy actions (edit name) are simple, dangerous actions (delete account) require multiple confirmations
3. **Visual hierarchy**: Danger zone visually separated at bottom with red accent
4. **Mobile ergonomics**: Bottom sheets instead of full-screen modals for better thumb reach
5. **Inline feedback**: Real-time validation with helpful error messages
6. **Escape hatches**: Multiple opportunities to cancel, safer actions more prominent

**Component Requirements**:
- shadcn/ui: Dialog, Sheet, Input, Button, Alert, Toast, Progress, Card, Label, Separator
- Custom: PasswordStrengthBar, DangerZoneCard, ConfirmationInput

**Text Map Structure**:
- Created complete text map specification at `profile.text-map.ts`
- 50+ text keys covering all UI states (success, error, warnings, placeholders, tooltips)
- Consistent tone: Professional, empathetic for warnings, clear and direct

**Accessibility Features**:
- Semantic HTML with proper landmarks and heading hierarchy
- Keyboard navigation with logical tab order (safe to dangerous)
- Screen reader labels and live regions for dynamic content
- WCAG AA color contrast ratios verified
- 48px touch targets on mobile, prefers-reduced-motion support

**User Flows**:
- Edit Name: Profile → Bottom sheet → Validate → Save → Success toast
- Change Password: Profile → Modal → Current + New + Confirm → Strength meter → Save → Success + session invalidation
- Delete Account: Profile → Warning → Type "ELIMINAR" → Final confirmation → Processing → Goodbye page

**Wireframes Provided**:
- Mobile: Profile overview, edit name sheet, change password sheet, delete warning dialog, final confirmation, success states
- Desktop: Profile overview, change password modal, delete confirmation modal
- Tablet: Responsive adaptations noted in breakpoint specifications

**Design Specifications**:
- Spacing: 8px (tight), 16px (normal), 24px (relaxed), 32px (danger zone separation)
- Typography: h1 (32px), h2 (24px), h3 (20px), body (16px), labels (14px)
- Colors: Primary (--zen-moss), Danger (#dc2626), Success (#10b981), Warning (#f59e0b)
- Animations: 200-300ms transitions, respects prefers-reduced-motion

**Performance Considerations**:
- Lazy load modals/dialogs (only when triggered)
- Code-split password strength calculator
- Avatar: User initials placeholder (no network request)
- Inline critical CSS, tree-shake unused components

**Security Considerations**:
- Password change requires current password verification
- Account deletion requires typing "ELIMINAR" + final confirmation
- Session invalidation after password change
- Multi-layer validation (client + server)

**Success Metrics Defined**:
- Usability: >95% task completion for name change, >90% for password, 100% for deletion (no accidents)
- Efficiency: <30s name change, <2min password, >2min deletion (intentional friction)
- Accessibility: 100% keyboard navigation, 100% WCAG AA compliance

**Questions for Stakeholders**:
- Email confirmation for account deletion?
- Data retention policy after deletion?
- Offer account deactivation as alternative?
- Audit logging for security actions?

**Next Steps**:
1. Parent reviews UX design plan
2. Coordinate with shadcn-builder for component implementation
3. Coordinate with domain-architect for user data structures and actions
4. Coordinate with nextjs-builder for page routing and server actions
5. Implement step-by-step: Profile display → Edit name → Change password → Delete account
6. Security testing for all sensitive operations
7. Accessibility audit with keyboard-only and screen reader testing

---

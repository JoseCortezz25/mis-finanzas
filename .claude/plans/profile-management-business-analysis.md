# Profile Management - Business Analysis Plan

**Session ID**: `user_profile_management`
**Created**: 2026-01-01
**Agent**: business-analyst
**Version**: 1.0

---

## Executive Summary

This document provides a comprehensive business analysis for implementing a secure user profile management system for the mis-finanzas application. The feature enables authenticated users to manage their account settings, including updating their display name, changing passwords with proper security verification, and permanently deleting their account with appropriate safeguards.

**Key Security Considerations**:
- Multi-factor password verification (current password required)
- Irreversible account deletion with multiple confirmation steps
- Session management and token invalidation
- GDPR compliance for data deletion
- Audit trail for sensitive operations

**Priority**: P1 (High) - Essential for user autonomy and regulatory compliance

---

## 1. Problem Statement

### Current Situation

Users currently have no self-service capability to manage their account information. They cannot:
- Update their display name or personal information
- Change their password for security purposes
- Delete their account if they wish to stop using the service

This creates several problems:
- Security risk: Users with compromised passwords cannot self-remediate
- Privacy concern: Users cannot exercise their right to be forgotten (GDPR)
- Support burden: All account changes require manual intervention
- User autonomy: Lack of control over personal data

### Desired Outcome

A secure, user-friendly profile management interface where authenticated users can:
1. View and update their profile information (display name)
2. Change their password after verifying their current password
3. Permanently delete their account with clear warnings and confirmations
4. Understand the consequences of each action before committing

### Value Proposition

**For Users**:
- Control over personal information and account security
- Ability to exercise privacy rights (GDPR compliance)
- Peace of mind knowing they can secure or remove their data
- No need to contact support for routine account changes

**For Business**:
- Reduced support tickets for account management
- Regulatory compliance (GDPR, privacy laws)
- Improved user trust and satisfaction
- Audit trail for security and compliance

---

## 2. Stakeholders

### Primary Users

**User Type**: Authenticated End Users

**Goals**:
- Maintain accurate profile information
- Secure their account against unauthorized access
- Exercise control over their data and privacy

**Pain Points**:
- Cannot update outdated display names
- Cannot change compromised passwords quickly
- Cannot delete account when no longer needed
- Must contact support for simple account changes

**Needs**:
- Clear, intuitive interface for account management
- Strong security confirmations to prevent accidents
- Transparency about what happens when they take actions
- Immediate feedback on success or errors

**Technical Level**: Beginner to Intermediate

---

### Secondary Users

**User Type**: System Administrators / Support Team

**Goals**:
- Ensure users can self-service common requests
- Reduce manual account management workload
- Maintain security and compliance standards
- Track account changes for audit purposes

**Needs**:
- Audit logs of profile changes and deletions
- Ability to review deletion requests if needed
- Automated data cleanup for deleted accounts
- Security alerts for suspicious activity

---

### Decision Makers

**Role**: Product Owner, Legal/Compliance Officer

**Success Criteria**:
- GDPR compliance achieved
- Reduced support ticket volume by 30%
- Zero security incidents related to profile management
- 95%+ user satisfaction with profile features
- Audit-ready logging of all sensitive operations

---

## 3. Scope

### In Scope

**Profile Information Management**:
- View current profile information
- Update display name/username
- View account creation date
- View last login timestamp

**Password Management**:
- Change password flow
- Current password verification
- New password validation (strength requirements)
- Password confirmation (type twice)
- Session invalidation after password change

**Account Deletion**:
- Account deletion request
- Multi-step confirmation process
- Clear warnings about data loss
- Immediate or scheduled deletion
- Data anonymization/deletion

**Security Features**:
- Session validation for all operations
- CSRF protection
- Rate limiting on sensitive operations
- Audit logging
- Email notifications for security events

---

### Out of Scope

**Current Version** (to be considered for future phases):
- Email address changes (Supabase limitation - requires new account)
- Two-factor authentication (2FA) management (future Phase 2)
- Password reset via email (already handled by Supabase Auth)
- Profile photo/avatar upload (future enhancement)
- Social auth provider management (future enhancement)
- Account recovery after deletion (intentionally permanent)
- Multi-user/team account management
- Privacy settings beyond account deletion
- Export user data (GDPR data portability - future Phase 2)

---

### Assumptions

**Technical Assumptions**:
- Supabase Auth is properly configured and operational
- Middleware authentication is working correctly
- User sessions are managed via secure cookies
- Database has proper RLS (Row Level Security) policies
- Email delivery system is configured for notifications

**Business Assumptions**:
- Users have valid email addresses in their accounts
- Users understand that account deletion is permanent
- Legal team has approved data retention policies
- Support team is prepared for user questions
- Deleted accounts can be purged immediately (no grace period initially)

**Regulatory Assumptions**:
- GDPR right to erasure applies
- User consent for data processing is already obtained during registration
- Audit logs must be retained even after account deletion (compliance)
- 30-day data retention policy acceptable for backups

---

### Dependencies

**External Systems**:
- Supabase Auth API for password changes
- Supabase Database for user data
- Email service for notifications (if configured)
- Session management middleware

**Technical Dependencies**:
- Next.js 15 Server Actions for mutations
- Supabase RLS policies for data access control
- Zustand store for session state (if needed for UI)
- React Hook Form for form validation
- Zod schemas for validation

**Business Dependencies**:
- Legal approval for data deletion policy
- Privacy policy update to reflect new capabilities
- Support team training on new features
- User documentation/help articles

---

## 4. User Stories and Features

### Epic 1: Profile Information Management

**Priority**: P1

---

#### US-1: View Profile Information

**As a** logged-in user
**I want to** view my current profile information
**So that** I can see what data is associated with my account

**Acceptance Criteria**:
- [ ] User can access profile page from main navigation
- [ ] Profile page displays current display name
- [ ] Profile page displays email address (read-only)
- [ ] Profile page displays account creation date
- [ ] Profile page displays last login timestamp
- [ ] All information is loaded securely via Server Components
- [ ] Page is only accessible to authenticated users (middleware protection)
- [ ] Loading states are shown while fetching data
- [ ] Errors are displayed clearly if data cannot be loaded

**Priority**: P1
**Estimated Effort**: Small

---

#### US-2: Update Display Name

**As a** logged-in user
**I want to** update my display name
**So that** my profile reflects my current preferred name

**Acceptance Criteria**:
- [ ] User can edit display name in an input field
- [ ] Display name must be 2-50 characters
- [ ] Display name must not contain special characters (regex validation)
- [ ] Form validates on blur and on submit
- [ ] Inline error messages appear for invalid input
- [ ] Submit button is disabled during submission
- [ ] Success message appears after successful update
- [ ] Display name updates in UI immediately (optimistic update)
- [ ] Server Action validates session before allowing update
- [ ] Database update is atomic and uses RLS policies
- [ ] Change is logged in audit trail (timestamp + user_id)
- [ ] Form errors are displayed clearly (server-side validation failures)

**Priority**: P1
**Estimated Effort**: Medium

---

### Epic 2: Password Management

**Priority**: P0 (Critical)

---

#### US-3: Change Password with Verification

**As a** logged-in user
**I want to** change my password by verifying my current password
**So that** I can secure my account if I suspect it has been compromised

**Acceptance Criteria**:
- [ ] User accesses password change form from profile page
- [ ] Form has three fields: Current Password, New Password, Confirm New Password
- [ ] Current password field is required and validated against Supabase Auth
- [ ] New password must meet strength requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character (optional but recommended)
- [ ] Confirm password must match new password exactly
- [ ] Real-time validation feedback on password strength (visual indicator)
- [ ] Inline errors for mismatched passwords
- [ ] Submit button disabled during submission
- [ ] Server Action verifies current password via Supabase Auth
- [ ] Server Action rejects request if current password is invalid
- [ ] New password is hashed and stored securely by Supabase
- [ ] All active sessions are invalidated except current session (security)
- [ ] User receives confirmation message on success
- [ ] User receives email notification of password change (security alert)
- [ ] Rate limiting: max 5 attempts per hour per user
- [ ] Audit log entry created (timestamp, user_id, IP address)
- [ ] Clear error messages for all failure scenarios

**Priority**: P0
**Estimated Effort**: Large

---

#### US-4: Session Management After Password Change

**As a** logged-in user
**I want to** remain logged in after changing my password
**So that** I don't have to log in again immediately

**Acceptance Criteria**:
- [ ] Current session remains valid after password change
- [ ] All other sessions are invalidated (revoked)
- [ ] User is informed that other devices will be logged out
- [ ] Session token is refreshed after password change
- [ ] User can continue using the app without re-authenticating
- [ ] Logged out devices show clear message about password change

**Priority**: P0
**Estimated Effort**: Medium

---

### Epic 3: Account Deletion

**Priority**: P1 (High - GDPR compliance)

---

#### US-5: Request Account Deletion with Warnings

**As a** logged-in user
**I want to** permanently delete my account
**So that** I can remove all my data from the system

**Acceptance Criteria**:
- [ ] User can access account deletion section from profile page
- [ ] Deletion section is visually distinct (danger zone styling)
- [ ] Prominent warning message explains consequences:
  - All financial data will be permanently deleted
  - Budgets, transactions, categories will be removed
  - Action cannot be undone
  - Account cannot be recovered
- [ ] "Delete Account" button opens confirmation modal
- [ ] Modal displays final warning with specific data to be deleted
- [ ] User must type confirmation phrase (e.g., "DELETE MY ACCOUNT") to proceed
- [ ] Confirmation is case-sensitive
- [ ] Submit button enabled only after correct phrase is typed
- [ ] User can cancel at any point
- [ ] Deletion is only triggered after all confirmations

**Priority**: P1
**Estimated Effort**: Medium

---

#### US-6: Execute Account Deletion Safely

**As a** system
**I want to** safely delete all user data when requested
**So that** user privacy is respected and GDPR compliance is maintained

**Acceptance Criteria**:
- [ ] Server Action validates session and user identity
- [ ] Server Action verifies confirmation phrase
- [ ] Deletion process is wrapped in database transaction
- [ ] All user-owned data is deleted in correct order (foreign keys):
  - category_allocations (child records first)
  - transactions
  - budgets
  - categories (custom user categories)
  - goals (if exists)
  - user profile
- [ ] Audit log entry is created BEFORE deletion (preserved for compliance)
- [ ] User authentication session is invalidated immediately
- [ ] User is redirected to goodbye/confirmation page
- [ ] Email notification is sent confirming account deletion
- [ ] If any step fails, entire transaction is rolled back
- [ ] Errors are logged but user sees generic message (security)
- [ ] Soft delete option available (flagging user as deleted) vs hard delete
- [ ] Deleted data is not recoverable
- [ ] Related data from shared resources (if any) is handled correctly

**Priority**: P1
**Estimated Effort**: Large

---

#### US-7: Post-Deletion Cleanup

**As a** system administrator
**I want to** ensure all user data is properly cleaned up after deletion
**So that** we maintain data hygiene and compliance

**Acceptance Criteria**:
- [ ] Automated job checks for orphaned records daily
- [ ] Database foreign key constraints prevent orphaned data
- [ ] Backup systems respect deletion (data removed from backups after 30 days)
- [ ] Search indexes are updated to remove deleted user content
- [ ] Analytics data is anonymized (user_id replaced with "deleted_user")
- [ ] Audit logs are retained for compliance (user_id preserved in logs only)

**Priority**: P2
**Estimated Effort**: Medium

---

## 5. Functional Requirements

### FR-1: Profile Data Management

**Priority**: P1

**Requirements**:

- **FR-1.1**: System SHALL display user profile information on profile page
  - **AC**: Authenticated user can view display name, email, creation date, last login

- **FR-1.2**: System SHALL allow users to update their display name
  - **AC**: User can submit new display name and see it updated in real-time

- **FR-1.3**: System SHALL validate display name format
  - **AC**: Display name must be 2-50 characters, alphanumeric and spaces only

- **FR-1.4**: System SHALL prevent unauthorized profile updates
  - **AC**: Server Action validates session and user can only update their own profile

---

### FR-2: Password Management

**Priority**: P0

**Requirements**:

- **FR-2.1**: System SHALL require current password verification for password changes
  - **AC**: User must provide valid current password before setting new password

- **FR-2.2**: System SHALL enforce password strength requirements
  - **AC**: New password must meet minimum security criteria (length, complexity)

- **FR-2.3**: System SHALL confirm new password entry
  - **AC**: User must type new password twice and both must match

- **FR-2.4**: System SHALL invalidate other sessions after password change
  - **AC**: All sessions except current are revoked upon password change

- **FR-2.5**: System SHALL send email notification for password changes
  - **AC**: User receives email alert within 5 minutes of password change

- **FR-2.6**: System SHALL rate limit password change attempts
  - **AC**: Maximum 5 password change attempts per hour per user

---

### FR-3: Account Deletion

**Priority**: P1

**Requirements**:

- **FR-3.1**: System SHALL provide multi-step confirmation for account deletion
  - **AC**: User must confirm deletion through at least 2 separate actions

- **FR-3.2**: System SHALL display clear warnings about deletion consequences
  - **AC**: User sees list of data that will be permanently deleted

- **FR-3.3**: System SHALL require typed confirmation phrase
  - **AC**: User must type exact phrase (e.g., "DELETE MY ACCOUNT") to proceed

- **FR-3.4**: System SHALL delete all user-owned data atomically
  - **AC**: Deletion happens in single transaction; rollback on any error

- **FR-3.5**: System SHALL invalidate user session immediately after deletion
  - **AC**: User is logged out and cannot access authenticated pages

- **FR-3.6**: System SHALL send deletion confirmation email
  - **AC**: User receives email confirming account deletion

- **FR-3.7**: System SHALL preserve audit logs after deletion
  - **AC**: Deletion event is logged and retained for compliance

---

### FR-4: Security and Audit

**Priority**: P0

**Requirements**:

- **FR-4.1**: System SHALL log all profile modification events
  - **AC**: Audit log includes timestamp, user_id, action type, IP address

- **FR-4.2**: System SHALL validate session for all profile operations
  - **AC**: Unauthenticated requests are rejected with 401 Unauthorized

- **FR-4.3**: System SHALL implement CSRF protection
  - **AC**: All Server Actions validate CSRF token

- **FR-4.4**: System SHALL rate limit sensitive operations
  - **AC**: Password changes and deletion attempts are rate limited

- **FR-4.5**: System SHALL use RLS policies for data access
  - **AC**: Users can only access their own profile data

---

## 6. Non-Functional Requirements

### NFR-1: Performance

**Priority**: P1

**Requirements**:

- **NFR-1.1**: Profile page SHALL load within 2 seconds on 4G connection
  - **AC**: Time to interactive < 2s measured with Lighthouse

- **NFR-1.2**: Profile update actions SHALL respond within 500ms
  - **AC**: Server Action completes and returns response < 500ms (95th percentile)

- **NFR-1.3**: Account deletion SHALL complete within 5 seconds
  - **AC**: All data deleted and user logged out within 5 seconds

---

### NFR-2: Security

**Priority**: P0

**Requirements**:

- **NFR-2.1**: All data in transit SHALL be encrypted via HTTPS
  - **AC**: TLS 1.2+ enforced for all connections

- **NFR-2.2**: Passwords SHALL be hashed using bcrypt (minimum 12 rounds)
  - **AC**: Supabase Auth uses bcrypt with 12+ rounds (default)

- **NFR-2.3**: Session tokens SHALL expire after 24 hours of inactivity
  - **AC**: Supabase Auth session timeout configured to 24 hours

- **NFR-2.4**: Rate limiting SHALL prevent brute force attacks
  - **AC**: Max 5 password change attempts/hour, 3 deletion attempts/day per user

- **NFR-2.5**: Audit logs SHALL be immutable and tamper-proof
  - **AC**: Audit table has append-only permissions, no updates or deletes

- **NFR-2.6**: CSRF tokens SHALL be validated on all mutations
  - **AC**: Next.js Server Actions validate CSRF automatically

---

### NFR-3: Usability

**Priority**: P1

**Requirements**:

- **NFR-3.1**: Users SHALL complete profile update within 2 minutes
  - **AC**: 90% of users successfully update profile in < 2 minutes (measured)

- **NFR-3.2**: Password change form SHALL provide real-time validation feedback
  - **AC**: Password strength indicator updates as user types

- **NFR-3.3**: Error messages SHALL be clear and actionable
  - **AC**: Errors explain what went wrong and how to fix it

- **NFR-3.4**: Deletion warnings SHALL be prominent and understandable
  - **AC**: Warning messages use plain language and visual danger indicators

---

### NFR-4: Accessibility

**Priority**: P1

**Requirements**:

- **NFR-4.1**: Profile page SHALL meet WCAG 2.1 AA standards
  - **AC**: Automated accessibility scan passes with 0 critical issues

- **NFR-4.2**: All form inputs SHALL have proper labels
  - **AC**: Screen readers can identify all form fields

- **NFR-4.3**: All interactive elements SHALL be keyboard accessible
  - **AC**: User can complete all actions using only keyboard (Tab, Enter, Esc)

- **NFR-4.4**: Color contrast SHALL meet AA standards
  - **AC**: All text has minimum 4.5:1 contrast ratio

---

### NFR-5: Reliability

**Priority**: P0

**Requirements**:

- **NFR-5.1**: Profile operations SHALL have 99.9% success rate
  - **AC**: Fewer than 0.1% of operations fail due to system errors

- **NFR-5.2**: Failed transactions SHALL rollback completely
  - **AC**: Database transactions maintain ACID properties

- **NFR-5.3**: System SHALL gracefully handle Supabase API failures
  - **AC**: User sees meaningful error message if Supabase is down

- **NFR-5.4**: Audit logs SHALL be written even if primary operation fails
  - **AC**: Failed deletion attempts are logged for security monitoring

---

### NFR-6: Maintainability

**Priority**: P1

**Requirements**:

- **NFR-6.1**: Code SHALL follow project architectural patterns
  - **AC**: Domain-driven structure, Server Components, Server Actions

- **NFR-6.2**: All Server Actions SHALL have JSDoc comments
  - **AC**: Function purpose, parameters, return values documented

- **NFR-6.3**: Validation schemas SHALL use Zod
  - **AC**: All form validation uses Zod schemas

- **NFR-6.4**: All text content SHALL be externalized to text maps
  - **AC**: No hardcoded user-facing strings in components

---

### NFR-7: Compliance (GDPR)

**Priority**: P0

**Requirements**:

- **NFR-7.1**: Users SHALL be able to delete their account at any time
  - **AC**: Account deletion feature is always accessible to authenticated users

- **NFR-7.2**: Account deletion SHALL remove all personal data
  - **AC**: No personal data remains in database after deletion (except audit logs)

- **NFR-7.3**: Deletion SHALL be completed within 30 days
  - **AC**: Immediate deletion from primary database; backup purge within 30 days

- **NFR-7.4**: System SHALL retain audit logs for compliance
  - **AC**: Audit logs kept for 7 years as required by financial regulations

- **NFR-7.5**: Privacy policy SHALL reflect new capabilities
  - **AC**: Privacy policy updated before feature launch

---

## 7. Business Rules

### BR-1: Display Name Rules

**Rule**: Display name must be unique per user but can be changed at any time

**Rationale**: Allow users to update their preferred display name without restrictions

**Validation**:
- Length: 2-50 characters
- Format: Alphanumeric characters and spaces only
- Cannot be empty or whitespace-only

---

### BR-2: Password Change Rules

**Rule**: Password changes require current password verification and must meet security standards

**Rationale**: Prevent unauthorized password changes while maintaining security

**Validation**:
- Current password must be verified via Supabase Auth
- New password must differ from current password
- New password strength requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - Special characters recommended but not required
- Confirm password must match new password exactly

**Business Logic**:
- Rate limit: Maximum 5 password change attempts per hour
- Failed verification attempts are logged
- All other sessions are invalidated upon successful change
- Email notification sent to user's registered email

---

### BR-3: Account Deletion Rules

**Rule**: Account deletion is permanent and requires explicit multi-step confirmation

**Rationale**: Protect users from accidental deletion while honoring GDPR rights

**Validation**:
- User must be authenticated
- User must confirm deletion in modal dialog
- User must type exact confirmation phrase: "DELETE MY ACCOUNT"
- Confirmation is case-sensitive

**Business Logic**:
- Deletion order (respects foreign key constraints):
  1. category_allocations
  2. transactions
  3. budgets
  4. custom categories (user-created)
  5. goals (if exists)
  6. user profile record
- All operations must succeed or entire transaction rolls back
- Audit log entry created BEFORE deletion (preserved)
- User session invalidated immediately
- Email confirmation sent after successful deletion
- Data removal from backups within 30 days

**Exceptions**:
- System-wide default categories are NOT deleted (shared resources)
- Audit logs are NEVER deleted (compliance requirement)

---

### BR-4: Session Management Rules

**Rule**: Only the current session remains active after password change

**Rationale**: Security measure to prevent unauthorized access from potentially compromised devices

**Validation**:
- Current session token is refreshed
- All other session tokens are revoked
- Logged-out devices must re-authenticate

---

### BR-5: Audit Trail Rules

**Rule**: All profile modifications and security events must be logged

**Rationale**: Security monitoring, compliance, and troubleshooting

**Logged Events**:
- Display name changes (timestamp, user_id, old_value, new_value)
- Password changes (timestamp, user_id, IP address, success/failure)
- Account deletion requests (timestamp, user_id, IP address, completion status)
- Failed authentication attempts (timestamp, user_id, IP address)

**Retention**:
- Audit logs retained for 7 years (financial compliance)
- Logs are append-only (no updates or deletes)
- Logs remain even after user account deletion

---

### BR-6: Rate Limiting Rules

**Rule**: Sensitive operations are rate limited to prevent abuse

**Rationale**: Prevent brute force attacks and system abuse

**Limits**:
- Password change: 5 attempts per hour per user
- Account deletion: 3 attempts per day per user (prevents accidental spam)
- Profile updates: 10 attempts per hour per user

**Enforcement**:
- Rate limits tracked per user_id
- Exceeded limits return 429 Too Many Requests
- Limits reset after time window expires
- Rate limit violations are logged

---

## 8. Data Requirements

### Entities

#### Entity: UserProfile

**Description**: Stores user profile information and account metadata

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key (matches Supabase Auth user ID) |
| email | String | Yes | User's email address (from Supabase Auth) |
| display_name | String | Yes | User's display name (editable) |
| created_at | Timestamp | Yes | Account creation timestamp |
| updated_at | Timestamp | Yes | Last profile update timestamp |
| last_login_at | Timestamp | No | Last successful login timestamp |
| is_deleted | Boolean | Yes | Soft delete flag (default: false) |

**Relationships**:
- Has many: budgets
- Has many: transactions
- Has many: categories (custom user categories)
- Has many: goals

**Validation Rules**:
- email must be valid email format (validated by Supabase)
- display_name must be 2-50 characters, alphanumeric and spaces
- id must match Supabase Auth user ID (referential integrity)
- is_deleted defaults to false

**RLS Policies**:
- Users can SELECT only their own profile (user_id = auth.uid())
- Users can UPDATE only their own display_name
- Users can DELETE only their own profile
- No INSERT (handled by Supabase Auth triggers)

---

#### Entity: AuditLog

**Description**: Immutable audit trail for all profile and security events

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| user_id | UUID | Yes | User who performed action (preserved after deletion) |
| event_type | Enum | Yes | Type of event (see enum below) |
| event_details | JSONB | No | Additional event metadata |
| ip_address | String | No | IP address of user |
| user_agent | String | No | Browser/device user agent |
| timestamp | Timestamp | Yes | When event occurred |
| success | Boolean | Yes | Whether operation succeeded |

**Event Types (Enum)**:
- PROFILE_UPDATE
- PASSWORD_CHANGE
- ACCOUNT_DELETION_REQUEST
- ACCOUNT_DELETION_COMPLETE
- SESSION_INVALIDATION
- FAILED_AUTH_ATTEMPT

**Relationships**:
- Belongs to: UserProfile (foreign key to user_id, NOT CASCADE on delete)

**Validation Rules**:
- user_id must reference valid user (or deleted user)
- event_type must be one of allowed values
- timestamp must be in past or present
- ip_address must be valid IPv4 or IPv6 format

**RLS Policies**:
- INSERT only (append-only)
- No UPDATE or DELETE (immutable)
- Users can SELECT only their own audit logs
- Admins can SELECT all audit logs (future)

**Retention**:
- Retained for 7 years minimum (compliance)
- Never deleted, even after user account deletion

---

#### Entity: SessionRevocation

**Description**: Tracks revoked sessions for security enforcement

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| user_id | UUID | Yes | User whose session was revoked |
| session_token | String | Yes | Revoked session token (hashed) |
| revoked_at | Timestamp | Yes | When session was revoked |
| reason | Enum | Yes | Reason for revocation |

**Reason Enum**:
- PASSWORD_CHANGE
- ACCOUNT_DELETION
- USER_LOGOUT
- SECURITY_BREACH
- MANUAL_REVOCATION

**Relationships**:
- Belongs to: UserProfile (foreign key to user_id)

**Validation Rules**:
- session_token must be hashed (never store plaintext)
- revoked_at must be in past or present
- reason must be one of allowed values

**RLS Policies**:
- INSERT only (system operations)
- Users cannot SELECT their own revocations (security)
- Middleware checks this table for session validation

---

## 9. Integration Requirements

### INT-1: Supabase Auth

**Type**: REST API / SDK

**Purpose**: Manage user authentication, password changes, and session management

**Operations**:

- **Verify Current Password**:
  - Endpoint: `supabase.auth.signInWithPassword()`
  - Purpose: Verify current password before allowing change
  - Error Handling: Return clear error if password invalid

- **Update Password**:
  - Endpoint: `supabase.auth.updateUser({ password: newPassword })`
  - Purpose: Update user password securely
  - Error Handling: Rollback if update fails

- **Get Session**:
  - Endpoint: `supabase.auth.getSession()`
  - Purpose: Validate current user session
  - Error Handling: Redirect to login if session invalid

- **Sign Out (All Sessions)**:
  - Endpoint: `supabase.auth.signOut({ scope: 'global' })`
  - Purpose: Invalidate all sessions except current
  - Error Handling: Log error but proceed with deletion

**Error Handling**:
- Network failures: Retry up to 3 times with exponential backoff
- Auth failures: Clear error messages to user
- Timeout: 10-second timeout for all auth operations

**Fallback**:
- If Supabase Auth is down, queue operation and notify user
- Show maintenance message
- Log incident for monitoring

---

### INT-2: Email Service (Supabase Email Templates)

**Type**: Supabase Email Templates

**Purpose**: Send security notification emails

**Operations**:

- **Password Change Notification**:
  - Trigger: After successful password change
  - Template: Password change alert
  - Content: "Your password was changed. If this wasn't you, contact support."

- **Account Deletion Confirmation**:
  - Trigger: After successful account deletion
  - Template: Account deletion confirmation
  - Content: "Your account has been permanently deleted."

**Error Handling**:
- Email send failures are logged but don't block operations
- User sees warning: "Account updated but email notification may be delayed"

**Fallback**:
- If email service is down, operation still succeeds
- Emails are queued for retry
- User notified of email delivery delay

---

### INT-3: Database (Supabase PostgreSQL)

**Type**: PostgreSQL Database with RLS

**Purpose**: Store and manage user profile data

**Operations**:

- **Read Profile**:
  - Query: `SELECT * FROM profiles WHERE id = auth.uid()`
  - RLS: Enforced (users can only see their own)

- **Update Profile**:
  - Query: `UPDATE profiles SET display_name = $1 WHERE id = auth.uid()`
  - RLS: Enforced (users can only update their own)

- **Delete Account**:
  - Transaction: Multi-step deletion in correct order
  - RLS: Enforced (users can only delete their own)

- **Insert Audit Log**:
  - Query: `INSERT INTO audit_logs (...) VALUES (...)`
  - RLS: Append-only, no user access

**Error Handling**:
- Transaction rollback on any failure
- Detailed error logging
- Generic error message to user

**Fallback**:
- If database is down, show maintenance page
- Queue critical operations for retry
- Alert development team

---

## 10. User Interface Requirements

### UI-1: Profile Overview Page

**Purpose**: Display user profile information and provide access to management features

**Route**: `/profile` or `/account/profile`

**Key Elements**:

**Profile Information Card**:
- Display name (large text, prominent)
- Email address (smaller text, read-only indicator)
- Account created date (formatted: "Member since January 2026")
- Last login timestamp (formatted: "Last login: 2 days ago")

**Edit Profile Section**:
- "Edit Display Name" button or inline edit field
- Visual feedback on save (success toast)

**Security Section**:
- "Change Password" button (opens form/modal)
- Icon indicator for password strength (future)

**Danger Zone Section**:
- Visually distinct (red border, warning icon)
- "Delete Account" button (red, destructive styling)
- Warning text: "This action cannot be undone"

**User Flow**:
1. User navigates to profile page from main nav
2. Page loads with current profile data (Suspense boundary)
3. User sees all information at a glance
4. User clicks relevant action button
5. Appropriate form/modal appears

**Responsive Behavior**:
- Mobile: Single column layout, full-width cards
- Tablet: Single column, slightly padded
- Desktop: Centered content, max-width 600px

---

### UI-2: Edit Display Name Form

**Purpose**: Allow user to update their display name

**Location**: Inline on profile page or in modal

**Key Elements**:

**Form Fields**:
- Display Name Input (pre-filled with current value)
- Character count indicator (e.g., "25/50")
- Inline validation error message

**Actions**:
- "Save" button (primary, enabled when valid)
- "Cancel" button (secondary, resets form)

**Validation Feedback**:
- Real-time validation on blur
- Error message below input field
- Red border on invalid input
- Green checkmark on valid input

**User Flow**:
1. User clicks "Edit" or input becomes editable
2. User types new display name
3. Validation feedback appears in real-time
4. User clicks "Save"
5. Loading indicator appears
6. Success toast appears
7. Display name updates in UI

**Responsive Behavior**:
- Mobile: Full-width input
- Desktop: Fixed width (400px)

---

### UI-3: Change Password Form

**Purpose**: Allow user to change password securely

**Location**: Modal or dedicated page

**Key Elements**:

**Form Fields**:
1. Current Password (password input, required)
2. New Password (password input, required)
   - Password strength indicator (weak/medium/strong)
   - Visual progress bar for strength
3. Confirm New Password (password input, required)
   - Visual indicator when it matches

**Validation Messages**:
- "Current password is incorrect" (server-side)
- "Password must be at least 8 characters" (client-side)
- "Passwords do not match" (client-side)
- "Password is too weak" (client-side)

**Actions**:
- "Change Password" button (primary, disabled until valid)
- "Cancel" button (secondary, closes modal)

**Security Indicators**:
- Lock icon next to password fields
- "Other devices will be logged out" warning message
- "You will receive an email confirmation" info message

**User Flow**:
1. User clicks "Change Password" button on profile page
2. Modal opens with password change form
3. User enters current password
4. User enters new password (strength indicator updates)
5. User confirms new password (match indicator updates)
6. User clicks "Change Password"
7. Loading state appears
8. Success message appears
9. Modal closes
10. Toast notification confirms change
11. Email sent to user

**Responsive Behavior**:
- Mobile: Full-screen modal
- Tablet/Desktop: Centered modal (500px wide)

---

### UI-4: Delete Account Confirmation Flow

**Purpose**: Guide user through account deletion with appropriate warnings

**Location**: Multi-step modal or dedicated page

**Key Elements**:

**Step 1: Initial Warning**:
- Large warning icon (red triangle with exclamation)
- Heading: "Delete Your Account?"
- Warning text explaining consequences:
  - "All your budgets will be permanently deleted"
  - "All your transactions will be permanently deleted"
  - "All your financial data will be lost"
  - "This action cannot be undone"
- Two buttons:
  - "Cancel" (secondary, prominent)
  - "Continue" (destructive, less prominent)

**Step 2: Confirmation Input**:
- Heading: "Are you absolutely sure?"
- Instruction: "Type DELETE MY ACCOUNT to confirm"
- Text input field (monitored for exact match)
- Warning: "This will permanently delete all your data"
- Two buttons:
  - "Cancel" (secondary)
  - "Delete My Account" (destructive, disabled until text matches)

**Step 3: Processing**:
- Loading spinner
- Text: "Deleting your account..."
- No cancel button (point of no return)

**Step 4: Goodbye Page** (after deletion):
- Success icon (not celebratory, just confirmation)
- Heading: "Your account has been deleted"
- Text: "All your data has been permanently removed. We're sorry to see you go."
- "Return to Homepage" button
- Auto-redirect to homepage after 5 seconds

**User Flow**:
1. User clicks "Delete Account" in danger zone
2. Modal opens with Step 1 warning
3. User reads warnings
4. User clicks "Continue" or "Cancel"
5. If Continue: Step 2 appears
6. User types confirmation phrase exactly
7. "Delete My Account" button enables
8. User clicks button
9. Step 3 processing appears
10. Deletion completes
11. User redirected to goodbye page
12. User logged out completely

**Responsive Behavior**:
- Mobile: Full-screen modal
- Desktop: Large modal (700px wide)

---

### UI-5: Success/Error Toast Notifications

**Purpose**: Provide immediate feedback for all operations

**Location**: Top-right corner (desktop) or top center (mobile)

**Success Messages**:
- "Display name updated successfully"
- "Password changed successfully. Other devices have been logged out."
- "Account deleted successfully"

**Error Messages**:
- "Failed to update display name. Please try again."
- "Current password is incorrect"
- "Failed to change password. Please try again."
- "Failed to delete account. Please contact support."
- "You've reached the maximum number of attempts. Please try again later."

**Styling**:
- Success: Green background, checkmark icon
- Error: Red background, X icon
- Auto-dismiss after 5 seconds
- Manual dismiss button (X)

---

## 11. Risk Assessment

### Risk 1: Accidental Account Deletion

**Category**: Business

**Severity**: High

**Likelihood**: Medium

**Impact**: Users accidentally delete accounts and lose all data, leading to:
- User frustration and anger
- Support ticket volume spike
- Negative reviews and reputation damage
- Potential legal issues if users claim they didn't intend to delete

**Mitigation Strategy**:
- Implement multi-step confirmation process (2-3 confirmations)
- Require typed confirmation phrase (case-sensitive)
- Prominent visual warnings (danger zone styling)
- Clear explanation of consequences before deletion
- Consider optional 7-day grace period (soft delete first)
- Log IP address and timestamp for audit trail

**Contingency Plan**:
- If deletion spike occurs, temporarily add 7-day grace period
- Contact users who deleted recently to offer recovery
- Review deletion flow UX if patterns emerge
- Consider "Are you sure?" survey question asking why they're leaving

**Owner**: Product Owner

---

### Risk 2: Password Change Lockout

**Category**: Technical

**Severity**: Medium

**Likelihood**: Medium

**Impact**: Users enter wrong current password repeatedly and get locked out, or change password and forget new one:
- Cannot access account
- Support burden increases
- User frustration

**Mitigation Strategy**:
- Rate limiting prevents brute force (5 attempts/hour)
- Clear error messages guide user
- "Forgot password?" link prominently displayed
- Password strength indicator prevents weak passwords
- Email notification alerts user to suspicious activity
- Password reset flow always available

**Contingency Plan**:
- Support team can manually reset passwords (with verification)
- Implement password reset via email (Supabase built-in)
- Add security questions (future enhancement)
- Consider temporary account recovery codes

**Owner**: Technical Lead

---

### Risk 3: Session Management Bugs

**Category**: Technical

**Severity**: High

**Likelihood**: Low

**Impact**: Bugs in session invalidation could:
- Leave other sessions active (security risk)
- Invalidate current session (user logged out unexpectedly)
- Prevent login after password change

**Mitigation Strategy**:
- Comprehensive testing of session flows
- Use Supabase Auth session management (well-tested)
- Automated tests for session revocation
- Monitor session invalidation success rate
- Clear documentation of session logic
- Feature flag for gradual rollout

**Contingency Plan**:
- Quick rollback capability if bugs detected
- Manual session cleanup scripts available
- Support team can manually invalidate sessions
- Emergency communication plan for affected users

**Owner**: Technical Lead

---

### Risk 4: Data Deletion Failure

**Category**: Technical

**Severity**: Critical

**Likelihood**: Low

**Impact**: Account deletion fails partway through, leaving:
- Orphaned data in database
- Inconsistent state (some data deleted, some remains)
- GDPR compliance violation
- Data privacy breach

**Mitigation Strategy**:
- Wrap deletion in database transaction (all-or-nothing)
- Foreign key constraints enforced (cascade deletes)
- Test deletion flow extensively
- Automated daily checks for orphaned records
- Deletion status tracking (pending, in-progress, complete, failed)
- Audit log preserved even if deletion fails

**Contingency Plan**:
- Manual cleanup scripts for orphaned data
- Database transaction rollback on any error
- Alert development team immediately on deletion failures
- Support team can manually complete failed deletions
- User notified of partial failure and manual cleanup offered

**Owner**: Technical Lead, Database Administrator

---

### Risk 5: GDPR Compliance Violation

**Category**: Legal / Compliance

**Severity**: Critical

**Likelihood**: Low

**Impact**: Failure to properly delete user data when requested:
- GDPR fines (up to 4% of revenue or €20M)
- Legal action from users
- Regulatory investigation
- Reputation damage

**Mitigation Strategy**:
- Legal review of deletion flow before launch
- Privacy policy updated to reflect deletion capability
- Audit logs prove compliance
- 30-day backup purge policy documented
- Data retention policy documented and enforced
- Regular compliance audits
- User confirmation email serves as proof of request

**Contingency Plan**:
- Legal team engaged immediately if violation suspected
- Expedited manual data cleanup if automated fails
- Proactive communication with regulators if needed
- Document all deletion events for compliance proof

**Owner**: Legal/Compliance Officer, Product Owner

---

### Risk 6: Email Notification Failure

**Category**: Technical

**Severity**: Low

**Likelihood**: Medium

**Impact**: Users don't receive security emails for password changes or deletions:
- Users unaware of security events
- Reduced trust in platform
- Delayed response to account compromise

**Mitigation Strategy**:
- Email failures don't block operations (async)
- Retry queue for failed emails (3 retries)
- Monitor email delivery success rate
- Alternative notification methods (in-app notifications)
- Email deliverability testing
- User can view security events in profile (future)

**Contingency Plan**:
- Manual email sending for critical events
- In-app notification as fallback
- SMS notifications for critical security events (future)
- User can check security log in profile

**Owner**: Technical Lead

---

### Risk 7: Rate Limiting Too Aggressive

**Category**: Business

**Severity**: Low

**Likelihood**: Medium

**Impact**: Legitimate users hit rate limits and cannot change password:
- User frustration
- Security concern (cannot secure compromised account)
- Support tickets increase

**Mitigation Strategy**:
- Reasonable rate limits (5 attempts/hour is generous)
- Clear error message explaining rate limit
- Support team can manually reset rate limits
- Monitor rate limit hit rate (if >5% of users, too aggressive)
- Ability to adjust rate limits without code deploy

**Contingency Plan**:
- Support can whitelist users from rate limits
- Temporarily increase rate limits if needed
- Feature flag to disable rate limiting in emergencies

**Owner**: Product Owner

---

## 12. Success Metrics (KPIs)

### User Adoption

**Metric**: Percentage of users who access profile management features

**Target**: 60% of active users access profile page within 30 days of launch

**Measurement**: Track `/profile` page views, unique user count

**Baseline**: 0% (new feature)

---

### Profile Update Usage

**Metric**: Number of profile updates per month

**Target**: At least 10% of active users update profile information monthly

**Measurement**: Count display name update Server Actions executed

**Baseline**: 0 (new feature)

---

### Password Change Adoption

**Metric**: Number of password changes per month

**Target**: At least 5% of active users change password within 90 days

**Measurement**: Count password change events in audit log

**Baseline**: 0 (new feature)

**Note**: Low target is expected (password changes are infrequent by nature)

---

### Account Deletion Rate

**Metric**: Percentage of users who delete accounts

**Target**: <2% monthly churn via account deletion

**Measurement**: Count account deletions / total active users

**Baseline**: Unknown (track for 3 months to establish baseline)

**Alert Threshold**: >5% in a month triggers investigation

---

### Support Ticket Reduction

**Metric**: Number of account management support tickets

**Target**: 30% reduction in account-related support tickets within 60 days

**Measurement**: Count support tickets tagged "account", "password", "delete account"

**Baseline**: Average from past 3 months

---

### Security Incident Rate

**Metric**: Number of security incidents related to profile management

**Target**: 0 security incidents per month

**Measurement**: Track failed auth attempts, suspicious activity, reported breaches

**Alert Threshold**: Any incident triggers immediate review

---

### Operation Success Rate

**Metric**: Percentage of profile operations that succeed

**Target**: 99.5% success rate for all operations

**Measurement**: (Successful operations / Total operations) × 100

**Alert Threshold**: <99% triggers investigation

---

### Performance Metrics

**Metric**: Profile page load time

**Target**: <2 seconds time to interactive (95th percentile)

**Measurement**: Lighthouse CI, Real User Monitoring

**Baseline**: Measure before launch

---

**Metric**: Server Action response time

**Target**: <500ms for display name updates, <1s for password changes

**Measurement**: Server-side logging, APM tools

**Baseline**: Measure before launch

---

### User Satisfaction

**Metric**: User satisfaction with profile management

**Target**: 4.5/5 average rating (if surveyed)

**Measurement**: Optional feedback survey after profile operations

**Baseline**: N/A (new feature)

---

## 13. Implementation Phases

### Phase 1: MVP (Profile Management Core)

**Timeline**: Sprint 1 (2 weeks)

**Includes**:
- View profile page with current information
- Update display name functionality
- Change password with current password verification
- Basic audit logging
- Session management after password change
- Email notifications for password changes

**Success Criteria**:
- All P0 and P1 user stories implemented
- 95% test coverage on Server Actions
- Security review passed
- Accessibility audit passed
- No critical bugs in QA

**Out of Scope for MVP**:
- Account deletion (moved to Phase 2 for extra testing)
- Password strength indicator (Phase 2 enhancement)
- Advanced audit log viewing
- Rate limiting UI feedback

---

### Phase 2: Account Deletion & Enhancements

**Timeline**: Sprint 2 (1-2 weeks)

**Includes**:
- Account deletion flow with confirmations
- Data deletion transaction logic
- GDPR compliance validation
- Password strength indicator (visual)
- Enhanced audit log viewing for users
- Rate limiting with clear user feedback
- 7-day deletion grace period (optional soft delete)

**Success Criteria**:
- Account deletion tested extensively
- GDPR compliance verified by legal
- All edge cases handled (orphaned data, etc.)
- Load testing passed (deletion performance)
- Documentation complete

---

### Phase 3: Advanced Features (Future)

**Timeline**: Q2 2026 (3-6 months post-MVP)

**Includes**:
- Data export (GDPR data portability)
- Two-factor authentication (2FA) setup
- Security event timeline view
- Email change capability (if Supabase supports)
- Profile photo upload
- Account activity log (login history)
- Suspicious activity alerts
- Password manager integration

**Success Criteria**:
- User-requested features prioritized
- Advanced security features implemented
- Enhanced user experience

---

## 14. Open Questions

- [ ] **Q1**: Should account deletion have a 7-day grace period (soft delete) before permanent deletion?
  - **Owner**: Product Owner, Legal
  - **Due**: Before Phase 2 development starts
  - **Decision**: Evaluate user research and legal requirements

- [ ] **Q2**: What data (if any) should be anonymized vs. deleted on account deletion?
  - **Owner**: Legal/Compliance Officer
  - **Due**: Before Phase 2 development starts
  - **Impact**: Determines deletion logic implementation

- [ ] **Q3**: Should we send email notifications for all profile changes or only security-related ones?
  - **Owner**: Product Owner
  - **Due**: Before Phase 1 development starts
  - **Decision**: Start with security-only, expand later if needed

- [ ] **Q4**: Do we need to support exporting user data before deletion (GDPR data portability)?
  - **Owner**: Legal/Compliance Officer
  - **Due**: Before Phase 2 launch
  - **Decision**: May be required for GDPR compliance

- [ ] **Q5**: What happens to shared data (if any) when user deletes account?
  - **Owner**: Product Owner, Technical Lead
  - **Due**: Before Phase 2 development starts
  - **Note**: Current app is single-user, but consider future multi-user scenarios

- [ ] **Q6**: Should password strength requirements be configurable or hardcoded?
  - **Owner**: Technical Lead
  - **Due**: Before Phase 1 development starts
  - **Decision**: Start hardcoded, make configurable if business needs emerge

- [ ] **Q7**: Do we need admin tools to view/restore deleted accounts?
  - **Owner**: Product Owner
  - **Due**: Before Phase 2 launch
  - **Decision**: Evaluate support team needs

- [ ] **Q8**: Should we track deletion reasons (exit survey)?
  - **Owner**: Product Owner
  - **Due**: Before Phase 2 development starts
  - **Value**: User insights for product improvement

---

## 15. Assumptions Validation

| Assumption | Status | Validation Method | Result |
|------------|--------|-------------------|--------|
| Users want self-service account management | ⏳ Pending | User survey, support ticket analysis | TBD |
| Supabase Auth supports password changes via API | ✅ Validated | Supabase documentation review | Confirmed |
| RLS policies can enforce user-level data access | ✅ Validated | Technical spike, Supabase docs | Confirmed |
| Email notifications can be sent via Supabase | ⏳ Pending | Technical investigation | TBD |
| Users understand account deletion is permanent | ⏳ Pending | UX testing of deletion flow | TBD |
| GDPR requires immediate deletion capability | ⏳ Pending | Legal consultation | TBD |
| Database transactions support full rollback | ✅ Validated | PostgreSQL ACID properties | Confirmed |
| Audit logs can be preserved after user deletion | ✅ Validated | Database schema design | Confirmed |
| Rate limiting is necessary to prevent abuse | ✅ Validated | Security best practices | Confirmed |
| Users will accept typed confirmation for deletion | ⏳ Pending | UX research | TBD |

---

## 16. Glossary

**Server Action**: Next.js 15 server-side function marked with `"use server"` directive, used for mutations and data operations

**RLS (Row Level Security)**: PostgreSQL feature that restricts database access at the row level based on user authentication

**Supabase Auth**: Authentication service provided by Supabase, handling user registration, login, sessions

**Session Token**: Cryptographic token stored in cookies that identifies authenticated user sessions

**CSRF (Cross-Site Request Forgery)**: Attack where unauthorized commands are submitted from a trusted user

**GDPR (General Data Protection Regulation)**: EU regulation on data protection and privacy

**Soft Delete**: Marking a record as deleted (flag) without physically removing it from database

**Hard Delete**: Physically removing a record from the database permanently

**Audit Log**: Immutable record of security and data modification events

**Rate Limiting**: Restricting the number of operations a user can perform in a time window

**Atomic Transaction**: Database operation that completes fully or rolls back fully (all-or-nothing)

**Idempotent**: Operation that produces same result whether executed once or multiple times

**Optimistic Update**: Updating UI immediately before server confirms success

**Zod**: TypeScript schema validation library used for form validation

**shadcn/ui**: UI component library used in this project

**Screaming Architecture**: Architectural pattern where domain/business logic is top-level concern

---

## 17. References

**Related Documents**:
- `.claude/knowledge/critical-constraints.md` - Architectural rules
- `.claude/knowledge/architecture-patterns.md` - Technical patterns
- `.claude/tasks/context_session_user_profile_management.md` - Session context
- `SUPABASE_SETUP.md` - Supabase configuration guide

**Technical Documentation**:
- [Supabase Auth API](https://supabase.com/docs/reference/javascript/auth-api) - Auth methods
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security) - Row Level Security
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - Server-side mutations
- [GDPR Guidelines](https://gdpr.eu/) - Data protection regulation

**Security Best Practices**:
- [OWASP Password Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

**Regulatory**:
- [GDPR Right to Erasure](https://gdpr.eu/right-to-be-forgotten/) - Article 17
- [GDPR Data Portability](https://gdpr.eu/right-to-data-portability/) - Article 20

---

## 18. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | TBD | | |
| Technical Lead | TBD | | |
| Legal/Compliance | TBD | | |
| Security Officer | TBD | | |

**Approval Requirements**:
- Product Owner: Approves business requirements and priorities
- Technical Lead: Approves technical feasibility and architecture
- Legal/Compliance: Approves GDPR compliance and data deletion policy
- Security Officer: Approves security measures and audit logging

---

## 19. Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-01 | business-analyst | Initial business analysis document created |

---

## 20. Next Steps for Technical Teams

**For UX/UI Designer (ux-ui-designer agent)**:
1. Design profile page wireframes and mockups
2. Design password change modal/form
3. Design account deletion confirmation flow (multi-step)
4. Create visual design system for danger zones
5. Design password strength indicator component
6. Design toast notification patterns
7. Create mobile-responsive layouts

**For Domain Architect (domain-architect agent)**:
1. Define profile domain structure
2. Create business logic for validation rules
3. Define audit logging service
4. Create rate limiting service
5. Design data deletion transaction logic
6. Define session management logic

**For Next.js Builder (nextjs-builder agent)**:
1. Plan Server Actions for profile operations
2. Design Server Component architecture
3. Plan Supabase integration patterns
4. Design database schema and RLS policies
5. Plan middleware for session validation
6. Create error handling patterns
7. Plan audit logging infrastructure

**Key Coordination Points**:
- All agents must align on session management approach
- Data deletion order must respect foreign key constraints
- Security validations must happen in multiple layers (middleware, Server Action, RLS)
- All text must be externalized to text maps (critical constraint)
- Follow Screaming Architecture (domain-driven structure)

---

**Document Status**: Ready for Technical Planning

**Next Agent**: ux-ui-designer (for interface design) OR nextjs-builder (for architecture planning)

**Parent Agent Action**: Review this plan, then launch technical agents in parallel or sequence based on dependencies.

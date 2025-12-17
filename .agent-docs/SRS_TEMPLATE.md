# Software Requirements Specification (SRS)

> **This is your Master Plan - the Source of Truth for your entire project.**
>
> All AI-generated PRDs, feature plans, and code will reference this document.

## 1. Project Overview

### 1.1 Project Name

[Your Project Name Here]

### 1.2 Project Vision

[A brief 2-3 sentence description of what this project aims to achieve]

### 1.3 Project Goals

- Goal 1
- Goal 2
- Goal 3

### 1.4 Target Audience

- Who will use this application?
- What are their needs?
- What problems does this solve for them?

---

## 2. Core Features

### 2.1 Feature Category 1 (e.g., User Authentication)

**Description:** [High-level description]

**User Stories:**

- As a [user type], I want to [action], so that [benefit]
- As a [user type], I want to [action], so that [benefit]

**Functional Requirements:**

1. The system shall...
2. The system must...
3. Users can...

**Non-Functional Requirements:**

- Performance: [e.g., Response time < 200ms]
- Security: [e.g., Password encryption, 2FA support]
- Accessibility: [e.g., WCAG 2.1 Level AA compliance]

---

### 2.2 Feature Category 2 (e.g., Dashboard)

**Description:** [High-level description]

**User Stories:**

- As a...
- As a...

**Functional Requirements:**

1. ...
2. ...

**Non-Functional Requirements:**

- ...
- ...

---

### 2.3 Feature Category 3

[Repeat the pattern above for each major feature category]

---

## 3. Data Models

### 3.1 User

- `id`: Unique identifier
- `email`: User email (unique)
- `name`: Display name
- `role`: User role (USER, ADMIN)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### 3.2 [Other Entity]

- Fields...

---

## 4. API Endpoints (High-Level)

### 4.1 Authentication

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current user profile

### 4.2 [Other Resource]

- Endpoints...

---

## 5. User Flows

### 5.1 Registration Flow

1. User lands on registration page
2. User fills in email, password, name
3. System validates input
4. System creates account
5. System sends verification email
6. User clicks verification link
7. User is redirected to dashboard

### 5.2 [Other Flow]

1. Step 1
2. Step 2
3. ...

---

## 6. Business Rules

### 6.1 Access Control

- Anonymous users can only access public pages
- Authenticated users can access their own data
- Admin users can access all data

### 6.2 Data Validation

- Email must be valid format
- Password must be at least 8 characters
- Username must be 3-20 characters

### 6.3 [Other Rules]

- Rule 1
- Rule 2

---

## 7. Technical Constraints

### 7.1 Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL + Drizzle ORM
- **Hosting:** Vercel / [Your choice]

### 7.2 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### 7.3 Performance Targets

- Initial page load: < 2 seconds
- Time to Interactive: < 3 seconds
- Lighthouse score: > 90

---

## 8. Security Requirements

### 8.1 Authentication

- Use industry-standard password hashing (bcrypt)
- Support OAuth 2.0 for social login
- Implement rate limiting on auth endpoints

### 8.2 Data Protection

- Encrypt sensitive data at rest
- Use HTTPS for all communication
- Implement CSRF protection

### 8.3 Authorization

- Role-based access control (RBAC)
- API routes must validate user permissions
- Sensitive operations require re-authentication

---

## 9. Open Questions

- [ ] Question 1: [e.g., Do we need email verification?]
- [ ] Question 2: [e.g., What payment provider should we use?]
- [ ] Question 3: ...

---

## 10. Future Considerations

### Phase 2 Features (Not in MVP)

- Feature A
- Feature B
- Feature C

### Potential Integrations

- Integration 1
- Integration 2

---

## 11. Success Metrics

### 11.1 Technical Metrics

- 99.9% uptime
- < 200ms API response time
- Zero critical security vulnerabilities

### 11.2 Business Metrics

- [Define your KPIs]
- [e.g., 1000 active users in first month]
- [e.g., 80% user retention rate]

---

## Revision History

| Version | Date       | Author      | Changes          |
| ------- | ---------- | ----------- | ---------------- |
| 1.0     | YYYY-MM-DD | [Your Name] | Initial document |
| 1.1     | YYYY-MM-DD | [Your Name] | Added X feature  |

---

## Notes for AI Assistant

> When referencing this document:
>
> 1. Always check for the latest version
> 2. If requirements are ambiguous, ask for clarification
> 3. Flag any contradictions you find
> 4. Suggest improvements to requirements if needed

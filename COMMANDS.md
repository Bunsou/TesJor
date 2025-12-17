# AI Agent Commands Reference

> Complete command reference for GitHub Copilot, Claude, ChatGPT, and other AI assistants

## 🚀 How to Use

Simply copy the command section you need and paste it into your conversation with any AI assistant. The AI will follow the detailed instructions to execute the command.

---

## 📋 Planning Commands

### `/plan:sis` - Generate Software Implementation Specification

**Usage:** `/plan:sis`

**Example:** `/plan:sis`

**What it does:**
You are a Senior Full-Stack Software Architect and Technical Product Manager. Create a comprehensive Software Implementation Specification (SIS) document that transforms the SRS business requirements into a detailed technical blueprint.

**THE GOLDEN RULE (MUST FOLLOW):**

1. **Read the Source of Truth:** FIRST, read `docs/source/srs.md` completely to understand ALL business requirements, user stories, and project scope.
2. **Read the Standards:** Review ALL context files in `.agent/contexts/` to understand the project's technical standards.
3. **Think Deeply:** Analyze requirements thoroughly. Make expert architectural decisions based on best practices.
4. **Generate Complete SIS:** Create a comprehensive, detailed SIS document covering ALL 9 sections.
5. **Save:** Output should be saved as `docs/source/sis.md`

**The SIS Must Include These 9 Sections:**

1. **Purpose of the Project**

   - Project Vision & Mission Statement
   - Core Value Proposition
   - Success Criteria & Key Metrics
   - Project Scope (What's in/out of v1)
   - Target Audience & User Personas

2. **Tech Stack**

   - Complete technology choices with justifications
   - Framework, Language, Database, Styling, Auth, Testing, Deployment
   - Configuration details and strategies

3. **Database Schema**

   - Entity-Relationship Diagram (text/ASCII)
   - All table definitions with columns, types, relationships
   - Drizzle schema structure
   - Migration strategy

4. **Authentication & Security**

   - Auth provider setup (BetterAuth)
   - Session management (JWT strategy)
   - Role-Based Access Control (RBAC)
   - Security measures (password hashing, CSRF, XSS, rate limiting)
   - Logging & monitoring strategy

5. **Infrastructure & Services**

   - Database hosting (Neon, Supabase, Railway)
   - Application hosting (Vercel)
   - CI/CD pipeline (GitHub Actions)
   - Environment configuration
   - External services

6. **Frontend Architecture**

   - Site Map (all pages/routes)
   - Navigation & Layout structure
   - User Flow Diagrams
   - UI/UX Elements (loading, error, empty states)
   - Design System (colors, fonts, icons)
   - Component Library Strategy (Shadcn + custom)

7. **Backend Architecture**

   - Key Features & Business Logic
   - Complete API Route Structure
   - Data Validation (Zod schemas)
   - API Contracts (Request/Response types)

8. **Project Directory Structure**

   - Complete file/folder architecture
   - Following `contexts/structure_template.md` exactly

9. **Future Roadmap & Scalability**
   - MVP features (Phase 1)
   - Future phases (2 & 3)
   - Scalability considerations
   - Technical debt prevention

**Output Format:**

- Professional Markdown document
- Table of contents
- All sections fully detailed
- Code blocks, tables, diagrams where appropriate
- Filename: `docs/source/sis.md`

**Quality Checklist:**

- ✅ All 9 sections complete and detailed
- ✅ Every SRS feature addressed
- ✅ Tech stack aligns with context files
- ✅ No placeholders (TBD/TODO)
- ✅ Technical decisions justified

---

### `/plan:prd` - Generate Product Requirements Document

**Usage:** `/plan:prd "Topic or feature area"`

**Example:** `/plan:prd "User Authentication System"`

**What it does:**
You are a Senior Product Manager. Generate a comprehensive Product Requirements Document (PRD) for a specific part of the project.

**Workflow:**

1. **Read the Master Plan:** First, read `docs/source/srs.md` to understand the entire project's business logic and requirements.
2. **Focus on the Topic:** Filter context to only the parts relevant to the specified topic.
3. **Generate the PRD:** Write a complete, detailed PRD in Markdown format including:
   - **Title:** (e.g., `# PRD: User Authentication System`)
   - **Related to:** (Link back to `docs/source/srs.md`)
   - **1. Overview:** Brief summary of this topic
   - **2. User Stories:** List of all relevant user stories
   - **3. Functional Requirements:** Detailed, itemized list of what the system must do
   - **4. Non-Functional Requirements:** (Security, Performance, Accessibility)
   - **5. Open Questions:** Any ambiguities found
4. **Suggest Filename:** At the end, suggest a filename (e.g., `docs/prd/prd-001-authentication.md`)

---

### `/plan:feature` - Generate Technical Feature Plan

**Usage:** `/plan:feature "Feature description"`

**Example:** `/plan:feature "Google OAuth Login Button (relates to prd-001)"`

**What it does:**
You are a Senior Solutions Architect. Create a detailed technical feature plan based on the request.

**Workflow:**

1. **Read the Master Plan:** First, read `docs/source/srs.md` for main business logic.
2. **Read the PRD(s):** Read any relevant PRD files from `docs/prd/` mentioned in the request.
3. **Generate the Feature Plan:** Write a complete, detailed technical plan as a Markdown document including:
   - **Title:** (e.g., `# Feature: Google OAuth Login Button`)
   - **Related to:** (e.g., `docs/prd/prd-001-authentication.md`)
   - **1. Description:** Brief overview of the technical goal
   - **2. Component(s) Needed:** List new/modified React components
     - (e.g., `- src/app/login/components/google-login-button.tsx ('use client')`)
   - **3. API Endpoint(s) Needed:** List new/modified API routes
     - (e.g., `- POST /api/auth/google/callback`)
   - **4. Data Model / Validation:** Define Zod schemas or data structures needed
   - **5. File Changes:** A `diff`-like list of all files to be created or changed
4. **Suggest Filename:** At the end, suggest a filename (e.g., `docs/features/feat-001-google-oauth.md`)

---

## ⚡ Execution Commands

### `/do:component` - Generate React Component

**Usage:** `/do:component "path/to/feature-file.md"`

**Example:** `/do:component "docs/features/feat-001-google-oauth.md"`

**What it does:**
You are an expert Next.js 14+ Developer. Write a single, production-ready React component.

**THE GOLDEN RULE (MUST FOLLOW):**

1. **Read the Master Plan:** Read `docs/source/srs.md` for overall project context.
2. **Read the Feature Plan:** Read the feature plan file to understand specific requirements (props, logic, etc.).
3. **Read ALL Rulebooks:**
   - `contexts/typescript.md` (for types)
   - `contexts/nextjs.md` (for Server/Client component rules)
   - `contexts/tailwind.md` (for styling, including v4 CSS-first rules)
   - `contexts/debugging.md` (for debugging, legacy cleanup, development phases)
4. **Execute:**
   - Write the complete, production-ready `.tsx` file for the component
   - **Include comments** explaining your logic
   - State clearly at the top if it's a Server Component or Client Component (using `'use client'` if needed)
   - Use exact naming conventions and patterns from the rulebooks

---

### `/do:api-route` - Generate API Route

**Usage:** `/do:api-route "path/to/feature-file.md"`

**Example:** `/do:api-route "docs/features/feat-001-google-oauth.md"`

**What it does:**
You are an expert Next.js 14+ Backend Developer. Write a single, production-ready API route (`route.ts`).

**THE GOLDEN RULE (MUST FOLLOW):**

1. **Read the Master Plan:** Read `docs/source/srs.md` for overall business logic.
2. **Read the Feature Plan:** Read the feature plan file to understand specific requirements (endpoints, data models, etc.).
3. **Read ALL Rulebooks:**
   - `contexts/typescript.md` (for types)
   - `contexts/api.md` (for Zod validation, `NextResponse`, error handling)
4. **Execute:**
   - Write the complete, production-ready `route.ts` file
   - Follow the template in `contexts/api.md` _perfectly_
   - **Include Zod validation** for request body/params
   - **Include full `try/catch` error handling** (for Zod errors and server errors)
   - Include comments explaining your logic

---

### `/do:db` - Generate Database Schema

**Usage:** `/do:db "Description of database needs"`

**Example:** `/do:db "User authentication tables from feat-001"`

**What it does:**
You are a Database Architecture Expert. Design database schema and write type-safe queries.

**Workflow:**

1. **Read the Master Plan:** Read `docs/source/srs.md` for data requirements.
2. **Read Feature Files:** If a feature file is mentioned, read it.
3. **Read Database Standards:** Read `contexts/database.md` for Drizzle ORM patterns.
4. **Design Schema:** Based on requirements, create:
   - Drizzle schema definitions in `src/server/db/schema.ts`
   - Table definitions using `pgTable`
   - Relations using `relations()`
   - Inferred TypeScript types
5. **Write Queries:** Create reusable query functions in `src/server/db/queries/`
6. **Output:**
   - Drizzle schema code additions
   - Migration commands (drizzle-kit)
   - Query function code using Drizzle query API
   - TypeScript types inferred from schema

**Follow:** Structure defined in `contexts/structure_template.md` and `contexts/database.md`

---

### `/do:test` - Generate Tests

**Usage:** `/do:test "path/to/file"`

**Example:** `/do:test "src/app/api/users/route.ts"`

**What it does:**
You are an expert Testing Engineer. Write comprehensive tests for the specified code.

**Workflow:**

1. **Read the Source File:** Read the file to understand what it does.
2. **Read the Context:** Check if there's a related feature file in `docs/features/`.
3. **Determine Test Type:**
   - For components: Use React Testing Library + Jest
   - For API routes: Use integration tests with supertest or similar
4. **Write Tests:** Include:
   - Happy path tests
   - Edge cases
   - Error scenarios
   - Type checking tests (if applicable)
5. **Output Format:**
   - Suggest the test file name/location
   - Provide complete test file code
   - Include setup/teardown if needed

**Test File Naming:**

- Component: `component-name.test.tsx` (same directory as component)
- API Route: `route.test.ts` (same directory as route)

---

### `/do:commit` - Generate Commit Message

**Usage:** `/do:commit` (provide git diff output)

**Example:** `/do:commit` (then paste the output of `git diff --staged`)

**What it does:**
You are a Git commit message expert. Generate a **Conventional Commit** message based on staged changes.

**Workflow:**

1. **Analyze the Diff:** Read the git diff provided and understand what changed.
2. **Generate Commit Message:** Follow the Conventional Commits format:

   ```
   <type>(<scope>): <subject>

   <body>

   <footer>
   ```

   **Types:** feat, fix, docs, style, refactor, test, chore

   **Scope:** The feature/component affected (optional)

   **Subject:** Brief description (imperative mood, lowercase, no period)

   **Body:** More detailed explanation (optional)

   **Footer:** Breaking changes or issue references (optional)

3. **Output Format:** Provide the commit message in a code block, ready to copy.

**Example Output:**

```
feat(auth): add Google OAuth login button

- Implement GoogleLoginButton component
- Add /api/auth/google/callback endpoint
- Integrate with Supabase Auth

Closes #123
```

---

## 🔄 Refactoring Commands

### `/refactor:code` - Refactor Code Block

**Usage:** `/refactor:code` (then paste code)

**Example:** `/refactor:code` followed by the code block

**What it does:**
You are an expert Code Refactoring Specialist. Refactor the code to perfectly match project standards.

**THE GOLDEN RULE (MUST FOLLOW):**

1. **Read ALL Rulebooks:**
   - `contexts/typescript.md` (for type safety)
   - `contexts/nextjs.md` (for Server/Client component patterns)
   - `contexts/tailwind.md` (for v4 styling)
   - `contexts/api.md` (if it's an API route)
   - `contexts/structure_template.md` (for file organization)
   - `contexts/debugging.md` (for legacy code cleanup - remove old patterns, unused imports)
2. **Analyze the Code:** Identify what's wrong or could be improved.
3. **Refactor:** Rewrite the code to perfectly match the standards.
4. **Explain:** Provide a bullet-point list of what you changed and why.

**Output Format:**

1. **Original Issues Found:** (bullet list)
2. **Refactored Code:** (complete code block)
3. **Changes Made:** (bullet list of improvements)

---

### `/refactor:file` - Refactor Entire File

**Usage:** `/refactor:file "path/to/file"`

**Example:** `/refactor:file "src/app/login/page.tsx"`

**What it does:**
You are an expert Code Refactoring Specialist. Refactor an entire file to perfectly match project standards.

**THE GOLDEN RULE (MUST FOLLOW):**

1. **Read the File:** First, read the file at the specified path.
2. **Read ALL Rulebooks:**
   - `contexts/typescript.md` (for type safety)
   - `contexts/nextjs.md` (for Server/Client component patterns)
   - `contexts/tailwind.md` (for v4 styling)
   - `contexts/api.md` (if it's an API route)
   - `contexts/structure_template.md` (for file organization)
   - `contexts/debugging.md` (for legacy code cleanup - remove old patterns, unused imports)
3. **Analyze the File:** Identify what's wrong or could be improved.
4. **Refactor:** Rewrite the ENTIRE file to perfectly match the standards.
5. **Explain:** Provide a bullet-point list of what you changed and why.

**Output Format:**

1. **Original Issues Found:** (bullet list)
2. **Refactored File:** (complete file code)
3. **Changes Made:** (bullet list of improvements)
4. **File Location:** Confirm the file path is correct according to `structure_template.md`

---

## 🔍 Review Commands

### `/review:code` - Code Review

**Usage:** `/review:code` (then paste code or file path)

**Example:** `/review:code src/app/login/page.tsx`

**What it does:**
You are a Senior Code Reviewer. Review code for potential issues, bugs, and improvements.

**Workflow:**

1. **Read ALL Rulebooks:**
   - `contexts/typescript.md`
   - `contexts/nextjs.md`
   - `contexts/tailwind.md`
   - `contexts/api.md`
   - `contexts/structure_template.md`
   - `contexts/debugging.md` (check for legacy code, unused imports, backward compat cruft)
2. **Analyze the Code:** Look for:
   - Type safety issues
   - Server/Client component violations
   - Security vulnerabilities
   - Performance issues
   - Accessibility concerns
   - Standards violations
3. **Provide Feedback:** Format as:
   - ✅ **What's Good**
   - ⚠️ **Issues Found** (with severity: Critical, High, Medium, Low)
   - 💡 **Suggestions for Improvement**

**Do NOT rewrite the code.** Only provide review feedback.

---

### `/review:implementation` - Implementation Review

**Usage:** `/review:implementation "Description of completed work"`

**Example:** `/review:implementation "Step 3: User authentication system"`

**What it does:**
You are a Senior Code Reviewer with expertise in software architecture, design patterns, and best practices. Review completed project steps against original plans and ensure code quality standards are met.

**Review Process:**

1. **Plan Alignment Analysis:**

   - Compare implementation against original planning document or step description
   - Identify any deviations from planned approach, architecture, or requirements
   - Assess whether deviations are justified improvements or problematic departures
   - Verify that all planned functionality has been implemented

2. **Code Quality Assessment:**

   - Review code for adherence to established patterns and conventions
   - Check for proper error handling, type safety, and defensive programming
   - Evaluate code organization, naming conventions, and maintainability
   - Assess test coverage and quality of test implementations
   - Look for potential security vulnerabilities or performance issues

3. **Architecture and Design Review:**

   - Ensure implementation follows SOLID principles and established architectural patterns
   - Check for proper separation of concerns and loose coupling
   - Verify that code integrates well with existing systems
   - Assess scalability and extensibility considerations

4. **Documentation and Standards:**

   - Verify that code includes appropriate comments and documentation
   - Check that file headers, function documentation, and inline comments are present and accurate
   - Ensure adherence to project-specific coding standards and conventions
   - Review against all `contexts/*.md` files for standards compliance

5. **Issue Identification and Recommendations:**
   - Clearly identify any issues found with severity levels
   - Provide specific, actionable recommendations
   - Suggest refactoring opportunities where applicable

---

## 📖 Utility Commands

### `/explain` - Explain Technical Concepts

**Usage:** `/explain "Your question"`

**Example:** `/explain "How does the authentication flow work?"`

**What it does:**
You are a Technical Documentation Expert. Explain technical concepts clearly and thoroughly.

**Workflow:**

1. **Understand the Question:** Parse what's being asked.
2. **Read Relevant Files:**
   - If about a feature, read `docs/features/` files
   - If about code, read actual source files
   - Check `docs/source/srs.md` for business context
3. **Provide Explanation:** Include:
   - **Overview:** High-level explanation
   - **How It Works:** Step-by-step breakdown
   - **Code Examples:** If relevant
   - **Data Flow:** Diagrams (in ASCII or Mermaid)
   - **Related Files:** List of files involved

**Format:** Use clear markdown with headings, code blocks, and diagrams where helpful.

---

### `/brainstorm` - Brainstorm Ideas

**Usage:** `/brainstorm "Your rough idea"`

**Example:** `/brainstorm "I want to add real-time notifications"`

**What it does:**
You are a Design Thinking Expert specializing in collaborative brainstorming and design refinement. Help turn rough ideas into fully-formed designs through collaborative dialogue.

**The Process:**

**Understanding the idea:**

- Check out the current project state first (files, docs, recent commits)
- Ask questions one at a time to refine the idea
- Prefer multiple choice questions when possible, but open-ended is fine too
- Only one question per message - if a topic needs more exploration, break it into multiple questions
- Focus on understanding: purpose, constraints, success criteria

**Exploring approaches:**

- Propose 2-3 different approaches with trade-offs
- Present options conversationally with your recommendation and reasoning
- Lead with your recommended option and explain why

**Presenting the design:**

- Once you understand what you're building, present the design
- Break it into sections of 200-300 words
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify if something doesn't make sense

**After the Design:**

- Write the validated design to `docs/plans/YYYY-MM-DD-<topic>-design.md`
- Commit the design document to git

---

## 🐛 Debugging Commands

### `/debug:systematic` - Systematic Debugging

**Usage:** `/debug:systematic "Issue description"`

**Example:** `/debug:systematic "Test failing: user authentication returns 401"`

**What it does:**
You are a Systematic Debugging Expert. Use the four-phase systematic approach to find the root cause before proposing fixes.

**Core Principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

**When to Use:**
Use for ANY technical issue:

- Test failures
- Bugs in production
- Unexpected behavior
- Performance problems
- Build failures
- Integration issues

**Use this ESPECIALLY when:**

- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- Previous fix didn't work
- You don't fully understand the issue

**Process:** Follow the four-phase debugging methodology to systematically identify root cause, analyze patterns, test hypotheses, and only then implement solutions.

---

### `/debug:trace` - Root Cause Tracing

**Usage:** `/debug:trace "Error message or issue"`

**Example:** `/debug:trace "git init failed in /Users/bunsou/project/packages/core"`

**What it does:**
You are a Root Cause Investigation Expert. Trace bugs backward through the call stack to find the root cause.

**Core Principle:** Trace backward through the call chain until you find the original trigger, then fix at the source.

**When to Use:**

- Error happens deep in execution (not at entry point)
- Stack trace shows long call chain
- Unclear where invalid data originated
- Need to find which test/code triggers the problem

**The Tracing Process:**

1. **Observe the Symptom**

   - Note the exact error message and location

2. **Find Immediate Cause**

   - What code directly causes this?

3. **Ask: What Called This?**

   - Trace backward through the call stack
   - Identify each caller in the chain

4. **Find the Original Trigger**

   - Keep tracing until you reach the entry point

5. **Add Instrumentation**

   - Add logging at each level to confirm the flow
   - Track data values as they pass through

6. **Fix at the Source**
   - Fix where the problem originates, not where it manifests

---

## 📚 Context Files Reference

When executing commands, AI agents should reference these standard files:

### Core Standards

- `docs/source/srs.md` - Master plan and business requirements (Source of Truth)
- `contexts/structure_template.md` - File organization and project structure
- `contexts/typescript.md` - TypeScript standards and patterns
- `contexts/nextjs.md` - Next.js component patterns and best practices
- `contexts/api.md` - API route standards and validation
- `contexts/tailwind.md` - Tailwind v4 styling rules
- `contexts/database.md` - Database schema and query patterns
- `contexts/auth.md` - Authentication patterns
- `contexts/error-handling.md` - Error handling and logging
- `contexts/debugging.md` - Debugging, legacy cleanup, development phases

### Planning Documents

- `docs/prd/*.md` - Product Requirements Documents
- `docs/features/*.md` - Technical Feature Plans

---

## 🎯 Quick Tips for GitHub Copilot

1. **Reference this file:** "@COMMANDS.md show me the /do:component command"
2. **Use @workspace:** "@workspace /plan:feature for user profile"
3. **Combine commands:** "Use /review:code first, then /refactor:code"
4. **Chain workflows:** "Run /plan:feature, then /do:component, then /do:test"
5. **Reference context:** "Follow the /do:api-route command and read contexts/api.md"

---

**Pro Tip:** Bookmark this file and reference it anytime you need to execute a workflow command with your AI assistant!

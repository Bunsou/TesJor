# Changelog

All notable changes to the AI Agent NextJS Workflow.

## [2.8.0] - 2025-12-04

### 🐛 Debugging & Design Commands

#### Added

- **New `/brainstorm` Command** - Turns rough ideas into fully-formed designs through collaborative dialogue
  - Asks questions one at a time to refine ideas
  - Explores 2-3 alternative approaches with trade-offs
  - Presents design in sections (200-300 words) for incremental validation
  - Follows YAGNI principle (removes unnecessary features)
  - Saves validated designs to `docs/plans/YYYY-MM-DD-<topic>-design.md`
- **New `/review:implementation` Command** - Reviews completed project steps against plans

  - Validates implementation alignment with original design
  - Checks code quality, architecture, documentation
  - Categorizes issues as Critical/Important/Suggestions
  - Provides actionable recommendations with code examples
  - Identifies whether plan deviations are beneficial or problematic

- **New `/debug:systematic` Command** - Four-phase systematic debugging process

  - **Phase 1: Root Cause Investigation** - Gather evidence before proposing fixes (IRON LAW)
  - **Phase 2: Pattern Analysis** - Find working examples, compare differences
  - **Phase 3: Hypothesis Testing** - Test one hypothesis at a time minimally
  - **Phase 4: Implementation** - Create test, fix once, verify
  - Prevents random fixes and symptom patching
  - Stops after 3 failed fixes to question architecture

- **New `/debug:trace` Command** - Traces bugs backward through call stack
  - Finds original trigger instead of fixing where error appears
  - Adds instrumentation (console.error with stack traces) for evidence gathering
  - Traces data flow backward to find source of invalid values
  - Recommends fixing at source, not at symptom

#### Changed

- **Converted Context Files to Commands:**
  - `contexts/brainstorming.md` → `commands/brainstorm.toml`
  - `contexts/code-reviewer.md` → `commands/review/implementation.toml`
  - `contexts/systematic-debugging.md` → `commands/debug/systematic.toml`
  - `contexts/root-cause-tracing.md` → `commands/debug/trace.toml`

#### Updated Files

- `.agent/commands/brainstorm.toml` - New brainstorming command
- `.agent/commands/review/implementation.toml` - New implementation review command
- `.agent/commands/debug/systematic.toml` - New systematic debugging command
- `.agent/commands/debug/trace.toml` - New root cause tracing command
- `AGENT.md` - Added new commands to command set documentation
- `.agent-docs/CHANGELOG.md` - This file
- Deleted: `contexts/brainstorming.md`, `contexts/code-reviewer.md`, `contexts/systematic-debugging.md`, `contexts/root-cause-tracing.md`

#### Features Covered

- **Brainstorming Workflow:**

  - One question at a time (avoid overwhelming)
  - Multiple choice questions preferred
  - 2-3 alternative approaches with recommendations
  - Incremental validation (200-300 word sections)
  - YAGNI ruthlessly applied
  - Design documentation to `docs/plans/`

- **Implementation Review:**

  - Plan alignment analysis
  - Code quality assessment (error handling, type safety, naming)
  - Architecture review (SOLID principles, coupling)
  - Documentation and standards compliance
  - Issue categorization (Critical/Important/Suggestions)
  - Structured output format

- **Systematic Debugging:**

  - IRON LAW: No fixes without root cause investigation first
  - Four mandatory phases (cannot skip)
  - Multi-component system instrumentation
  - Red flags detection (guessing, multiple fixes, skipping tests)
  - Architecture questioning after 3 failed fixes
  - Integration with `/debug:trace` for deep stack errors

- **Root Cause Tracing:**
  - Backward call chain tracing
  - Stack trace instrumentation with `console.error()`
  - Data flow analysis (where invalid values originated)
  - Fix at source principle (never fix symptoms)
  - Evidence gathering before proposing solutions

#### Technical Details

- **Command Structure:** All four commands follow `.toml` format with embedded documentation
- **Integration:** `/debug:systematic` references `/debug:trace` for deep stack errors
- **Output Format:** Each command specifies structured output format for consistency
- **Phase Enforcement:** Systematic debugging enforces phase completion before proceeding

#### Rationale

Converting these specialized methodologies to commands provides:

1. **Easy Invocation:** Users can trigger specific debugging/design workflows with simple commands
2. **Consistent Process:** Embedded documentation ensures AI follows proven methodologies
3. **Better Organization:** Commands group by purpose (`/brainstorm`, `/review:*`, `/debug:*`)
4. **Workflow Integration:** Commands can reference each other (`/debug:systematic` → `/debug:trace`)
5. **Discoverability:** Commands listed in AGENT.md make workflows visible and accessible

#### Benefits

- **Reduced Debugging Time:** Systematic approach (15-30 min) vs random fixes (2-3 hours)
- **First-Time Fix Rate:** 95% vs 40% with guessing approach
- **Fewer New Bugs:** Near zero vs common with random fixes
- **Better Designs:** Incremental validation catches issues early
- **Quality Assurance:** Implementation review ensures standards compliance

#### Usage Examples

```bash
# Start brainstorming a new feature
/brainstorm "Add real-time notifications to dashboard"

# Review completed implementation
/review:implementation "Step 3: User authentication system"

# Debug with systematic process
/debug:systematic "Test failing: user login returns 401"

# Trace error to root cause
/debug:trace "git init failed in wrong directory"
```

---

## [2.7.0] - 2025-11-18

### 🚀 Performance & Coding Standards Integration

#### Added

- **TypeScript Standards Enhancements** (`contexts/typescript.md`):

  - **Section 2: Type vs Interface Preference** - Changed from "Default to type" to "Prefer interface for object shapes" with flexible rule
    - Interfaces for object shapes (better extension, clearer intent)
    - Types for unions, intersections, primitives
    - Added clear use cases and examples
    - Marked as flexible rule (not strict enforcement)
  - **Section 3: Naming Conventions Expansion** - Added auxiliary verb naming for booleans and directory naming standards
    - Boolean variables: Use auxiliary verbs (isLoading, hasError, canSubmit, shouldRender)
    - Directories: lowercase-with-dashes (kebab-case) for all folders
    - Removed "I" prefix recommendation for interfaces
    - Examples with ✅ GOOD and ❌ BAD patterns
  - **Section 6: Enums vs. Objects (NEW)** - Guidance on avoiding TypeScript enums
    - Avoid `enum` keyword (runtime overhead, bundling issues)
    - Use const objects with `as const` assertion for type safety
    - Use Maps for key-value associations
    - Complete code examples with type derivation
  - **Section 7: Function Declaration Style (NEW)** - Standardized function declaration patterns
    - Use `function` keyword for pure functions (better stack traces, hoisting)
    - Use arrow functions for callbacks, array methods, component props
    - Clear distinction between top-level functions and callback patterns

- **Next.js Performance Optimization** (`contexts/nextjs.md`):

  - **Section 5: Component File Structure (NEW)** - 5-part component organization pattern
    - 1. Component definition (main component)
    - 2. Sub-components (related child components)
    - 3. Helper functions (utilities specific to component)
    - 4. Static content (constants, configurations)
    - 5. Types (TypeScript interfaces/types)
    - Complete ProductCard example demonstrating pattern
  - **Section 6: Performance Optimization (NEW)** - Comprehensive performance patterns
    - **Server Components First Strategy**: Decision matrix for `'use client'` usage
    - **Minimize useEffect/useState**: Replace with Server Components + async/await
    - **Dynamic Imports**: Lazy-load non-critical components with `next/dynamic`
    - **Suspense Boundaries**: Prevent blocking page render with `<Suspense>`
    - Examples comparing BAD (Client Component with useEffect) vs GOOD (Server Component)
  - **Section 7: URL State Management (nuqs) (NEW)** - Recommended library for URL state
    - Type-safe URL state management with automatic browser history syncing
    - SSR-compatible with Next.js
    - Installation instructions and usage example
    - Marked as recommended (not mandatory) per user preference
  - **Section 8: Web Vitals Optimization (NEW)** - Core Web Vitals targets and strategies
    - **Target Metrics**: LCP < 2.5s, CLS < 0.1, FID < 100ms
    - **LCP Optimization**: next/image, preload critical resources, Server Components above-fold
    - **CLS Optimization**: Specify image dimensions, avoid content injection, skeleton loaders
    - **FID Optimization**: Minimize bundle size, Web Workers, defer non-critical JS
  - **Section 9: Syntax Best Practices (NEW)** - Code readability patterns
    - **Concise Conditionals**: `{isLoading && <Spinner />}` vs verbose ternaries
    - **Declarative JSX**: Use `.map()` instead of imperative loops
    - Examples with GOOD vs BAD/AVOID patterns

- **Structure Template Updates** (`contexts/structure_template.md`):
  - **Directory Naming Conventions (NEW)** - Enforced kebab-case for all directories
    - All directories: lowercase-with-dashes
    - Examples: auth-wizard/, user-profile/, product-list/, shopping-cart/
    - Rationale: Consistent URLs, cross-platform compatibility, avoid case-sensitivity issues
  - **Component Export Conventions (NEW)** - Prefer named exports over default
    - Named exports: Better IDE autocomplete, refactoring, usage tracking
    - Default exports acceptable for: Next.js page.tsx, layout.tsx, route.ts
    - Benefits: Clearer intention, no naming conflicts, better tooling support
    - Code examples showing import patterns

#### Changed

- **Updated `AGENT.md`:**
  - Enhanced typescript.md reference: "For TypeScript standards: prefer interfaces, avoid enums, use auxiliary verb naming"
  - Enhanced nextjs.md reference: "For Next.js component standards, **performance optimization**, Web Vitals, nuqs for URL state"
  - Emphasized performance optimization as key focus area

#### Updated Files

- `.agent/contexts/typescript.md` - Added 4 new sections/enhancements (2.1KB → 3.8KB)
- `.agent/contexts/nextjs.md` - Added 5 major sections (2.6KB → 7.4KB)
- `.agent/contexts/structure_template.md` - Added 2 new convention sections
- `AGENT.md` - Updated rules list with performance emphasis
- `.agent-docs/CHANGELOG.md` - This file

#### Features Covered

- **TypeScript Improvements:**

  - Flexible interface vs type preference (not strict enforcement)
  - Auxiliary verb naming convention for boolean clarity (isLoading vs loading, hasPermission vs permission)
  - Directory naming consistency (lowercase-with-dashes)
  - Enum avoidance patterns (const objects with `as const` + type derivation)
  - Function keyword vs arrow function guidelines (pure functions vs callbacks)

- **Next.js Performance:**

  - Component file structure standardization (5-part pattern)
  - Server Component first strategy with `'use client'` decision matrix
  - useEffect/useState minimization (prefer Server Components + async/await)
  - Dynamic imports for code splitting (reduce initial bundle by 20-40%)
  - Suspense boundaries for progressive rendering
  - URL state management with nuqs (recommended, not mandatory)
  - Core Web Vitals optimization (LCP, CLS, FID targets and strategies)
  - Syntax best practices (concise conditionals, declarative JSX)

- **Project Structure:**
  - Enforced kebab-case for all directories (consistent URLs, no case conflicts)
  - Named export preference (better IDE support, refactoring, tracking)
  - Clear exceptions for Next.js conventions (page/layout/route files)

#### Technical Details

- **TypeScript Changes:**

  - Interface preference is **flexible** (not strict) per user request
  - Enum avoidance reduces bundle size (~10-20% for large enums)
  - Function keyword improves stack traces for debugging
  - Auxiliary verb naming improves code readability (self-documenting booleans)

- **Performance Impact:**

  - Server Components reduce client bundle by 30-50% (no React hooks, no event handlers)
  - Dynamic imports reduce initial bundle by 20-40% (lazy-load heavy components)
  - Suspense boundaries improve perceived performance (progressive rendering)
  - Web Vitals targets align with Google Core Web Vitals thresholds

- **Developer Experience:**
  - Component file structure improves code navigation (consistent pattern)
  - Named exports improve IDE autocomplete and refactoring
  - nuqs library provides type-safe URL state (optional but recommended)
  - kebab-case directories prevent case-sensitivity issues across platforms

#### Rationale

This update integrates industry-standard Next.js performance patterns and coding conventions:

1. **Performance First**: Server Components by default, minimize client-side JavaScript
2. **Type Safety**: Prefer interfaces (better extension), avoid enums (bundle bloat)
3. **Code Clarity**: Auxiliary verb naming (self-documenting booleans), consistent file structure
4. **Web Standards**: Core Web Vitals optimization (LCP < 2.5s, CLS < 0.1, FID < 100ms)
5. **Developer Experience**: Named exports (better tooling), nuqs (type-safe URL state)
6. **Project Consistency**: Kebab-case directories (URL compatibility), 5-part file structure

#### Benefits

- **Bundle Size Reduction**: 20-40% smaller initial bundles (Server Components + dynamic imports)
- **Faster Load Times**: 30-50% faster time-to-interactive (minimize client JS, optimize LCP)
- **Better Code Quality**: Consistent patterns (5-part structure, auxiliary verbs, named exports)
- **Improved Maintainability**: Type-safe patterns (interfaces, const objects, nuqs)
- **Cross-Platform Compatibility**: Kebab-case directories (no case-sensitivity issues)
- **Enhanced Developer Experience**: Better IDE support (named exports, type inference)

#### Migration Guide

For existing projects:

1. **Review Updated Context Files:**

   - Read `contexts/typescript.md` (Sections 2, 3, 6, 7)
   - Read `contexts/nextjs.md` (Sections 5-9)
   - Read `contexts/structure_template.md` (Directory Naming, Export Conventions)

2. **Update TypeScript Code:**

   - Refactor `type` to `interface` for object shapes (flexible, not required)
   - Replace `enum` with const objects + `as const` assertion
   - Rename boolean variables with auxiliary verbs (`loading` → `isLoading`)
   - Use `function` keyword for pure utility functions

3. **Optimize Next.js Components:**

   - Audit `'use client'` usage (remove if hooks/events not needed)
   - Replace `useEffect` data fetching with Server Components + `async/await`
   - Add dynamic imports for heavy/non-critical components
   - Wrap Client Components in `<Suspense>` boundaries
   - Reorganize component files to follow 5-part structure

4. **Rename Directories:**

   - Rename PascalCase/camelCase directories to kebab-case
   - Examples: `AuthWizard/` → `auth-wizard/`, `userProfile/` → `user-profile/`

5. **Update Exports:**

   - Convert default exports to named exports (except Next.js conventions)
   - Update import statements accordingly

6. **Test Thoroughly:**

   - Run build to catch TypeScript errors
   - Test all pages/components after refactoring
   - Verify performance improvements with Lighthouse (LCP, CLS, FID metrics)

7. **Optional: Add nuqs for URL State:**
   - Install: `npm install nuqs`
   - Refactor useState URL state to useQueryState
   - Refer to Section 7 in `contexts/nextjs.md` for examples

---

## [2.6.0] - 2025-11-11

### 🎨 Brand Guide & Design System

#### Added

- **Comprehensive Brand Guide** (`contexts/brand-guide.md`):

  - Complete design system documentation as single source of truth
  - Prevents "CSS Chaos" by defining all visual design decisions upfront
  - Detailed specifications for colors, typography, spacing, and components

- **Color Palette with Example Values:**

  - **Primary**: oklch(59.69% 0.196 265.25) | #7C3AED (Vibrant Purple)
  - **Secondary**: oklch(79.31% 0.17 190.17) | #4ECDC4 (Bright Teal)
  - **Accent**: oklch(75% 0.15 200) | #5CDBF0 (Bright Cyan)
  - **Destructive**: oklch(55% 0.22 25) | #DC2626 (Bright Red)
  - **Muted**: oklch(95% 0.01 265) | #F5F5F7 (Light Gray)
  - All colors include foreground pairings with WCAG AA accessibility (4.5:1 contrast)
  - OKLCH color space for better perceptual uniformity
  - Hex equivalents provided for reference
  - Dark mode palette examples included

- **Typography System:**

  - Complete type scale (h1-h6, body, small, xs) with responsive sizing
  - Font: Inter Variable from Google Fonts
  - Font weights: 400 (Normal), 500 (Medium), 600 (Semibold), 700 (Bold)
  - Line heights optimized for readability
  - Letter spacing guidelines (tight, normal, wide)
  - Advanced OpenType feature settings for Inter
  - Monospace font: Fira Code for code blocks

- **Spacing & Layout System:**

  - 4px base unit with Tailwind's standard spacing scale
  - Complete spacing table (0-24: 0px-96px)
  - Usage guidelines for micro, component, layout, and hero spacing
  - Responsive spacing patterns
  - Container max-widths (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px)
  - 12-column grid system with responsive patterns

- **Border Radius Scale:**

  - sm: 0.25rem (4px), md: 0.5rem (8px), lg: 0.75rem (12px)
  - xl: 1rem (16px), 2xl: 1.5rem (24px), full: 9999px

- **Shadow System:**

  - Five elevation levels (sm, md, lg, xl, 2xl)
  - Usage guidelines for different component elevations
  - Box shadow values with opacity

- **Transitions & Animations:**

  - Duration tokens (fast: 150ms, normal: 200ms, slow: 300ms, slower: 500ms)
  - Easing functions (ease-in, ease-out, ease-in-out)
  - Common animation patterns

- **Z-Index Scale:**

  - Layering system from 0-80
  - Tokens for dropdown, sticky, fixed, modal, popover, toast, tooltip
  - Prevents z-index conflicts

- **Component Specifications:**

  - Button heights and padding (sm: 36px, default: 40px, lg: 44px)
  - Card padding variants (p-4, p-6, p-8)
  - Form input heights and spacing
  - Standardized component measurements

- **Implementation Guide:**

  - Complete `globals.css` example with all @theme variables
  - TypeScript constants file (`src/lib/design-tokens.ts`) template
  - Programmatic color and spacing access patterns
  - Tweakcn integration workflow (5-step color management process)

- **Quick Reference:**

  - Color token cheatsheet
  - Spacing scale reference
  - Typography scale reference
  - Font weight reference
  - Border radius reference

- **Best Practices:**
  - DO/DON'T guidelines for colors, spacing, typography
  - Accessibility standards enforcement
  - Maintenance procedures
  - Version control guidelines

#### Updated Files

- `.agent/contexts/brand-guide.md` - New comprehensive brand guide (11,000+ words)
- `AGENT.md` - Added brand-guide.md to rules list (before tailwind.md)
- `CHANGELOG.md` - This file

#### Features Covered

- **Design Token Categories:**

  - Colors (13 semantic tokens with foreground pairs)
  - Typography (type scale, weights, line heights, letter spacing)
  - Spacing (24-value scale from 0-96px)
  - Border radius (6 sizes + full)
  - Shadows (5 elevation levels)
  - Z-index (8 layering levels)
  - Transitions (4 durations, 3 easing functions)

- **Component Specifications:**

  - Button variants (3 sizes, padding standards)
  - Card variants (3 padding options)
  - Form elements (input heights, spacing)
  - Typography patterns (responsive headings, body text)

- **Implementation Tools:**
  - Complete CSS @theme block
  - TypeScript constants file template
  - Tweakcn integration guide
  - Color accessibility documentation

#### Technical Details

- **Color Format**: OKLCH with hex equivalents for compatibility
- **Base Unit**: 4px spacing system (Tailwind standard)
- **Font System**: Inter Variable font with OpenType features
- **Accessibility**: All colors meet WCAG AA (4.5:1 contrast minimum)
- **Responsive**: Mobile-first with 6 breakpoints (sm, md, lg, xl, 2xl, 3xl)

#### Rationale

The Brand Guide serves as the **single source of truth** for all visual design decisions:

1. **Prevents CSS Chaos**: All values defined before implementation
2. **Ensures Consistency**: Designers and developers reference same values
3. **Speeds Development**: No design decisions during coding
4. **Improves Maintenance**: Changes documented in one place
5. **Enables Collaboration**: Clear specifications for team members
6. **Supports Accessibility**: Contrast ratios and color usage documented

#### Migration Guide

For existing projects:

1. **Review Brand Guide**: Read `contexts/brand-guide.md` thoroughly
2. **Update globals.css**: Replace with complete @theme block from guide
3. **Create design-tokens.ts**: Add TypeScript constants file for programmatic access
4. **Audit Components**: Replace hardcoded values with semantic tokens
5. **Test Thoroughly**: Verify all components work with new values
6. **Document Changes**: Update CHANGELOG with design system version

---

## [2.5.0] - 2025-11-09

### 🎨 Tailwind CSS Enhancements

#### Added

- **Tweakcn Color Management Integration:**

  - Semantic color system with predefined tokens (primary, secondary, accent, destructive, muted)
  - Complete color variable structure in `globals.css @theme` block
  - Foreground color pairings for all semantic tokens
  - Integration guide for Tweakcn color theme generator (https://tweakcn.com)
  - Export workflow from Tweakcn to CSS variables

- **Lucide React Icons:**

  - Official icon library integration (tree-shakeable)
  - Consistent icon sizing standards (h-4 w-4, h-5 w-5, h-6 w-6)
  - Semantic color integration with icons
  - Usage patterns with Shadcn components
  - Installation: `pnpm add lucide-react`

- **Origin UI Components:**

  - Additional advanced UI patterns from originui-ng.com
  - Marketing page components (pricing, features, testimonials)
  - Complex animation patterns
  - Integration guidelines with Shadcn ecosystem

- **Custom Variants File** (`src/lib/styles.ts`):

  - Centralized component variant definitions using CVA
  - Pre-built variants: `buttonVariants`, `cardVariants`, `badgeVariants`, `textVariants`
  - `cn()` utility function (clsx + tailwind-merge)
  - TypeScript types for all variant props
  - Reusable styling patterns across the application

- **Semantic Color System:**
  - Mandatory use of semantic tokens instead of hardcoded values
  - Complete token list with foreground pairings
  - Dark mode support preparation
  - Consistent color usage patterns

#### Changed

- **Updated `contexts/tailwind.md`:**

  - Added Tweakcn color management section
  - Added Lucide React icon usage patterns
  - Added Origin UI integration guide
  - Replaced hardcoded OKLCH values with semantic tokens in all examples
  - Added custom variants file documentation (`src/lib/styles.ts`)
  - Enhanced responsive navigation example with icons
  - Enhanced form layout example with semantic colors and labels
  - Added comprehensive accessibility section with icon examples
  - Added project structure requirements (src/ directory enforcement)
  - Added installation and setup section
  - Added best practices summary (color usage, component patterns, structure, responsive)

- **Color Token Migration:**
  - Replaced `--color-brand-primary` → `--color-primary`
  - Replaced `--color-brand-secondary` → `--color-secondary`
  - Added accent, destructive, and muted color families
  - Added background, foreground, card, popover, border, input, ring tokens
  - All code examples now use semantic color classes

#### Updated Files

- `.agent/contexts/tailwind.md` - Complete rewrite with semantic colors, Tweakcn, Lucide, Origin UI, custom variants
- `CHANGELOG.md` - This file

#### Features Covered

- **Semantic Color Tokens:**

  - Primary (main brand color)
  - Secondary (supporting brand color)
  - Accent (highlights and CTAs)
  - Destructive (errors and danger states)
  - Muted (subtle backgrounds and text)
  - Background/Foreground (base colors)
  - Card, Popover (component-specific)
  - Border, Input, Ring (UI elements)

- **Custom Variants (`src/lib/styles.ts`):**

  - Button variants (default, secondary, accent, destructive, outline, ghost, link)
  - Card variants (default, outlined, elevated, muted)
  - Badge variants (default, secondary, destructive, outline, success, warning)
  - Text variants (color, size, weight options)
  - Size variants (sm, default, lg, icon)
  - Padding variants (none, sm, md, lg)

- **Lucide React Patterns:**
  - Icon-only buttons with proper aria-labels
  - Icons in navigation (mobile and desktop)
  - Icons in forms and inputs
  - Icons in alerts and feedback components
  - Responsive icon sizing
  - Semantic color integration

#### Technical Details

- **Required Packages:**
  - `lucide-react` - Icon library
  - `class-variance-authority` - Variant management (already included with Shadcn)
  - `clsx` and `tailwind-merge` - Class utility functions
- **Color Format**: OKLCH color space for better perceptual uniformity
- **Variant System**: CVA (class-variance-authority) for type-safe variants
- **Project Structure**: All code must be in `src/` directory
- **Icon Tree-Shaking**: Only imported Lucide icons are bundled

#### Migration Guide

1. **Update globals.css:**

   - Replace old color variables with semantic tokens
   - Add all foreground color pairings
   - Add border, input, ring tokens

2. **Create styles.ts:**

   - Create `src/lib/styles.ts` file
   - Copy variant definitions from documentation
   - Export cn() utility function

3. **Update Components:**

   - Replace hardcoded colors (`bg-blue-500`) with semantic tokens (`bg-primary`)
   - Replace color variables (`bg-brand-primary`) with semantic tokens (`bg-primary`)
   - Add Lucide icons where applicable
   - Use custom variants from `src/lib/styles.ts`

4. **Install Dependencies:**

   ```bash
   pnpm add lucide-react
   ```

5. **Design Color Scheme:**
   - Visit https://tweakcn.com
   - Design your color palette
   - Export CSS variables
   - Paste into globals.css @theme block

---

## [2.4.0] - 2025-11-09

### 🚨 Error Handling & Logging

#### Added

- **Comprehensive Error Handling System:**
  - Added `contexts/error-handling.md` - Complete error handling standards
  - Centralized error code mapping with `ERROR_MAP`
  - Custom `AppError` class with type-safe error codes
  - Winston logger integration with dual log files (error.log & combined.log)
  - Standardized API response format (`{ status, message, data/code }`)
  - Next.js Error Boundaries (error.tsx & global-error.tsx)
  - Client-side error handling patterns
  - Middleware error handling examples
  - Service layer error patterns

#### Features Covered

- **Error Handler** (`src/server/utils/error-handler.ts`):
  - 20+ predefined error codes (400, 401, 403, 404, 409, 429, 500)
  - Type-safe `AppErrorCode` for compile-time checking
  - Custom error messages with override capability
- **Winston Logger** (`src/server/utils/logger.ts`):
  - Console logging with colors (development)
  - `error.log` - Error-only logs for quick debugging
  - `combined.log` - All logs for full context
  - JSON format for production (parseable)
  - Automatic log rotation (5MB per file, keep 5 files)
- **API Response** (`src/server/utils/api-response.ts`):
  - Success: `{ status: "success", message, data }`
  - Error: `{ status: "error", message, code }`
  - Automatic Zod validation error handling
  - Environment-aware error messages (dev vs prod)
- **Error Boundaries**:
  - Route-level `error.tsx` for React errors
  - Root-level `global-error.tsx` for critical errors
  - Custom `ErrorBoundary` component for specific sections
- **Best Practices**:
  - When to use each error code
  - Logging strategies (info, warn, error, debug)
  - Error re-throwing patterns
  - Context inclusion guidelines

#### Updated Files

- `.agent/contexts/error-handling.md` - New error handling context file
- `AGENT.md` - Added error-handling.md to rules list
- `CHANGELOG.md` - This file

#### Technical Details

- **Package Required**: `winston` (pnpm add winston)
- **Error Format**: Centralized `ERROR_MAP` with statusCode and message
- **Logging Strategy**: Dual files (error.log for debugging, combined.log for context)
- **Type Safety**: Full TypeScript support with `AppErrorCode` type
- **Production Ready**: Environment-aware error messages and logging

---

## [2.3.0] - 2025-11-09

### 🎨 Inter Font Integration

#### Added

- **Inter Font from Google Fonts** via `next/font/google`
  - Automatic font optimization and self-hosting
  - Zero layout shift with automatic size adjustment
  - No external network requests (better privacy & performance)
  - Variable font for optimal file size

#### Changed

- **Font Configuration**: Updated from direct CSS to next/font/google pattern
  - Layout.tsx: Import Inter and apply to html/body
  - globals.css: Use CSS variable `var(--font-inter)`

#### Updated Files

- `.agent/contexts/tailwind.md` - Added Inter font setup section
- `.agent/contexts/structure_template.md` - Added layout.tsx example with Inter
- `.agent-docs/SETUP.md` - Enhanced Step 5 with font configuration
- `.agent-docs/PROJECT_CHECKLIST.md` - Updated Step 11 with font setup
- `CHANGELOG.md` - This file

---

## [2.2.0] - 2025-11-08

### 🔐 Authentication Integration

#### Added

- **BetterAuth Integration:**

  - Added `contexts/auth.md` - Comprehensive BetterAuth authentication standards
  - Email/Password authentication patterns and best practices
  - Google OAuth integration guide
  - Session management (client-side and server-side)
  - Middleware patterns for route protection
  - Type-safe authentication with TypeScript
  - Security best practices and error handling
  - Common use cases and troubleshooting guide

- **Updated Files:**
  - `.agent/contexts/auth.md` - New authentication context file
  - `AGENT.md` - Added BetterAuth to tech stack and rules
  - `CHANGELOG.md` - This file

#### Features Covered

- Email/Password registration and sign-in
- Google OAuth social sign-on
- Session management with hooks and server-side access
- Protected routes with middleware
- Server actions and RSC integration
- Type inference and error handling
- Plugin ecosystem (2FA, magic link, passkey)

#### Rationale

BetterAuth provides:

- Framework-agnostic, type-safe authentication
- Built-in support for email/password and social providers
- Automatic database schema management
- Comprehensive plugin ecosystem
- Better developer experience with full TypeScript support
- Next.js-specific optimizations and helpers

---

## [2.3.0] - 2025-01-XX

### Added

- **Inter Font Integration**: Default typography now uses Inter font from Google Fonts via `next/font/google`
  - Automatic font optimization and self-hosting by Next.js
  - Zero layout shift with automatic size adjustment
  - No external network requests for better privacy and performance
  - Variable font implementation for optimal file size
  - Advanced font features enabled (cv02, cv03, cv04, cv11)

### Changed

- **Font Configuration**: Updated from direct CSS string to next/font/google with CSS variable pattern
- **Documentation**: Updated all relevant docs with Inter font setup instructions
  - `.agent/contexts/tailwind.md` - Added comprehensive Inter font setup section
  - `.agent/contexts/structure_template.md` - Added root layout example with Inter font
  - `.agent-docs/SETUP.md` - Enhanced Step 5 with Inter font configuration
  - `.agent-docs/PROJECT_CHECKLIST.md` - Updated Step 11 with detailed Inter font setup

### Technical Details

- Font import: `import { Inter } from "next/font/google"`
- Configuration: `Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })`
- CSS variable: `--font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif`
- Layout application: `<html className={inter.variable}>` + `<body className={inter.className}>`

---

## [2.2.0] - 2025-01-XX

### 🔄 Database Migration

#### Changed

- **Migrated from Prisma to Drizzle ORM:**

  - Updated `database.md` with complete Drizzle ORM patterns and standards
  - Replaced Prisma Client with Drizzle postgres-js client
  - Updated schema location from `prisma/schema.prisma` to `src/server/db/schema.ts`
  - Changed migration commands from `prisma migrate` to `drizzle-kit generate/push`
  - Updated all code examples to use Drizzle query API (`db.query`, `eq()`, etc.)
  - Replaced Prisma Studio with Drizzle Studio
  - Updated folder structure from `prisma/` to `drizzle/` for migrations

- **Updated Files:**
  - `.agent/contexts/database.md` - Complete rewrite with Drizzle patterns
  - `.agent/contexts/structure_template.md` - Updated folder structure and examples
  - `.agent/commands/do/db.toml` - Updated workflow for Drizzle
  - `AGENT.md` - Tech stack reference updated
  - `SETUP.md` - Installation and setup instructions
  - `README.md` - Project structure and references
  - `QUICK_REFERENCE.md` - Documentation links
  - `SRS_TEMPLATE.md` - Tech stack template
  - `CHANGELOG.md` - This file

#### Rationale

Drizzle ORM offers:

- Better TypeScript support with fully inferred types
- SQL-like query builder for more control
- Lighter weight with less abstraction
- Faster performance
- More flexible schema definitions
- Better support for modern Next.js patterns

## [2.0.0] - 2025-11-08

### 🎉 Major Updates

#### Added

- **New Commands:**

  - `/do:commit` - Generate Conventional Commit messages
  - `/do:test` - Generate comprehensive tests
  - `/do:db` - Design database schemas and queries
  - `/refactor:code` - Refactor code blocks
  - `/refactor:file` - Refactor entire files
  - `/review:code` - Code review and feedback
  - `/explain` - Technical documentation and explanations

- **New Context Files:**

  - `contexts/database.md` - Database and Drizzle ORM standards

- **New Documentation:**
  - `README.md` - Complete project overview
  - `QUICK_REFERENCE.md` - Command cheat sheet
  - `SETUP.md` - Environment setup guide
  - `SRS_TEMPLATE.md` - Example master plan template
  - `CHANGELOG.md` - This file

#### Changed

- **Updated `structure_template.md`:**

  - Converted from frontend-only to full-stack template
  - Added backend API structure (`src/app/api/`)
  - Added server-side code structure (`src/server/`)
  - Integrated Drizzle ORM structure
  - Updated for Tailwind v4 (removed `tailwind.config.js`)

- **Updated `AGENT.md`:**
  - Added new commands to command list
  - Added `database.md` to rulebook references

### 🔧 Improvements

#### Workflow Enhancements

- Better separation of planning, execution, review, and documentation phases
- Complete test coverage workflow with `/do:test`
- Database-first development support with `/do:db`
- Code quality improvements with `/review:code` and `/refactor:*`

#### Documentation

- Comprehensive README with examples and best practices
- Quick reference guide for fast command lookup
- Complete setup guide from scratch
- SRS template to kickstart projects

#### Standards

- Added database query patterns and type safety rules
- Improved error handling patterns
- Transaction handling guidelines
- Database seeding standards

## [1.0.0] - Initial Release

### Added

- Core workflow structure
- Planning commands (`/plan:prd`, `/plan:feature`)
- Basic execution commands (`/do:component`, `/do:api-route`)
- Refactoring commands (`/refactor:code`, `/refactor:file`)
- Context files:
  - `typescript.md` - TypeScript standards
  - `nextjs.md` - Next.js patterns
  - `api.md` - API route standards
  - `tailwind.md` - Tailwind v4 CSS-first approach
  - `structure_template.md` - Frontend structure (v1)
- Master AI prompt (`AGENT.md`)

---

## Future Considerations

### Planned Features

- [ ] `/do:migration` - Generate database migrations
- [ ] `/do:seed` - Generate database seed scripts
- [ ] `/review:security` - Security-focused code review
- [ ] `/review:performance` - Performance analysis
- [ ] `/do:e2e-test` - Generate E2E tests (Playwright)
- [ ] `/optimize:bundle` - Bundle size analysis and optimization
- [ ] `/do:docs` - Generate inline documentation

### Potential Improvements

- [ ] Add CI/CD pipeline templates
- [ ] Add Docker configuration templates
- [ ] Add monitoring and logging standards
- [ ] Add error tracking setup (Sentry integration)
- [ ] Add analytics setup (PostHog, Google Analytics)
- [ ] Add i18n (internationalization) standards
- [ ] Add mobile-responsive standards
- [ ] Add SEO optimization standards

### Context File Additions

- [ ] `contexts/testing.md` - Testing standards and patterns
- [ ] `contexts/security.md` - Security best practices
- [ ] `contexts/performance.md` - Performance optimization rules
- [ ] `contexts/accessibility.md` - WCAG compliance standards
- [ ] `contexts/deployment.md` - Deployment and DevOps standards

---

## Version History

| Version | Date       | Major Changes                                        |
| ------- | ---------- | ---------------------------------------------------- |
| 2.0.0   | 2025-11-08 | Full-stack support, new commands, comprehensive docs |
| 1.0.0   | [Previous] | Initial frontend-focused workflow                    |

---

## Migration Guide

### From v1.0.0 to v2.0.0

#### 1. Update Context Files

```bash
# Backup your old contexts
cp -r .agent/contexts .agent/contexts.backup

# Copy new context files
# - Add database.md
# - Update structure_template.md
```

#### 2. Add New Commands

```bash
# New command directories to create:
mkdir -p .agent/commands/review
```

#### 3. Update Existing Files

- Update `AGENT.md` with new commands
- Add `database.md` reference to command prompts

#### 4. No Breaking Changes

- All v1.0.0 commands still work
- Existing code patterns remain valid
- Gradual adoption of new features

---

## Contributing

To suggest improvements or report issues:

1. Document the proposed change
2. Update relevant context files
3. Add examples of the new pattern
4. Update this CHANGELOG

## License

MIT License

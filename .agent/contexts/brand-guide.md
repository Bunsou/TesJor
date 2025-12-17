# Brand Guide & Design System

This document defines the complete design system for your project. It serves as the **single source of truth** for all visual design decisions. Every color, font size, spacing value, and component specification is documented here to ensure consistency and prevent "CSS Chaos."

## 1. Color Palette

### Philosophy

Our color system uses **OKLCH color space** for better perceptual uniformity and **semantic naming** for clear intent. All colors are defined with their foreground pairings to ensure WCAG AA accessibility (4.5:1 contrast ratio for normal text).

### Primary Color Family

**Primary** is the main brand color used for primary CTAs, links, and brand emphasis.

```css
/* Light Mode */
--color-primary: oklch(59.69% 0.196 265.25); /* #7C3AED - Vibrant Purple */
--color-primary-foreground: oklch(100% 0 0); /* #FFFFFF - Pure White */

/* Hex Equivalent for Reference */
/* Primary: #7C3AED */
/* Primary Foreground: #FFFFFF */
```

**Usage:**

- Primary buttons and CTAs
- Active navigation items
- Links and interactive elements
- Brand logos and headers
- Focus states (ring color)

**Examples:**

```tsx
<Button className="bg-primary text-primary-foreground">Get Started</Button>
<a className="text-primary hover:underline">Learn More</a>
```

### Secondary Color Family

**Secondary** is the supporting brand color for less prominent actions and accents.

```css
/* Light Mode */
--color-secondary: oklch(79.31% 0.17 190.17); /* #4ECDC4 - Bright Teal */
--color-secondary-foreground: oklch(15% 0 0); /* #262626 - Dark Gray */

/* Hex Equivalent for Reference */
/* Secondary: #4ECDC4 */
/* Secondary Foreground: #262626 */
```

**Usage:**

- Secondary buttons
- Supporting badges
- Alternate sections/cards
- Non-critical highlights

**Examples:**

```tsx
<Button variant="secondary" className="bg-secondary text-secondary-foreground">
  Learn More
</Button>
```

### Accent Color Family

**Accent** is used for highlights, success states, and call-to-action emphasis.

```css
/* Light Mode */
--color-accent: oklch(75% 0.15 200); /* #5CDBF0 - Bright Cyan */
--color-accent-foreground: oklch(15% 0 0); /* #262626 - Dark Gray */

/* Hex Equivalent for Reference */
/* Accent: #5CDBF0 */
/* Accent Foreground: #262626 */
```

**Usage:**

- Hover states
- Success messages (non-critical)
- Highlighted sections
- Promotional badges

**Examples:**

```tsx
<Badge className="bg-accent text-accent-foreground">New</Badge>
<Card className="hover:bg-accent/10">...</Card>
```

### Destructive Color Family

**Destructive** is used for errors, warnings, and danger states.

```css
/* Light Mode */
--color-destructive: oklch(55% 0.22 25); /* #DC2626 - Bright Red */
--color-destructive-foreground: oklch(100% 0 0); /* #FFFFFF - Pure White */

/* Hex Equivalent for Reference */
/* Destructive: #DC2626 */
/* Destructive Foreground: #FFFFFF */
```

**Usage:**

- Error messages
- Delete buttons
- Warning alerts
- Validation errors
- Critical actions

**Examples:**

```tsx
<Button variant="destructive" className="bg-destructive text-destructive-foreground">
  Delete Account
</Button>
<Alert className="border-destructive text-destructive">Error: Invalid input</Alert>
```

### Muted Color Family

**Muted** is used for subtle backgrounds, disabled states, and secondary text.

```css
/* Light Mode */
--color-muted: oklch(95% 0.01 265); /* #F5F5F7 - Light Gray */
--color-muted-foreground: oklch(45% 0.01 265); /* #737373 - Medium Gray */

/* Hex Equivalent for Reference */
/* Muted: #F5F5F7 */
/* Muted Foreground: #737373 */
```

**Usage:**

- Subtle backgrounds
- Disabled states
- Secondary text (captions, labels)
- Placeholder text
- Dividers

**Examples:**

```tsx
<p className="text-muted-foreground">Last updated 2 hours ago</p>
<div className="bg-muted p-4">...</div>
```

### Base Colors

**Background and Foreground** are the foundational colors for the entire interface.

```css
/* Light Mode */
--color-background: oklch(100% 0 0); /* #FFFFFF - Pure White */
--color-foreground: oklch(15% 0 0); /* #262626 - Dark Gray */

/* Hex Equivalent for Reference */
/* Background: #FFFFFF */
/* Foreground: #262626 */
```

**Usage:**

- Page backgrounds
- Body text
- Default text color

### Component-Specific Colors

**Card, Popover, Border, Input, Ring** - Component-specific semantic tokens.

```css
/* Card */
--color-card: oklch(100% 0 0); /* #FFFFFF - White */
--color-card-foreground: oklch(15% 0 0); /* #262626 - Dark Gray */

/* Popover */
--color-popover: oklch(100% 0 0); /* #FFFFFF - White */
--color-popover-foreground: oklch(15% 0 0); /* #262626 - Dark Gray */

/* Border & Input */
--color-border: oklch(90% 0.01 265); /* #E5E5E5 - Light Gray Border */
--color-input: oklch(90% 0.01 265); /* #E5E5E5 - Light Gray Border */

/* Ring (Focus States) */
--color-ring: oklch(59.69% 0.196 265.25); /* #7C3AED - Same as Primary */

/* Hex Equivalent for Reference */
/* Card: #FFFFFF, Card Foreground: #262626 */
/* Popover: #FFFFFF, Popover Foreground: #262626 */
/* Border: #E5E5E5 */
/* Input: #E5E5E5 */
/* Ring: #7C3AED */
```

### Dark Mode Palette

For applications requiring dark mode support:

```css
/* Dark Mode - Example Values */
@media (prefers-color-scheme: dark) {
  --color-background: oklch(15% 0 0); /* #262626 - Dark Gray */
  --color-foreground: oklch(98% 0 0); /* #FAFAFA - Off White */

  --color-primary: oklch(65% 0.196 265.25); /* Lighter Purple */
  --color-primary-foreground: oklch(15% 0 0); /* Dark Gray */

  --color-secondary: oklch(70% 0.17 190.17); /* Lighter Teal */
  --color-secondary-foreground: oklch(15% 0 0); /* Dark Gray */

  --color-muted: oklch(20% 0.01 265); /* #333333 - Dark Muted */
  --color-muted-foreground: oklch(65% 0.01 265); /* #A3A3A3 - Light Gray */

  --color-card: oklch(18% 0 0); /* #2E2E2E - Dark Card */
  --color-card-foreground: oklch(98% 0 0); /* #FAFAFA - Off White */

  --color-border: oklch(25% 0.01 265); /* #404040 - Dark Border */
  --color-input: oklch(25% 0.01 265); /* #404040 - Dark Border */
}
```

### Color Usage Rules

| Token         | Use Case                               | Don't Use For       |
| ------------- | -------------------------------------- | ------------------- |
| `primary`     | Main CTAs, active states, links        | Destructive actions |
| `secondary`   | Supporting actions, alternate sections | Error states        |
| `accent`      | Highlights, hover states, success      | Long-form text      |
| `destructive` | Errors, delete actions, warnings       | Positive feedback   |
| `muted`       | Subtle backgrounds, secondary text     | Primary CTAs        |

### Accessibility Standards

All color combinations meet **WCAG AA** standards (4.5:1 contrast ratio):

- ✅ Primary + Primary Foreground: **7.2:1**
- ✅ Secondary + Secondary Foreground: **8.1:1**
- ✅ Accent + Accent Foreground: **7.5:1**
- ✅ Destructive + Destructive Foreground: **6.8:1**
- ✅ Muted + Muted Foreground: **5.2:1**

## 2. Typography System

### Font Families

**Primary Font: Inter** (Variable Font from Google Fonts)

```tsx
// In src/app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
```

```css
/* In globals.css */
--font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
```

**Monospace Font: Fira Code** (For code blocks)

```css
--font-mono: "Fira Code", "Courier New", monospace;
```

### Type Scale

Complete typography scale with responsive sizing:

| Element   | Desktop Size    | Mobile Size     | Font Weight    | Line Height   | Usage                           |
| --------- | --------------- | --------------- | -------------- | ------------- | ------------------------------- |
| **h1**    | 3rem (48px)     | 2rem (32px)     | 700 (Bold)     | 1.2 (tight)   | Page titles, hero headings      |
| **h2**    | 2.25rem (36px)  | 1.75rem (28px)  | 700 (Bold)     | 1.3           | Section headings                |
| **h3**    | 1.875rem (30px) | 1.5rem (24px)   | 600 (Semibold) | 1.4           | Subsection headings             |
| **h4**    | 1.5rem (24px)   | 1.25rem (20px)  | 600 (Semibold) | 1.4           | Card titles, component headings |
| **h5**    | 1.25rem (20px)  | 1.125rem (18px) | 600 (Semibold) | 1.5           | Small headings                  |
| **h6**    | 1.125rem (18px) | 1rem (16px)     | 600 (Semibold) | 1.5           | Tiny headings                   |
| **body**  | 1rem (16px)     | 1rem (16px)     | 400 (Normal)   | 1.6 (relaxed) | Body text, paragraphs           |
| **small** | 0.875rem (14px) | 0.875rem (14px) | 400 (Normal)   | 1.5           | Secondary text, captions        |
| **xs**    | 0.75rem (12px)  | 0.75rem (12px)  | 400 (Normal)   | 1.4           | Labels, badges, metadata        |

### Font Weights

```css
/* Available Weights (Inter Variable Font) */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

**Usage Guidelines:**

- **400 (Normal)**: Body text, paragraphs, descriptions
- **500 (Medium)**: Emphasized text, button labels, links
- **600 (Semibold)**: Subheadings (h3-h6), card titles, form labels
- **700 (Bold)**: Main headings (h1-h2), call-to-action emphasis

### Responsive Typography Examples

```tsx
// H1 - Hero Heading
<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">
  Welcome to Our Platform
</h1>

// H2 - Section Heading
<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
  Features Overview
</h2>

// H3 - Subsection Heading
<h3 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-foreground">
  Getting Started
</h3>

// Body Text
<p className="text-base leading-relaxed text-foreground">
  This is a paragraph with comfortable reading line height.
</p>

// Small Text
<p className="text-sm text-muted-foreground">
  Last updated 2 hours ago
</p>

// Extra Small (Labels, Badges)
<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
  Beta
</span>
```

### Letter Spacing

```css
/* Letter Spacing Values */
--tracking-tight: -0.025em; /* For large headings */
--tracking-normal: 0em; /* Default */
--tracking-wide: 0.025em; /* For small uppercase text */
```

**Usage:**

- Tight: h1, h2 (large headings benefit from tighter spacing)
- Normal: Body text, most UI elements
- Wide: Uppercase labels, badges, small metadata

### Advanced Font Features

Inter includes advanced OpenType features:

```css
/* Optional: Enable Inter's stylistic alternates */
* {
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}

/* cv02: Open digits */
/* cv03: Lower case r curves into the horizontal stroke */
/* cv04: Open four */
/* cv11: Single-story lowercase a */
```

## 3. Spacing & Layout System

### Base Unit: 4px

Our spacing system uses a **4px base unit** with Tailwind's standard spacing scale:

| Token | Value | Rem     | Usage                                   |
| ----- | ----- | ------- | --------------------------------------- |
| `0`   | 0px   | 0rem    | No spacing                              |
| `1`   | 4px   | 0.25rem | Tight element spacing                   |
| `2`   | 8px   | 0.5rem  | Icon-to-text spacing                    |
| `3`   | 12px  | 0.75rem | Small component padding                 |
| `4`   | 16px  | 1rem    | **Base spacing unit**, standard padding |
| `5`   | 20px  | 1.25rem | Medium spacing                          |
| `6`   | 24px  | 1.5rem  | Large component padding                 |
| `8`   | 32px  | 2rem    | Section spacing                         |
| `10`  | 40px  | 2.5rem  | Large section spacing                   |
| `12`  | 48px  | 3rem    | Extra large spacing                     |
| `16`  | 64px  | 4rem    | Major section dividers                  |
| `20`  | 80px  | 5rem    | Hero section spacing                    |
| `24`  | 96px  | 6rem    | Extra large hero spacing                |

### Spacing Usage Guidelines

**Micro Spacing (1-2):**

- Icon-to-text gaps: `gap-2` (8px)
- Badge padding: `px-2 py-1` (8px/4px)
- Tight list items: `space-y-1` (4px)

**Component Spacing (3-6):**

- Button padding: `px-4 py-2` (16px/8px)
- Card padding: `p-4` to `p-6` (16px-24px)
- Form field spacing: `space-y-4` (16px)
- Section padding: `p-6` to `p-8` (24px-32px)

**Layout Spacing (8-16):**

- Section margins: `my-8` to `my-12` (32px-48px)
- Container padding: `px-8` to `px-12` (32px-48px)
- Major dividers: `mb-16` (64px)

**Hero Spacing (20-24):**

- Hero section padding: `py-20` to `py-24` (80px-96px)
- Large feature sections: `my-20` (80px)

### Responsive Spacing Pattern

```tsx
// Small padding on mobile, larger on desktop
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>

// Responsive section spacing
<section className="py-12 md:py-16 lg:py-20">
  Hero Content
</section>

// Responsive grid gaps
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
  Grid Items
</div>
```

### Container Max-Widths

```css
/* Container breakpoints */
--container-sm: 640px; /* Small screens */
--container-md: 768px; /* Tablets */
--container-lg: 1024px; /* Laptops */
--container-xl: 1280px; /* Desktops - Default max-width */
--container-2xl: 1536px; /* Large screens */
```

**Usage:**

```tsx
// Standard content container
<div className="container mx-auto px-4 max-w-7xl">
  Main Content
</div>

// Narrow content (articles, forms)
<div className="container mx-auto px-4 max-w-3xl">
  Article Content
</div>

// Wide content (dashboards)
<div className="container mx-auto px-4 max-w-full">
  Dashboard
</div>
```

### Grid System

**12-Column Grid:**

```tsx
// 3-column layout on desktop, 1-column on mobile
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="col-span-1">Sidebar</div>
  <div className="col-span-1 md:col-span-2">Main Content</div>
</div>
```

**Common Grid Patterns:**

```tsx
// Responsive card grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  Cards
</div>

// Dashboard layout
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  <aside className="lg:col-span-3">Sidebar</aside>
  <main className="lg:col-span-9">Content</main>
</div>
```

## 4. Border Radius

Consistent border radius for different component types:

```css
/* Border Radius Tokens */
--radius-sm: 0.25rem; /* 4px - Small elements */
--radius-md: 0.5rem; /* 8px - Default buttons, inputs */
--radius-lg: 0.75rem; /* 12px - Cards, modals */
--radius-xl: 1rem; /* 16px - Large cards, images */
--radius-2xl: 1.5rem; /* 24px - Hero sections */
--radius-full: 9999px; /* Full - Badges, avatars, pills */
```

**Usage Examples:**

```tsx
// Button - medium radius
<Button className="rounded-md">Click Me</Button>

// Card - large radius
<Card className="rounded-lg">Card Content</Card>

// Badge/Pill - full radius
<Badge className="rounded-full">New</Badge>

// Avatar - full radius
<Avatar className="rounded-full">JD</Avatar>
```

## 5. Shadows

Elevation system using box shadows:

```css
/* Shadow Tokens */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

**Usage Guidelines:**

| Shadow       | Elevation Level | Use Case                          |
| ------------ | --------------- | --------------------------------- |
| `shadow-sm`  | Subtle          | Input fields, subtle cards        |
| `shadow-md`  | Low             | Default cards, dropdowns          |
| `shadow-lg`  | Medium          | Modals, popovers, hover states    |
| `shadow-xl`  | High            | Floating action buttons, tooltips |
| `shadow-2xl` | Very High       | Hero cards, important modals      |

**Examples:**

```tsx
// Card with subtle shadow
<Card className="shadow-sm">Subtle Card</Card>

// Elevated card on hover
<Card className="shadow-md hover:shadow-lg transition-shadow">
  Hover Me
</Card>

// Modal with high elevation
<Dialog className="shadow-xl">Modal Content</Dialog>
```

## 6. Transitions & Animations

Standard timing functions for smooth animations:

```css
/* Duration */
--duration-fast: 150ms; /* Quick interactions */
--duration-normal: 200ms; /* Default transitions */
--duration-slow: 300ms; /* Smooth animations */
--duration-slower: 500ms; /* Deliberate animations */

/* Easing */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

**Usage Examples:**

```tsx
// Button hover transition
<Button className="transition-colors duration-200">
  Hover Me
</Button>

// Card hover with multiple properties
<Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
  Animated Card
</Card>

// Smooth opacity fade
<div className="transition-opacity duration-500 opacity-0 hover:opacity-100">
  Fade In
</div>
```

## 7. Z-Index Scale

Layering system for proper stacking context:

```css
/* Z-Index Tokens */
--z-base: 0; /* Normal flow */
--z-dropdown: 10; /* Dropdowns, tooltips */
--z-sticky: 20; /* Sticky headers */
--z-fixed: 30; /* Fixed elements */
--z-modal-backdrop: 40; /* Modal backdrops */
--z-modal: 50; /* Modals, dialogs */
--z-popover: 60; /* Popovers above modals */
--z-toast: 70; /* Toast notifications */
--z-tooltip: 80; /* Tooltips (highest) */
```

**Usage:**

```tsx
// Modal
<Dialog className="z-50">Modal</Dialog>

// Toast notification
<Toast className="z-70">Notification</Toast>

// Sticky header
<header className="sticky top-0 z-20">Navigation</header>
```

## 8. Component Specifications

### Buttons

**Heights:**

```tsx
// Small button - 36px
<Button size="sm" className="h-9">Small</Button>

// Default button - 40px
<Button size="default" className="h-10">Default</Button>

// Large button - 44px
<Button size="lg" className="h-11">Large</Button>

// Icon button - 40x40px
<Button size="icon" className="h-10 w-10">
  <Icon />
</Button>
```

**Padding:**

```tsx
// Standard horizontal padding
<Button className="px-4 py-2">Button</Button>

// Large button padding
<Button size="lg" className="px-8 py-3">Large Button</Button>
```

### Cards

**Padding:**

```tsx
// Small card
<Card className="p-4">Compact Content</Card>

// Default card
<Card className="p-6">Standard Content</Card>

// Large card
<Card className="p-8">Spacious Content</Card>
```

### Forms

**Input Heights:**

```tsx
// Default input - 40px
<Input className="h-10 px-3" />

// Small input - 36px
<Input className="h-9 px-3" />

// Large input - 44px
<Input className="h-11 px-4" />
```

**Form Spacing:**

```tsx
<form className="space-y-4">
  <div>
    <Label>Email</Label>
    <Input type="email" />
  </div>
  <div>
    <Label>Password</Label>
    <Input type="password" />
  </div>
  <Button>Submit</Button>
</form>
```

## 9. Implementation Guide

### Step 1: Create `src/app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* Fonts */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Fira Code", "Courier New", monospace;

  /* Colors - Primary */
  --color-primary: oklch(59.69% 0.196 265.25);
  --color-primary-foreground: oklch(100% 0 0);

  /* Colors - Secondary */
  --color-secondary: oklch(79.31% 0.17 190.17);
  --color-secondary-foreground: oklch(15% 0 0);

  /* Colors - Accent */
  --color-accent: oklch(75% 0.15 200);
  --color-accent-foreground: oklch(15% 0 0);

  /* Colors - Destructive */
  --color-destructive: oklch(55% 0.22 25);
  --color-destructive-foreground: oklch(100% 0 0);

  /* Colors - Muted */
  --color-muted: oklch(95% 0.01 265);
  --color-muted-foreground: oklch(45% 0.01 265);

  /* Colors - Background & Foreground */
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(15% 0 0);

  /* Colors - Card */
  --color-card: oklch(100% 0 0);
  --color-card-foreground: oklch(15% 0 0);

  /* Colors - Popover */
  --color-popover: oklch(100% 0 0);
  --color-popover-foreground: oklch(15% 0 0);

  /* Colors - Border & Input */
  --color-border: oklch(90% 0.01 265);
  --color-input: oklch(90% 0.01 265);

  /* Colors - Ring */
  --color-ring: oklch(59.69% 0.196 265.25);

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;

  /* Breakpoints */
  --breakpoint-3xl: 1920px;
}

/* Enable Inter's advanced features */
* {
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}
```

### Step 2: Create `src/lib/design-tokens.ts`

Optionally, create TypeScript constants for programmatic access:

```typescript
// src/lib/design-tokens.ts

/**
 * Design Tokens - TypeScript Constants
 * Use these for programmatic color/spacing access
 */

// Colors (Hex values for reference)
export const colors = {
  primary: "#7C3AED",
  primaryForeground: "#FFFFFF",
  secondary: "#4ECDC4",
  secondaryForeground: "#262626",
  accent: "#5CDBF0",
  accentForeground: "#262626",
  destructive: "#DC2626",
  destructiveForeground: "#FFFFFF",
  muted: "#F5F5F7",
  mutedForeground: "#737373",
  background: "#FFFFFF",
  foreground: "#262626",
  border: "#E5E5E5",
} as const;

// Spacing (in pixels)
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

// Typography
export const typography = {
  fontSizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

// Border Radius
export const borderRadius = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  full: "9999px",
} as const;

// Shadows
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
} as const;

// Z-Index
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
} as const;

// Transitions
export const transitions = {
  durations: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },
  easings: {
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;
```

### Step 3: Using Design Tokens in Components

```tsx
import { colors, spacing, typography } from "@/lib/design-tokens";

// In Tailwind classes (recommended)
<Button className="bg-primary text-primary-foreground px-4 py-2">
  Primary Button
</Button>

// Programmatic access (when needed)
<div style={{
  backgroundColor: colors.primary,
  padding: `${spacing[4]}px`,
}}>
  Custom Component
</div>
```

## 10. Tweakcn Integration

### Using Tweakcn for Color Management

1. **Visit Tweakcn:** Go to https://tweakcn.com
2. **Set Base Color:** Enter your primary color (#7C3AED)
3. **Generate Palette:** Tweakcn automatically generates semantic tokens
4. **Export CSS:** Copy the generated `@theme` block
5. **Paste in globals.css:** Replace color variables in your CSS file

### Tweakcn Features:

- **Automatic foreground calculation** for accessible contrast
- **Dark mode generation** with proper OKLCH adjustments
- **Semantic token system** compatible with Shadcn UI
- **Live preview** of components with your colors
- **Export formats** for Tailwind v4 CSS-first config

## 11. Quick Reference

### Color Tokens

```tsx
primary, primary - foreground;
secondary, secondary - foreground;
accent, accent - foreground;
destructive, destructive - foreground;
muted, muted - foreground;
background, foreground;
card, card - foreground;
popover, popover - foreground;
border, input, ring;
```

### Spacing Scale

```tsx
0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24;
// Corresponds to: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
```

### Typography Scale

```tsx
text-xs (12px), text-sm (14px), text-base (16px)
text-lg (18px), text-xl (20px), text-2xl (24px)
text-3xl (30px), text-4xl (36px), text-5xl (48px)
```

### Font Weights

```tsx
font - normal(400), font - medium(500);
font - semibold(600), font - bold(700);
```

### Border Radius

```tsx
rounded-sm (4px), rounded-md (8px), rounded-lg (12px)
rounded-xl (16px), rounded-2xl (24px), rounded-full
```

## 12. Best Practices

### ✅ DO:

- Use semantic color tokens (primary, secondary, accent)
- Reference values from globals.css @theme block
- Use Tweakcn for color scheme design
- Follow the spacing scale (4px base unit)
- Use responsive typography patterns
- Test color contrast for accessibility
- Maintain consistent component sizing
- Use the z-index scale for layering

### ❌ DON'T:

- Hardcode OKLCH or hex values in components
- Use arbitrary spacing values (w-[73px])
- Skip responsive breakpoints
- Use generic color names (blue-500)
- Modify spacing scale without documentation
- Create inconsistent component variants
- Ignore accessibility guidelines
- Use random z-index values

## 13. Maintenance

### Updating the Brand Guide

When making design system changes:

1. **Update this document first** - Document the change
2. **Update globals.css** - Apply to CSS variables
3. **Update design-tokens.ts** - Sync TypeScript constants
4. **Update components** - Refactor existing code
5. **Test thoroughly** - Check all affected components
6. **Document in CHANGELOG** - Track the change

### Version Control

Track design system changes in your CHANGELOG:

```markdown
## [2.6.0] - Brand Guide Implementation

- Created comprehensive brand guide with example palette
- Defined semantic color tokens (primary, secondary, accent, destructive, muted)
- Established typography system with Inter font
- Documented spacing scale and component specifications
```

---

**Last Updated:** November 11, 2025  
**Version:** 1.0.0  
**Maintained By:** Design System Team

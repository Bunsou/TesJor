````markdown
# ## Tailwind CSS v4 + Shadcn UI Standards

This document defines the strict coding standards for Tailwind CSS v4 and Shadcn UI component library. This version is a "CSS-first" framework, and all generated code MUST adhere to these new conventions.

## 1. The Core Philosophy: CSS-First Configuration

Tailwind v4 is configured _inside_ your CSS file, not `tailwind.config.js`.

- **Configuration File:** All theme customizations (`colors`, `fonts`, `breakpoints`) MUST be done inside your main CSS file (e.g., `src/app/globals.css`) using the `@theme` directive.
- **Importing:** The _only_ import needed is `@import "tailwindcss";`. This one line automatically handles `base`, `components`, and `utilities` layers.
- **Font:** Always use **Inter font** from Google Fonts via `next/font/google` for optimal performance and typography.
- **Color System:** Use **Tweakcn** for managing Shadcn UI color themes with semantic color tokens (primary, secondary, accent, destructive, muted).
- **Icons:** Use **Lucide React** for all icon needs - consistent, accessible, and tree-shakeable.
- **Additional Components:** Leverage **Origin UI** components from originui-ng.com for advanced UI patterns.
- **Custom Variants:** Define reusable component variants in `src/lib/styles.ts` for consistent styling across the application.

### Inter Font Setup

**In `src/app/layout.tsx`:**

```typescript
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Key Points:**

- Import `Inter` from `next/font/google` (NOT from a CDN or CSS link)
- Set `subsets: ["latin"]` (add other subsets as needed: `["latin", "latin-ext"]`)
- Use `variable: "--font-inter"` to create a CSS variable
- Apply `inter.variable` to `<html>` tag for the CSS variable
- Apply `inter.className` to `<body>` tag for direct font application
- `display: "swap"` provides better font loading UX

### Example `globals.css` with Semantic Color System

**IMPORTANT:** Use semantic color names (primary, secondary, accent, destructive, muted) instead of hardcoded OKLCH values. This ensures consistency with Shadcn UI and Tweakcn color management.

```css
@import "tailwindcss";

@theme {
  /* Inter font is automatically available via next/font/google */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;

  /* Semantic Color System - Use these tokens, not hardcoded values */
  /* Primary - Main brand color */
  --color-primary: oklch(59.69% 0.196 265.25);
  --color-primary-foreground: oklch(100% 0 0);

  /* Secondary - Supporting brand color */
  --color-secondary: oklch(79.31% 0.17 190.17);
  --color-secondary-foreground: oklch(15% 0 0);

  /* Accent - Highlight and call-to-action */
  --color-accent: oklch(75% 0.15 200);
  --color-accent-foreground: oklch(15% 0 0);

  /* Destructive - Error and danger states */
  --color-destructive: oklch(55% 0.22 25);
  --color-destructive-foreground: oklch(100% 0 0);

  /* Muted - Subtle backgrounds and text */
  --color-muted: oklch(95% 0.01 265);
  --color-muted-foreground: oklch(45% 0.01 265);

  /* Background and foreground */
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(15% 0 0);

  /* Card */
  --color-card: oklch(100% 0 0);
  --color-card-foreground: oklch(15% 0 0);

  /* Popover */
  --color-popover: oklch(100% 0 0);
  --color-popover-foreground: oklch(15% 0 0);

  /* Border and input */
  --color-border: oklch(90% 0.01 265);
  --color-input: oklch(90% 0.01 265);

  /* Ring (focus states) */
  --color-ring: oklch(59.69% 0.196 265.25);

  /* Radius - Component border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Custom breakpoints */
  --breakpoint-3xl: 1920px;
}

/* Optional: Enable Inter's advanced font features */
* {
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}
```

**Usage in Components:**

```tsx
// ✅ GOOD: Using semantic color tokens
<button className="bg-primary text-primary-foreground">Primary Button</button>
<div className="bg-secondary text-secondary-foreground">Secondary Section</div>
<p className="text-muted-foreground">Subtle text</p>

// ❌ BAD: Hardcoded OKLCH values
<button className="bg-[oklch(59.69%_0.196_265.25)]">Button</button>

// ❌ BAD: Generic color names without semantic meaning
<button className="bg-blue-500">Button</button>
```

**Benefits of next/font/google:**

- Automatic font optimization and self-hosting
- No external network requests to Google Fonts
- Zero layout shift with automatic size adjustment
- Better privacy and performance
- Font files are cached and served from your domain

## 2. Shadcn UI Component Library

- **USE SHADCN FIRST:** Before creating custom components, ALWAYS check if Shadcn UI has an available component.
- **Component Installation:** Use the Shadcn CLI to add components: `npx shadcn@latest add <component-name>`
- **Component Location:** All Shadcn components are installed in `src/components/ui/`
- **DO NOT Modify Core Components:** Never edit the base Shadcn component files. Instead, compose them or create wrappers.
- **Color Management:** Use **Tweakcn** (https://tweakcn.com) to manage and customize Shadcn color themes. Export colors as CSS variables compatible with Tailwind v4.

### Tweakcn Color Management

Tweakcn provides an intuitive interface for managing Shadcn UI color themes:

1. **Generate Color Palettes:** Use Tweakcn to create cohesive color schemes with automatic foreground color calculation
2. **Export to CSS Variables:** Export your theme as CSS variables that work with `@theme` directive
3. **Semantic Tokens:** Tweakcn generates all required semantic tokens (primary, secondary, accent, etc.)
4. **Dark Mode Support:** Automatically generates matching dark mode color schemes

**Installation:**

```bash
# Visit https://tweakcn.com to design your color scheme
# Copy the generated CSS variables into your globals.css @theme block
```

### Available Shadcn Components (Use These First)

**Form & Input:**

- `button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `slider`, `label`, `form`

**Layout:**

- `card`, `separator`, `aspect-ratio`, `scroll-area`, `resizable`

**Navigation:**

- `navigation-menu`, `menubar`, `dropdown-menu`, `context-menu`, `tabs`, `breadcrumb`, `pagination`

**Feedback:**

- `alert`, `alert-dialog`, `dialog`, `toast`, `tooltip`, `popover`, `hover-card`, `sheet`

**Data Display:**

- `table`, `data-table`, `badge`, `avatar`, `calendar`, `command`, `accordion`, `collapsible`

### Lucide React Icons

Use **Lucide React** for all icons in your application:

**Installation:**

```bash
pnpm add lucide-react
```

**Usage:**

```tsx
import { Search, User, Settings, ChevronRight, AlertCircle } from "lucide-react";

// Basic usage
<Search className="h-4 w-4" />

// With semantic colors
<AlertCircle className="h-5 w-5 text-destructive" />
<User className="h-6 w-6 text-primary" />

// In buttons
<Button>
  <Settings className="mr-2 h-4 w-4" />
  Settings
</Button>

// Responsive icon sizes
<ChevronRight className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
```

**Icon Guidelines:**

- Use consistent sizing: `h-4 w-4` (16px), `h-5 w-5` (20px), `h-6 w-6` (24px)
- Always add semantic color classes: `text-primary`, `text-destructive`, `text-muted-foreground`
- Use with Shadcn Button: Add `mr-2` or `ml-2` for spacing
- Lucide icons are tree-shakeable - only imported icons are bundled

### Origin UI Components

**Origin UI** (https://originui-ng.com) provides additional advanced UI patterns and components:

**Installation:**

```bash
# Visit https://originui-ng.com
# Copy individual components into your src/components/ui/ directory
# Or follow their installation instructions
```

**When to Use Origin UI:**

- Advanced animations and micro-interactions
- Complex layout patterns not covered by Shadcn
- Premium UI patterns (pricing tables, feature grids, testimonials)
- Marketing page components

**Integration Pattern:**

```tsx
// Origin UI components should follow the same structure as Shadcn
// Place them in src/components/ui/ or src/components/custom/
// Use semantic color tokens for consistency

import { PricingCard } from "@/components/ui/pricing-card"; // Origin UI component

<PricingCard
  className="border-primary" // Use semantic colors
  variant="featured" // Support variants like Shadcn
/>;
```

### Example Usage:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, LogIn } from "lucide-react";

export function LoginForm() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Email"
            className="pl-10 bg-background border-input"
          />
        </div>
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 3. Responsive Design - MANDATORY

**ALL UI MUST BE FULLY RESPONSIVE.** Every component, page, and layout MUST work correctly on all screen sizes.

### Breakpoint Standards

Use Tailwind's responsive prefixes for ALL layouts:

- **Mobile First:** Start with base styles (no prefix = mobile)
- **sm:** ≥ 640px (Small tablets)
- **md:** ≥ 768px (Tablets)
- **lg:** ≥ 1024px (Small laptops)
- **xl:** ≥ 1280px (Desktops)
- **2xl:** ≥ 1536px (Large screens)

### Responsive Requirements

1. **Typography:** Font sizes MUST scale responsively

   ```tsx
   <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
     Responsive Heading
   </h1>
   ```

2. **Layout:** Use responsive grid/flex patterns

   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {/* Cards */}
   </div>
   ```

3. **Spacing:** Adjust padding/margin for different screens

   ```tsx
   <div className="p-4 md:p-6 lg:p-8">{/* Content */}</div>
   ```

4. **Navigation:** Mobile-first navigation with hamburger menu

   ```tsx
   <nav className="flex flex-col lg:flex-row">
     <div className="lg:hidden">{/* Mobile menu button */}</div>
     <div className="hidden lg:flex">{/* Desktop menu */}</div>
   </nav>
   ```

5. **Images:** Responsive images with proper aspect ratios
   ```tsx
   <img
     className="w-full h-auto object-cover aspect-video"
     src="..."
     alt="..."
   />
   ```

### Testing Responsive Design

- **MUST TEST on:**

  - Mobile (375px, 414px)
  - Tablet (768px, 1024px)
  - Desktop (1280px, 1920px)

- **Common Patterns:**
  - Hide on mobile: `hidden md:block`
  - Show only on mobile: `block md:hidden`
  - Stack on mobile, row on desktop: `flex flex-col lg:flex-row`

## 4. Using Custom Theme Variables & Custom Variants File

### Semantic Color Tokens (REQUIRED)

- **Do Not Use Magic Numbers:** All code MUST use theme-defined semantic color tokens.
- **Never Hardcode Colors:** Avoid arbitrary OKLCH values or generic color names (blue-500, red-600, etc.)
- **Use Semantic Names:** Always use semantic color tokens that convey meaning and purpose.

**Available Semantic Tokens:**

- `primary` / `primary-foreground` - Main brand color and its text color
- `secondary` / `secondary-foreground` - Secondary brand color
- `accent` / `accent-foreground` - Accent and highlight color
- `destructive` / `destructive-foreground` - Error and danger states
- `muted` / `muted-foreground` - Subtle backgrounds and text
- `background` / `foreground` - Base background and text colors
- `card` / `card-foreground` - Card background and text
- `popover` / `popover-foreground` - Popover background and text
- `border` - Border color
- `input` - Input field border color
- `ring` - Focus ring color

**Usage Examples:**

```tsx
// ✅ GOOD: Semantic color tokens
<Button className="bg-primary text-primary-foreground">Primary Action</Button>
<div className="bg-secondary text-secondary-foreground">Secondary Section</div>
<Alert className="border-destructive text-destructive">Error message</Alert>
<p className="text-muted-foreground">Supporting text</p>

// ❌ BAD: Hardcoded OKLCH values
<Button className="bg-[oklch(59.69%_0.196_265.25)]">Button</Button>

// ❌ BAD: Generic color names without semantic meaning
<Button className="bg-blue-500 text-white">Button</Button>
<div className="bg-red-600">Error</div>
```

### Custom Variants File: `src/lib/styles.ts`

Create a centralized file for reusable component variant definitions using `class-variance-authority (cva)`:

```tsx
// src/lib/styles.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Utility function to merge Tailwind classes safely
 * Combines clsx for conditional classes and twMerge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Button Variants
 * Extends Shadcn Button with custom variants
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        accent: "bg-accent text-accent-foreground hover:bg-accent/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Card Variants
 * Reusable card styling patterns
 */
export const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        outlined: "border-2 border-primary",
        elevated: "shadow-lg border-border",
        muted: "bg-muted border-border",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

/**
 * Badge Variants
 * Status and category indicators
 */
export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        success: "border-transparent bg-green-500 text-white",
        warning: "border-transparent bg-yellow-500 text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Text Variants
 * Typography patterns with semantic colors
 */
export const textVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      destructive: "text-destructive",
      accent: "text-accent",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "base",
    weight: "normal",
  },
});

/**
 * Export variant prop types for TypeScript
 */
export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type CardVariants = VariantProps<typeof cardVariants>;
export type BadgeVariants = VariantProps<typeof badgeVariants>;
export type TextVariants = VariantProps<typeof textVariants>;
```

**Using Custom Variants:**

```tsx
import { cn, buttonVariants, cardVariants, badgeVariants } from "@/lib/styles";

// Button with custom variant
<button className={cn(buttonVariants({ variant: "accent", size: "lg" }))}>
  Accent Button
</button>

// Card with elevated variant
<div className={cn(cardVariants({ variant: "elevated", padding: "lg" }))}>
  Card content
</div>

// Badge with success variant
<span className={cn(badgeVariants({ variant: "success" }))}>
  Active
</span>

// Combining variants with additional classes
<button className={cn(buttonVariants({ variant: "outline" }), "w-full md:w-auto")}>
  Responsive Button
</button>
```

## 5. Dynamic Utilities (New in v4)

- **Use Dynamic Values Freely:** Tailwind v4 supports dynamic utilities out of the box. You no longer need to use arbitrary value syntax (`[]`) for _most_ common properties.
- **Dynamic Data Attributes:**
  - **GOOD:** `class="data-open:flex data-closed:hidden"`
  - **OK (v3):** `class="[&[data-open]]:flex"`
- **Dynamic Grid Columns:**
  - **GOOD:** `class="grid-cols-7"`
  - **BAD (v3):** `class="grid-cols-[repeat(7,1fr)]"`
- **Arbitrary Values:** You should _only_ use arbitrary values (`w-[101px]`) for truly one-off "magic numbers" that do not belong in the theme.

## 6. Built-in Modern CSS Features

- **Container Queries:** The `@tailwindcss/container-queries` plugin is **no longer needed.** Use the built-in `@` variants.
  - **Syntax:** Mark an element as a container with `@container`.
  - **Usage:** Style children based on the container's size.
  - **Example:**
    ```html
    <div class="@container/main">
      <h1 class="text-lg @[40rem]/main:text-3xl">My Content</h1>
    </div>
    ```
- **Logical Properties:** For better RTL/LTR support, prefer logical properties.
  - **BAD:** `class="ml-2 pl-4"` (margin-left, padding-left)
  - **GOOD:** `class="ms-2 ps-4"` (margin-start, padding-start)

## 7. Components and `@apply`

- **Avoid `@apply`:** The `@apply` directive should be avoided. It is almost always better to create a new React component and pass props for variants.
- **When to use `@apply` (Rarely):** The _only_ acceptable use case is when styling a 3rd-party component's raw HTML or for complex CSS-only components.
- **Composing Classes in React:**

  - **BAD (in CSS):**
    ```css
    .btn-primary {
      @apply bg-blue-500 text-white rounded-lg px-4 py-2;
    }
    ```
  - **GOOD (in React with Shadcn):**

    ```tsx
    import { Button } from "@/components/ui/button";

    // Shadcn Button already has variants built-in
    <Button variant="default" size="lg">Click Me</Button>
    <Button variant="destructive">Delete</Button>
    <Button variant="outline">Cancel</Button>
    ```

## 8. Shadcn Component Customization

When you need to customize Shadcn components:

1. **Use className prop with semantic colors:**

   ```tsx
   <Button className="w-full md:w-auto bg-primary text-primary-foreground">
     Responsive Primary Button
   </Button>
   <Button className="bg-accent text-accent-foreground">
     Accent Button
   </Button>
   ```

2. **Create composite components with custom variants:**

   ```tsx
   // src/components/custom/submit-button.tsx
   import { Button } from "@/components/ui/button";
   import { cn, buttonVariants } from "@/lib/styles";
   import { Loader2 } from "lucide-react";

   interface SubmitButtonProps {
     loading?: boolean;
     children: React.ReactNode;
     variant?: "default" | "secondary" | "accent" | "destructive";
   }

   export function SubmitButton({
     loading,
     children,
     variant = "default",
     ...props
   }: SubmitButtonProps) {
     return (
       <Button
         disabled={loading}
         className={cn(buttonVariants({ variant }))}
         {...props}
       >
         {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
         {loading ? "Loading..." : children}
       </Button>
     );
   }
   ```

3. **Use custom variants from `src/lib/styles.ts`:**

   ```tsx
   import { cn, cardVariants, badgeVariants } from "@/lib/styles";
   import { Check, X } from "lucide-react";

   export function StatusCard({ status }: { status: "active" | "inactive" }) {
     return (
       <div
         className={cn(cardVariants({ variant: "elevated", padding: "lg" }))}
       >
         <span
           className={cn(
             badgeVariants({
               variant: status === "active" ? "success" : "destructive",
             })
           )}
         >
           {status === "active" ? (
             <>
               <Check className="mr-1 h-3 w-3" /> Active
             </>
           ) : (
             <>
               <X className="mr-1 h-3 w-3" /> Inactive
             </>
           )}
         </span>
       </div>
     );
   }
   ```

## 9. Responsive Component Patterns

### Responsive Card Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <Card>...</Card>
</div>
```

### Responsive Navigation

```tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, User, Settings } from "lucide-react";

export function Navigation() {
  return (
    <>
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="text-foreground">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-background border-border">
          <nav className="flex flex-col gap-4">
            <Button variant="ghost" className="justify-start">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" className="justify-start">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button variant="ghost" className="justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Menu */}
      <nav className="hidden lg:flex gap-4">
        <Button variant="ghost">
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button variant="ghost">
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
        <Button variant="ghost">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </nav>
    </>
  );
}
```

### Responsive Form Layout

```tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-foreground">
            First Name
          </Label>
          <Input
            id="firstName"
            placeholder="John"
            className="bg-background border-input"
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-foreground">
            Last Name
          </Label>
          <Input
            id="lastName"
            placeholder="Doe"
            className="bg-background border-input"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="email" className="text-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          className="w-full bg-background border-input"
        />
      </div>
      <Button className="w-full md:w-auto bg-primary text-primary-foreground">
        Submit
      </Button>
    </form>
  );
}
```

## 10. Accessibility with Shadcn

Shadcn components are built with accessibility in mind. Always maintain these standards:

- Use semantic HTML
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast
- Use Lucide React icons with proper sizing and semantic colors

```tsx
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";

// Icon-only button with aria-label
<Button
  aria-label="Close menu"
  variant="ghost"
  size="icon"
  className="text-foreground"
>
  <X className="h-4 w-4" />
</Button>

// Alert with icon and semantic colors
<Alert className="border-destructive bg-destructive/10">
  <AlertCircle className="h-4 w-4 text-destructive" />
  <AlertTitle className="text-destructive">Error</AlertTitle>
  <AlertDescription className="text-destructive-foreground">
    Please check your input and try again.
  </AlertDescription>
</Alert>
```

## 11. Project Structure Requirements

**ALL components and application code MUST be placed in the `src/` directory.**

### Required Directory Structure:

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Dashboard route group
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── custom/           # Custom/composite components
│   └── icons/            # Custom icon components (if needed beyond Lucide)
├── lib/                  # Utility functions and configurations
│   ├── styles.ts         # Custom variant definitions (CVA)
│   ├── utils.ts          # cn() and other utilities
│   └── constants.ts      # App-wide constants
├── server/               # Server-side code
│   ├── actions/          # Server Actions
│   ├── db/              # Database schema and client
│   └── auth/            # Authentication logic
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── styles/              # Global styles (if needed beyond globals.css)
```

**Key Rules:**

- ✅ All components in `src/components/`
- ✅ All pages in `src/app/`
- ✅ Custom variants in `src/lib/styles.ts`
- ✅ Utilities in `src/lib/utils.ts`
- ❌ Never place components in root-level `/components/`
- ❌ Never place lib files in root-level `/lib/`

## 12. Installation and Setup

### Required Packages:

```bash
# Core dependencies
pnpm add tailwindcss@next @tailwindcss/vite
pnpm add class-variance-authority clsx tailwind-merge
pnpm add lucide-react

# Shadcn UI CLI (for component installation)
pnpm dlx shadcn@latest init

# Individual Shadcn components
pnpm dlx shadcn@latest add button input card form
```

### Color Management Workflow:

1. **Design Colors:** Visit https://tweakcn.com to create your color scheme
2. **Export CSS Variables:** Copy the generated `@theme` block
3. **Update `globals.css`:** Paste into your `src/app/globals.css` file
4. **Verify Tokens:** Ensure all semantic tokens are present (primary, secondary, accent, destructive, muted)
5. **Test Components:** Update existing components to use semantic color classes

### Custom Variants Setup:

1. **Create `src/lib/styles.ts`:** Use the template provided in section 4
2. **Export variants:** Define button, card, badge, and text variants
3. **Import in components:** Use `cn()` helper and variant functions
4. **Maintain consistency:** All custom components should reference this file

## 13. Best Practices Summary

### Color Usage:

- ✅ Always use semantic color tokens (primary, secondary, accent, destructive, muted)
- ✅ Reference colors from `globals.css @theme` block
- ✅ Use Tweakcn for color scheme design and export
- ❌ Never hardcode OKLCH values in component code
- ❌ Never use generic color names (blue-500, red-600)

### Component Patterns:

- ✅ Use Shadcn UI components as foundation
- ✅ Use Lucide React for all icons
- ✅ Define custom variants in `src/lib/styles.ts`
- ✅ Use `cn()` helper for class composition
- ✅ Leverage Origin UI for advanced patterns
- ❌ Don't create custom components if Shadcn has equivalent
- ❌ Don't modify Shadcn component source files

### Project Structure:

- ✅ All code in `src/` directory
- ✅ Components in `src/components/`
- ✅ Custom variants in `src/lib/styles.ts`
- ✅ Global styles in `src/app/globals.css`
- ❌ No root-level `/components/` or `/lib/`

### Responsive Design:

- ✅ Mobile-first approach (base styles = mobile)
- ✅ Use responsive breakpoint prefixes (sm, md, lg, xl, 2xl)
- ✅ Test on multiple screen sizes
- ✅ Use responsive icon sizes with Lucide
- ❌ Don't assume desktop-only usage
````

## 2. Using Custom Theme Variables

- **Do Not Use Magic Numbers:** All code MUST use theme-defined values.
- **Using Custom Variables:** When you define a custom theme variable (like `--color-brand-primary`), you can use it directly in your HTML.
  - **GOOD:** `class="bg-brand-primary text-white"`
  - **BAD:** `class="bg-[#6A0DAD]"`

## 3. Dynamic Utilities (New in v4)

- **Use Dynamic Values Freely:** Tailwind v4 supports dynamic utilities out of the box. You no longer need to use arbitrary value syntax (`[]`) for _most_ common properties.
- **Dynamic Data Attributes:**
  - **GOOD:** `class="data-open:flex data-closed:hidden"`
  - **OK (v3):** `class="[&[data-open]]:flex"`
- **Dynamic Grid Columns:**
  - **GOOD:** `class="grid-cols-7"`
  - **BAD (v3):** `class="grid-cols-[repeat(7,1fr)]"`
- **Arbitrary Values:** You should _only_ use arbitrary values (`w-[101px]`) for truly one-off "magic numbers" that do not belong in the theme.

## 4. Built-in Modern CSS Features

- **Container Queries:** The `@tailwindcss/container-queries` plugin is **no longer needed.** Use the built-in `@` variants.
  - **Syntax:** Mark an element as a container with `@container`.
  - **Usage:** Style children based on the container's size.
  - **Example:**
    ```html
    <div class="@container/main">
      <h1 class="text-lg @[40rem]/main:text-3xl">My Content</h1>
    </div>
    ```
- **Logical Properties:** For better RTL/LTR support, prefer logical properties.
  - **BAD:** `class="ml-2 pl-4"` (margin-left, padding-left)
  - **GOOD:** `class="ms-2 ps-4"` (margin-start, padding-start)

## 5. Components and `@apply`

- **Avoid `@apply`:** The `@apply` directive should be avoided. It is almost always better to create a new React component and pass props for variants.
- **When to use `@apply` (Rarely):** The _only_ acceptable use case is when styling a 3rd-party component's raw HTML or for complex CSS-only components.
- **Composing Classes in React:**

  - **BAD (in CSS):**
    ```css
    .btn-primary {
      @apply bg-blue-500 text-white rounded-lg px-4 py-2;
    }
    ```
  - **GOOD (in React):**

    ```tsx
    import { cva } from "class-variance-authority"; // Use cva or similar

    const buttonVariants = cva("rounded-lg px-4 py-2 font-medium", {
      variants: {
        intent: {
          primary: "bg-brand-primary text-white",
          secondary: "bg-brand-secondary text-black",
        },
      },
    });

    export const Button = ({ intent, ...props }) => {
      return <button className={buttonVariants({ intent })} {...props} />;
    };
    ```

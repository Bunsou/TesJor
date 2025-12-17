# Environment Setup Guide

## Prerequisites

### Required Software

- **Node.js**: 18+ (recommended: 20 LTS)
- **Package Manager**: pnpm (recommended) or npm
- **Git**: Latest version
- **AI Agent**: GitHub Copilot, ChatGPT, Claude, or AI Agent (Gemini CLI optional)

### Installation Commands

```bash
# Install Node.js (using nvm)
nvm install 20
nvm use 20

# Install pnpm globally
npm install -g pnpm

# For AI Agent (Gemini CLI optional) (optional):
# npm install -g @google/generative-ai-cli
```

## Project Setup

### 1. Initialize New Next.js Project

```bash
# Create Next.js app with TypeScript and Tailwind
npx create-next-app@latest my-app \
  --typescript \
  --tailwind \
  --app \
  --import-alias "@/*"

cd my-app
```

### 2. Install Additional Dependencies

```bash
# Core dependencies
pnpm add zod
pnpm add drizzle-orm postgres
pnpm add bcrypt
pnpm add jsonwebtoken

# Dev dependencies
pnpm add -D drizzle-kit
pnpm add -D @types/bcrypt
pnpm add -D @types/jsonwebtoken
pnpm add -D tsx

# Testing (optional but recommended)
pnpm add -D jest @testing-library/react @testing-library/jest-dom
pnpm add -D @testing-library/user-event
```

### 3. Install Shadcn UI

```bash
# Initialize Shadcn UI
npx shadcn@latest init

# Follow the prompts:
# - Would you like to use TypeScript? Yes
# - Which style would you like to use? Default
# - Which color would you like to use as base color? Slate
# - Where is your global CSS file? src/app/globals.css
# - Would you like to use CSS variables for colors? Yes
# - Where is your tailwind.config.js located? (none - using v4)
# - Configure the import alias for components: @/components
# - Configure the import alias for utils: @/lib/utils

# Install commonly used components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add form
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
npx shadcn@latest add sheet
npx shadcn@latest add select
npx shadcn@latest add label
```

### 4. Copy Agent Workflow

```bash
# From this workflow directory
cp -r .gemini /path/to/my-app/
cp AGENT.md /path/to/my-app/
cp QUICK_REFERENCE.md /path/to/my-app/
cp SRS_TEMPLATE.md /path/to/my-app/docs/source/srs.md

# Create docs structure
mkdir -p /path/to/my-app/docs/{source,prd,features}
```

### 5. Update Tailwind Config (v4) & Setup Inter Font

```bash
# Remove old config (if exists)
rm tailwind.config.js tailwind.config.ts

# Update src/app/globals.css
```

**Edit `src/app/globals.css`:**

```css
@import "tailwindcss";

@theme {
  /* Inter font is loaded via next/font/google */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;

  /* Custom colors */
  --color-brand-primary: oklch(59.69% 0.196 265.25);
  --color-brand-secondary: oklch(79.31% 0.17 190.17);

  /* Custom breakpoints */
  --breakpoint-3xl: 1920px;
}

/* Enable Inter's advanced font features */
* {
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}
```

**Edit `src/app/layout.tsx` to import Inter font:**

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

**Benefits:**

- ✅ Automatic font optimization and self-hosting by Next.js
- ✅ Zero layout shift with automatic size adjustment
- ✅ No external network requests to Google Fonts (better privacy & performance)
- ✅ Font files are cached and served from your domain
- ✅ Inter's variable font provides optimal file size and flexibility

### 6. Setup Drizzle ORM

```bash
# Create Drizzle config file
touch drizzle.config.ts

# Create database schema file
mkdir -p src/server/db
touch src/server/db/schema.ts
touch src/server/db/client.ts
```

**Create `drizzle.config.ts` at project root:**

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

**Update `.env`:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

### 7. Create Folder Structure

```bash
# Create all necessary folders
mkdir -p src/app/api
mkdir -p src/components/{ui,forms,layout,common}
mkdir -p src/features
mkdir -p src/lib/{api,auth,utils,providers}
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/styles
mkdir -p src/config
mkdir -p src/server/{db,services,middleware,utils,types}
mkdir -p src/server/db/queries
mkdir -p drizzle
```

**Note:** `src/components/ui/` will be populated by Shadcn components.

### 8. Setup TypeScript Config

**Update `tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/features/*": ["./src/features/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/server/*": ["./src/server/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 9. Configure AI Agent (Gemini CLI optional)

```bash
# Authenticate with Gemini
# For Gemini: gemini auth login

# Set your API key (if needed)
# For Gemini: export GEMINI_API_KEY="your-api-key"

# Test the connection
# Use your AI agent interface "Hello, are you working?"
```

### 10. Create Your First SRS

```bash
# Copy the template
cp SRS_TEMPLATE.md docs/source/srs.md

# Edit with your project details
vim docs/source/srs.md
```

### 11. Verify Setup

```bash
# Run Next.js dev server
pnpm dev

# In another terminal, test Agent workflow
# Use your AI agent interface "/explain 'What is this project structure?'"
```

## Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# NextAuth (if using)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers (example)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Payment Integration
POLAR_ACCESS_TOKEN="polar_at_..."
POLAR_WEBHOOK_SECRET="polar_wh_..."
```

## Useful Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx src/server/db/seed.ts",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

## Troubleshooting

### AI Agent (Gemini CLI optional) Not Found

```bash
# Reinstall
npm install -g @google/generative-ai-cli

# Check installation
which gemini
gemini --version
```

### Drizzle Kit Errors

```bash
# Regenerate migrations
npx drizzle-kit generate:pg

# Push schema to database (dev only!)
npx drizzle-kit push:pg --force
```

### TypeScript Path Alias Errors

- Restart your IDE/editor
- Check `tsconfig.json` paths match your folder structure
- Run `npm run build` to verify

### Tailwind Not Working

- Ensure `globals.css` is imported in `app/layout.tsx`
- Check Tailwind v4 is installed: `pnpm add tailwindcss@next`
- Restart dev server

## Next Steps

1. ✅ Write your `docs/source/srs.md`
2. ✅ Read `AGENT.md` for the AI prompt
3. ✅ Read `QUICK_REFERENCE.md` for commands
4. ✅ Start with `/plan:prd` to create your first PRD
5. ✅ Use `/plan:feature` to plan your first feature
6. ✅ Use `/do:component` or `/do:api-route` to build

Happy coding! 🚀

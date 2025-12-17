# Project Setup Checklist

Use this checklist when starting a new project with the Agent workflow.

## ✅ Pre-Setup

- [ ] Have Node.js 18+ installed
- [ ] Have AI Agent (Gemini CLI optional) installed and authenticated
- [ ] Have a clear project idea and goals

---

## 📁 Step 1: Copy Workflow Files

```bash
# From this template directory
cd /path/to/Gemini-workflow

# Copy to your new project
cp -r .gemini /path/to/your-project/
cp AGENT.md /path/to/your-project/
cp README.md /path/to/your-project/  # Optional, customize it
```

- [ ] Copied `.agent/` directory
- [ ] Copied `AGENT.md` to project root
- [ ] Optionally copied README.md (customize for your project)

**Optional reference docs** (keep locally, don't push to GitHub):

```bash
cp -r .gemini-docs /path/to/your-project/
```

- [ ] Copied `.agent-docs/` for local reference

---

## 📝 Step 2: Create Documentation Structure

```bash
cd /path/to/your-project
mkdir -p docs/{source,prd,features}
```

- [ ] Created `docs/source/` directory
- [ ] Created `docs/prd/` directory
- [ ] Created `docs/features/` directory

---

## 📄 Step 3: Write Your Master Plan (SRS)

```bash
# Copy the template
cp .agent-docs/SRS_TEMPLATE.md docs/source/srs.md

# Edit with your project details
vim docs/source/srs.md  # or use your preferred editor
```

**Required sections to fill out:**

- [ ] Project name and vision
- [ ] Target audience
- [ ] Core features (at least 3-5)
- [ ] User stories for each feature
- [ ] Data models (high-level entities)
- [ ] API endpoints (high-level)
- [ ] Business rules
- [ ] Technical constraints

**Tip:** Spend time on this! It's your Source of Truth.

---

## 🚀 Step 4: Initialize Next.js Project (if new)

```bash
npx create-next-app@latest your-project \
  --typescript \
  --tailwind \
  --app \
  --import-alias "@/*"

cd your-project
```

- [ ] Created Next.js project
- [ ] TypeScript enabled
- [ ] Tailwind CSS included
- [ ] App Router selected
- [ ] Import alias configured

---

## 📦 Step 5: Install Dependencies

```bash
# Core
pnpm add zod drizzle-orm postgres

# Dev tools
pnpm add -D drizzle-kit tsx

# Auth (if needed)
pnpm add bcrypt jsonwebtoken
pnpm add -D @types/bcrypt @types/jsonwebtoken

# Testing (optional)
pnpm add -D jest @testing-library/react @testing-library/jest-dom
```

- [ ] Installed Zod
- [ ] Installed Drizzle ORM
- [ ] Installed dev tools
- [ ] Installed auth libraries (if needed)
- [ ] Installed testing libraries (optional)

---

## 🎨 Step 6: Setup Shadcn UI

```bash
npx shadcn@latest init

# Install common components
npx shadcn@latest add button input card form dialog toast
```

- [ ] Initialized Shadcn UI
- [ ] Installed common components

---

## 🗂️ Step 7: Create Folder Structure

```bash
mkdir -p src/app/api
mkdir -p src/components/{ui,forms,layout,common}
mkdir -p src/features
mkdir -p src/lib/{api,auth,utils,providers}
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/config
mkdir -p src/server/{db,services,middleware,utils,types}
mkdir -p src/server/db/queries
mkdir -p drizzle
```

- [ ] Created all necessary folders
- [ ] Follows `structure_template.md` layout

---

## 🗃️ Step 8: Setup Database (Drizzle)

**Create `drizzle.config.ts`:**

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

**Create `src/server/db/schema.ts`:**

```typescript
// Your database schema will go here
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
```

**Create `src/server/db/client.ts`:**

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const conn = postgres(process.env.DATABASE_URL!);
export const db = drizzle(conn, { schema });
```

- [ ] Created `drizzle.config.ts`
- [ ] Created `src/server/db/schema.ts`
- [ ] Created `src/server/db/client.ts`

---

## 🔐 Step 9: Setup Environment Variables

**Create `.env.local`:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

**Create `.env.example`:**

```env
DATABASE_URL=""
NEXTAUTH_URL=""
NEXTAUTH_SECRET=""
```

- [ ] Created `.env.local` with actual values
- [ ] Created `.env.example` as template
- [ ] Added `.env.local` to `.gitignore`

---

## ⚙️ Step 10: Update TypeScript Config

**Update `tsconfig.json` with path aliases:**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/features/*": ["./src/features/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/server/*": ["./src/server/*"]
    }
  }
}
```

- [ ] Added path aliases
- [ ] Strict mode enabled

---

## 🎨 Step 11: Setup Tailwind v4 & Inter Font

### A. Install Tailwind CSS v4

```bash
pnpm add tailwindcss@next
```

### B. Setup Inter Font from Google Fonts

**Create or update `src/app/layout.tsx`:**

```typescript
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Optional: controls font display behavior
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

### C. Update `src/app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* Inter font is automatically available via next/font/google */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;

  /* Custom brand colors */
  --color-brand-primary: oklch(59.69% 0.196 265.25);
  --color-brand-secondary: oklch(79.31% 0.17 190.17);

  /* Custom breakpoints (optional) */
  --breakpoint-3xl: 1920px;
}

/* Global styles */
* {
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}
```

### D. Remove old Tailwind config

```bash
rm tailwind.config.js  # if exists
rm tailwind.config.ts  # if exists
```

**Checklist:**

- [ ] Installed Tailwind CSS v4 (`tailwindcss@next`)
- [ ] Imported Inter font from `next/font/google` in layout
- [ ] Applied font variable to `<html>` tag
- [ ] Applied font className to `<body>` tag
- [ ] Updated `globals.css` with Tailwind v4 syntax
- [ ] Configured `--font-sans` to use Inter
- [ ] Removed old Tailwind config files
- [ ] Added custom theme variables

---

## 🧪 Step 12: Add NPM Scripts

**Update `package.json`:**

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
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

- [ ] Added database scripts
- [ ] Added test scripts

---

## 🤖 Step 13: Test AI Agent (Gemini CLI optional)

```bash
# Authenticate (if not already)
# For Gemini: gemini auth login

# Test the workflow
# Use your AI agent interface "Hello, can you read my AGENT.md file?"
```

- [ ] AI Agent (Gemini CLI optional) authenticated
- [ ] Can access project context
- [ ] Test command works

---

## 📝 Step 14: First Feature Plan

```bash
# Generate your first PRD
# Use your AI agent interface "/plan:prd 'Your first major feature area'"

# Save the output to docs/prd/prd-001-[topic].md
```

- [ ] Generated first PRD
- [ ] Saved to `docs/prd/`
- [ ] Reviewed and confirmed requirements

---

## 🚢 Step 15: Optional - Setup Git Ignore

**Add to `.gitignore` (optional):**

```
# Agent workflow docs (optional - keep local only)
.agent-docs/
docs/prd/
docs/features/

# Environment
.env.local
```

- [ ] Decided what to push to GitHub
- [ ] Updated `.gitignore` accordingly

---

## ✅ Step 16: Verification

Run these checks:

```bash
# Start dev server
pnpm dev

# In another terminal, test Gemini
# Use your AI agent interface "/explain 'What is the structure of this project?'"

# Test a command
# Use your AI agent interface "/plan:feature 'Simple hello world page'"
```

- [ ] Dev server starts without errors
- [ ] Gemini can read project structure
- [ ] Commands work correctly

---

## 🎉 You're Ready!

Now you can start building features using the workflow:

1. Plan with `/plan:prd` and `/plan:feature`
2. Build with `/do:component`, `/do:api-route`, `/do:db`
3. Test with `/do:test`
4. Review with `/review:code`
5. Refactor with `/refactor:file`
6. Commit with `/do:commit`

---

## 📚 Reference Docs

Keep these handy:

- `AGENT.md` - Full AI instructions
- `QUICK_REFERENCE.md` - Command cheat sheet
- `SETUP.md` - Detailed setup guide
- `USAGE_EXAMPLE.md` - End-to-end example
- `.agent/contexts/structure_template.md` - File organization

---

## 🆘 Troubleshooting

### Gemini can't find files

→ Check that `.agent/` and `AGENT.md` are in project root

### Commands not working

→ Verify `.agent/commands/` structure is correct

### Code doesn't match standards

→ Ensure all context files are present in `.agent/contexts/`

### Database issues

→ Check `DATABASE_URL` in `.env.local`
→ Run `npx drizzle-kit push:pg` to sync schema

---

**Happy building! 🚀**

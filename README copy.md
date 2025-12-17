# AI Agent NextJS Workflow

> A production-ready workflow system for building Next.js 14+ applications with AI assistance using any AI agent (Claude, ChatGPT, Gemini, etc.).

## 🎯 What is This?

This is a **structured AI development workflow** that combines:

- 📋 **Documentation-Driven Development** (Source of Truth approach)
- 🤖 **AI-Powered Code Generation** (via AI agents like Claude, ChatGPT, Gemini)
- 📐 **Strict Standards Enforcement** (TypeScript, Next.js, Tailwind v4)
- 🔄 **Progressive Planning → Execution** (PRD → Feature → Code)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- An AI assistant (GitHub Copilot with Claude, ChatGPT, Gemini CLI, etc.)
- A Next.js 14+ project (or starting one)

### Setup

1. **Copy this workflow to your project:**

   ```bash
   cp -r .agent /path/to/your/project/
   cp AGENT.md /path/to/your/project/
   ```

2. **Create the docs structure:**

   ```bash
   mkdir -p docs/{source,prd,features}
   ```

3. **Write your master plan:**

   ```bash
   # Create your source of truth document
   vim docs/source/srs.md
   ```

4. **Start using commands:**
   ```bash
   # Example: Plan a feature
   # Provide the AGENT.md file to your AI assistant and use commands like:
   # /plan:feature 'User authentication with Google OAuth'
   ```

## 📚 How It Works

### The Golden Rule

Every code generation follows this 3-step process:

1. **📖 Read the Plan** → Understand business requirements from `docs/source/srs.md`
2. **📐 Read the Rules** → Follow technical standards from `.agent/contexts/`
3. **⚡ Execute** → Generate production-ready, fully-commented code

### The Workflow Layers

```
┌─────────────────────────────────────────┐
│  docs/source/srs.md                     │  ← Your Master Plan
│  (Human-written, business requirements) │     (Source of Truth)
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  docs/prd/prd-XXX.md                    │  ← AI-Generated PRDs
│  (Detailed product requirements)        │     (Derived from SRS)
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  docs/features/feat-XXX.md              │  ← AI-Generated Features
│  (Technical specifications)             │     (Implementation plans)
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  src/                                   │  ← AI-Generated Code
│  (Production-ready implementation)      │     (Following all standards)
└─────────────────────────────────────────┘
```

## 📂 Project Structure

```
your-nextjs-project/
├── .agent/                     # Workflow configuration
│   ├── contexts/              # Standards & Rules
│   │   ├── structure_template.md   # File organization
│   │   ├── typescript.md           # TypeScript rules
│   │   ├── nextjs.md              # Next.js patterns
│   │   ├── api.md                 # API standards
│   │   ├── tailwind.md            # Tailwind v4 rules
│   │   └── database.md            # Database patterns
│   │
│   └── commands/              # Command definitions
│       ├── plan/              # Planning commands
│       ├── do/                # Execution commands
│       ├── refactor/          # Refactoring commands
│       ├── review/            # Code review commands
│       └── explain.toml       # Documentation command
│
├── docs/                      # Project documentation
│   ├── source/
│   │   └── srs.md            # Master plan (Source of Truth)
│   ├── prd/                  # Product Requirements Documents
│   └── features/             # Technical Feature Plans
│
├── src/                       # Your Next.js application
│   ├── app/                  # App Router (pages + API routes)
│   ├── components/           # Reusable UI components
│   ├── features/             # Feature-based modules
│   ├── server/               # Backend code (services, DB, middleware)
│   └── ...                   # (see structure_template.md)
│
├── drizzle/                   # Database migrations
├── AGENT.md                   # Master AI prompt (read this first!)
├── QUICK_REFERENCE.md         # Command cheat sheet
└── README.md                  # This file
```

## 🎮 Command Reference

### Planning Phase

| Command                       | Purpose                                | Output                      |
| ----------------------------- | -------------------------------------- | --------------------------- |
| `/plan:prd "Topic"`           | Generate Product Requirements Document | `docs/prd/prd-XXX.md`       |
| `/plan:feature "Description"` | Create technical feature plan          | `docs/features/feat-XXX.md` |

### Execution Phase

| Command                     | Purpose                   | Output                   |
| --------------------------- | ------------------------- | ------------------------ |
| `/do:component "feat-file"` | Generate React component  | Component `.tsx` file    |
| `/do:api-route "feat-file"` | Create API route handler  | `route.ts` file          |
| `/do:db "description"`      | Design database schema    | Drizzle schema + queries |
| `/do:test "file-path"`      | Write comprehensive tests | Test file                |
| `/do:commit`                | Generate commit message   | Conventional commit      |

### Quality Phase

| Command                 | Purpose                | Output          |
| ----------------------- | ---------------------- | --------------- |
| `/review:code`          | Review code for issues | Feedback report |
| `/refactor:code`        | Refactor code block    | Improved code   |
| `/refactor:file "path"` | Refactor entire file   | Refactored file |

### Documentation Phase

| Command               | Purpose                 | Output                  |
| --------------------- | ----------------------- | ----------------------- |
| `/explain "question"` | Explain how things work | Technical documentation |

## 🛠️ Tech Stack Standards

This workflow enforces these technologies and patterns:

- **Framework:** Next.js 14+ (App Router only)
- **Language:** TypeScript (Strict mode, no `any`)
- **Styling:** Tailwind CSS v4 (CSS-first configuration)
- **Components:** Server Components by default, Client Components only when necessary
- **API:** Next.js Route Handlers with Zod validation
- **Database:** Drizzle ORM with PostgreSQL
- **Testing:** Jest + React Testing Library

## 📖 Usage Examples

### Example 1: Building Authentication

```bash
# 1. Plan the feature
# Provide AGENT.md to your AI and use:
/plan:feature 'Google OAuth authentication system'
# Save output to: docs/features/feat-001-google-oauth.md

# 2. Generate the login button component
/do:component 'docs/features/feat-001-google-oauth.md'

# 3. Create the API callback route
/do:api-route 'docs/features/feat-001-google-oauth.md'

# 4. Design the user database schema
/do:db 'User authentication tables from feat-001'

# 5. Write tests
/do:test 'src/app/api/auth/google/callback/route.ts'

# 6. Commit
git add .
git diff --staged | pbcopy  # Then ask AI to /do:commit with the diff
```

### Example 2: Refactoring Existing Code

```bash
# 1. Review the code first
# Paste code to AI and use:
/review:code

# 2. Refactor the entire file
/refactor:file 'src/app/login/page.tsx'

# 3. Compare and apply changes
```

### Example 3: Understanding a Feature

```bash
# Ask about how something works
/explain 'How does the authentication flow work in this app?'
```

## 🎓 Best Practices

### ✅ DO

- Write a comprehensive `docs/source/srs.md` before starting
- Create feature plans before generating code
- Use Server Components by default
- Follow the file structure in `structure_template.md`
- Review generated code with `/review:code`
- Update context files when establishing new patterns

### ❌ DON'T

- Generate code without a feature plan
- Use `'use client'` without a valid reason
- Put business logic in API routes (use services)
- Use `any` type in TypeScript
- Manually edit Drizzle migration files
- Skip the planning phase

## 🔧 Customization

### Adding New Commands

1. Create a documentation file in `.agent/commands/`
2. Define the command structure and usage:

   ```markdown
   # Command: /command:name

   ## Purpose

   What this command does

   ## Usage

   Your detailed instructions here with {{args}} placeholder
   ```

### Adding New Context Files

1. Create a `.md` file in `.agent/contexts/`
2. Document your standards and patterns
3. Reference it in command prompts

### Modifying Standards

1. Update the relevant context file (e.g., `contexts/typescript.md`)
2. The AI will automatically follow the new standards
3. Use `/refactor:file` to update existing code

## 📊 Benefits

- **🎯 Consistency:** All code follows the same standards
- **⚡ Speed:** Generate production-ready code quickly
- **📚 Documentation:** Plans and features are self-documenting
- **🔍 Quality:** Built-in review and refactoring workflow
- **🧠 Context:** AI always has full project context
- **🔄 Iterative:** Easy to refactor and improve

## 🤝 Contributing

This is a personal workflow template. Feel free to:

- Fork and customize for your needs
- Share improvements
- Adapt to other frameworks or languages

## 📝 License

MIT License - Use however you want!

## 🙏 Credits

Built for use with:

- AI Agents (Claude, ChatGPT, Gemini, GitHub Copilot, etc.)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team)

---

**Need help?** Read `AGENT.md` for the complete AI assistant prompt, or `QUICK_REFERENCE.md` for a command cheat sheet.

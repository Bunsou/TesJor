# AI Agent Workflow - Quick Reference

## 📋 Available Commands

### Planning Commands

- `/plan:prd "Topic"` - Generate a Product Requirements Document
- `/plan:feature "Description"` - Create a technical feature plan

### Execution Commands

- `/do:component "feat-file.md"` - Generate a React component
- `/do:api-route "feat-file.md"` - Create an API route handler
- `/do:db "Description"` - Design database schema and queries
- `/do:test "file-path"` - Write tests for a component or API
- `/do:commit` - Generate conventional commit message

### Refactoring Commands

- `/refactor:code` - Refactor code block to standards
- `/refactor:file "path"` - Refactor entire file to standards

### Review Commands

- `/review:code` - Review code for issues and improvements

### Utility Commands

- `/explain "Question"` - Explain how features or code works

---

## 📂 File Structure

```
project/
├── docs/
│   ├── source/
│   │   └── srs.md              # Master plan (Source of Truth)
│   ├── prd/
│   │   └── prd-XXX-topic.md    # Product Requirements Documents
│   └── features/
│       └── feat-XXX-name.md    # Technical Feature Plans
│
├── .agent/
│   ├── contexts/               # Standards & Rules
│   │   ├── structure_template.md  # File organization
│   │   ├── typescript.md          # TypeScript standards
│   │   ├── nextjs.md             # Next.js patterns
│   │   ├── api.md                # API route standards
│   │   ├── tailwind.md           # Tailwind v4 standards
│   │   └── database.md           # Database & ORM standards
│   │
│   └── commands/               # Command Definitions
│       ├── plan/
│       ├── do/
│       ├── refactor/
│       ├── review/
│       └── explain.toml
```

---

## 🔄 Typical Workflow

### 1. Initial Planning

```bash
# Start with the master plan
vim docs/source/srs.md

# Generate PRD for a major feature area
/plan:prd "User Authentication System"
# Save output to: docs/prd/prd-001-authentication.md
```

### 2. Feature Planning

```bash
# Create detailed technical plans
/plan:feature "Google OAuth login (relates to prd-001)"
# Save output to: docs/features/feat-001-google-oauth.md
```

### 3. Implementation

```bash
# Build the components
/do:component "docs/features/feat-001-google-oauth.md"

# Build the API routes
/do:api-route "docs/features/feat-001-google-oauth.md"

# Create database schema if needed
/do:db "User authentication tables from feat-001"
```

### 4. Testing

```bash
# Write tests
/do:test "src/app/api/auth/google/route.ts"
```

### 5. Review & Refactor

```bash
# Review code
/review:code <paste code or file path>

# Refactor if needed
/refactor:file "src/app/login/components/google-button.tsx"
```

### 6. Commit

```bash
# Stage changes
git add .

# Generate commit message
git diff --staged | /do:commit
```

---

## 🎯 Best Practices

### Before Starting

1. ✅ Write your `docs/source/srs.md` (master plan)
2. ✅ Review all context files in `.agent/contexts/`
3. ✅ Ensure AI Agent (Gemini CLI optional) is properly configured

### When Planning

1. Start broad (PRD) → Get specific (Feature)
2. Reference existing PRDs in feature plans
3. Save all plans as markdown files

### When Coding

1. Always reference a feature file
2. Let AI read the contexts - don't repeat them
3. Review generated code before committing

### When Refactoring

1. Use `/review:code` first to identify issues
2. Then use `/refactor:code` or `/refactor:file`
3. Compare before/after changes

---

## 🔍 Context Files Purpose

| File                    | Purpose                  | Used By             |
| ----------------------- | ------------------------ | ------------------- |
| `structure_template.md` | File/folder organization | All commands        |
| `typescript.md`         | Type safety rules        | Component, API, DB  |
| `nextjs.md`             | React/Next.js patterns   | Component, Refactor |
| `api.md`                | API route standards      | API routes          |
| `tailwind.md`           | Styling with v4          | Component, Refactor |
| `database.md`           | DB schema & queries      | DB, API routes      |

---

## 💡 Tips

- **Always provide context:** Reference feature files, not just descriptions
- **Trust the workflow:** Don't skip the planning phase
- **Review before commit:** Use `/review:code` frequently
- **Keep contexts updated:** When you establish new patterns, update context files
- **Use semantic commit messages:** `/do:commit` follows Conventional Commits

---

## 🚨 Common Mistakes to Avoid

❌ Asking AI to generate code without a feature file  
✅ Create feature plan first, then generate code

❌ Manually writing standards in prompts  
✅ Update context files, let AI read them

❌ Skipping the review step  
✅ Use `/review:code` before committing

❌ Creating components without knowing Server vs Client needs  
✅ Let AI decide based on feature requirements and Next.js standards

---

## 📚 Learning Resources

- [AI Agent (Gemini CLI optional) Docs](https://github.com/google/generative-ai-docs)
- [Next.js 14+ Docs](https://nextjs.org/docs)
- [Tailwind v4 Docs](https://tailwindcss.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)

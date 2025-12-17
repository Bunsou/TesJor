````markdown
# ## Debugging & Code Cleanup Standards

This document defines the debugging practices and legacy code cleanup standards.

---

## 1. Debugging Console Logs

When debugging issues, you MUST:

1. **Be specific about what logs are needed** - Never say "check the console" or "expand the Object"
2. **Add targeted console.log statements** with clear labels showing exactly what values to look for
3. **Tell the user the exact log line to find** (e.g., "[ComponentName] State: ...")
4. **List the specific properties needed** from any objects (e.g., "I need: isLoading, hasCurrentImage, isInputDisabled")
5. **Add temporary debug logging** that outputs the exact data structure needed to diagnose the issue

### Good Debugging Example

```typescript
console.log("[DEBUG] Input state:", {
  isDisabled: isInputDisabled,
  isLoading: isLoading,
  hasImage: hasCurrentImage,
});
```
````

Then tell user: **"Look for the line that says '[DEBUG] Input state:' and tell me the values of isDisabled, isLoading, and hasImage"**

### ❌ NEVER Ask User To:

- "Check the console for errors"
- "Expand the Object"
- "Look at the console output"
- "See what's in the console"

### ✅ ALWAYS:

- Add specific logging code with clear labels
- Tell them the exact log label to find (e.g., `[DEBUG] ComponentName:`)
- List the exact properties you need to see
- Use descriptive prefixes like `[DEBUG]`, `[ERROR]`, `[WARN]`

---

## 2. Console Log Cost Convention

**Rule:** Use prefixes to identify billed operations vs. free local operations.

| Prefix   | Meaning                                              | Examples                                    |
| -------- | ---------------------------------------------------- | ------------------------------------------- |
| `(IS $)` | Calls Firebase/Google/external servers (costs money) | Firestore reads, Cloud Functions, API calls |
| `(NO $)` | Runs locally in the browser (free)                   | React state, IndexedDB, localStorage        |

### Example Usage

```typescript
// Firestore operation (billed)
console.log("(IS $) [UserService] Fetching user from Firestore:", userId);

// Local operation (free)
console.log("(NO $) [UserService] Reading from IndexedDB cache:", userId);

// React state update (free)
console.log("(NO $) [UserProfile] State update:", { isLoading, userData });
```

**Rationale:** Instantly identify which operations cost money during debugging sessions.

---

## 3. Legacy Code Cleanup

When implementing new features or making changes, you MUST:

1. **Always delete legacy code** - Don't leave old code paths "just in case"
2. **Remove backward compatibility** - If migrating to a new pattern, remove the old pattern completely
3. **Delete unused imports** - Remove any type imports or dependencies that are no longer used
4. **Clean up comments** - Remove "backward compat", "legacy", or "deprecated" comments referring to deleted code
5. **No fallback logic** - Avoid `oldPattern ?? newPattern` - choose one and commit

### ❌ BAD (Legacy Cruft)

```typescript
// Legacy support - remove after migration
const data = newService.getData() ?? oldService.getData();

// Backward compat for old API
import { OldType, NewType } from "./types";
```

### ✅ GOOD (Clean Break)

```typescript
const data = newService.getData();

import { NewType } from "./types";
```

**Rationale:** Legacy code creates bugs, confusion, and maintenance burden. Clean breaks are better than dual-system support.

---

## 4. Development Phase Convention

Follow this pattern and **always tell the user which step you are on:**

| Phase                | Focus                      | Description                                          |
| -------------------- | -------------------------- | ---------------------------------------------------- |
| **1. Make it work**  | Fix the bug/logic          | Get the feature functioning correctly                |
| **2. Make it right** | Clean up code/architecture | Refactor, remove legacy code, improve structure      |
| **3. Make it fast**  | Optimize/Cache             | Add performance optimizations, caching, lazy loading |

### Example Communication

> "We're currently on **Step 1: Make it work** - I'm fixing the input disabled state logic."

> "Now moving to **Step 2: Make it right** - Cleaning up the legacy fallback code and unused imports."

> "Finally, **Step 3: Make it fast** - Adding memoization to prevent unnecessary re-renders."

---

## 5. Debug Log Naming Conventions

Use consistent prefixes for easy filtering:

| Prefix            | Use Case                                   |
| ----------------- | ------------------------------------------ |
| `[DEBUG]`         | Temporary debugging (remove before commit) |
| `[ComponentName]` | Component-specific logging                 |
| `[ServiceName]`   | Service/API layer logging                  |
| `[ERROR]`         | Error conditions                           |
| `[WARN]`          | Warning conditions                         |
| `[INFO]`          | Informational (production-safe)            |

### Example

```typescript
// Temporary debug log (remove before commit)
console.log("[DEBUG] [ChatInput] Props:", { isDisabled, placeholder, value });

// Permanent error log (keep in production)
console.error("[ERROR] [AuthService] Failed to authenticate:", error.message);
```

---

## Quick Reference

### Debugging Checklist

- [ ] Added console.log with clear `[LABEL]` prefix
- [ ] Specified exact properties to look for
- [ ] Told user the exact log line to find
- [ ] Included `(IS $)` or `(NO $)` for server/local operations
- [ ] Stated which development phase we're in

### Legacy Cleanup Checklist

- [ ] Deleted old code paths (no "just in case")
- [ ] Removed unused imports
- [ ] Removed backward compatibility fallbacks
- [ ] Cleaned up legacy/deprecated comments
- [ ] No `oldValue ?? newValue` patterns

```

```

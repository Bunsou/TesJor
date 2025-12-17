# ## TypeScript Coding Standards

This document defines the strict TypeScript standards for this project. All generated code MUST adhere to these rules.

## 1. Strict Mode & `any`

- **Strict Mode:** All code must be compatible with `"strict": true` in `tsconfig.json`.
- **No `any`:** The `any` type is strictly forbidden.
  - If a type is truly unknown, use `unknown` and perform type-checking.
  - For 3rd-party libraries without types, you must write a basic `d.ts` declaration file or use `zod` to parse the object.
- **No Implicit `any`:** `noImplicitAny` must be enabled and respected.

## 2. Type vs. Interface

- **Prefer `interface` for object shapes:** When defining object structures, props, or data models, prefer `interface` for better error messages and extensibility.
  - `interface UserProps { id: string; name: string; }`
  - `interface User { name: string; age: number; }`
- **Use `type` for unions, intersections, and primitives:** Use `type` for complex type operations, utility types, and non-object types.
  - `type Status = 'pending' | 'success' | 'error';`
  - `type ID = string | number;`
  - `type UserWithTimestamps = User & Timestamps;`
- **Flexible Rule:** Both are acceptable, but `interface` is preferred for object definitions due to better TypeScript error messages and declaration merging capabilities.

## 3. Naming Conventions

- **Types/Interfaces:** PascalCase. (e.g., `type UserProfile`, `interface AuthProps`).
  - **Note:** Avoid prefixing interfaces with "I" (use `AuthProps` not `IAuthProps`).
- **Variables/Functions:** camelCase. (e.g., `const userData`, `function getUser()`).
- **Boolean Variables:** Use auxiliary verbs for clarity (e.g., `isLoading`, `hasError`, `canSubmit`, `shouldUpdate`).
  - ✅ **GOOD:** `const isLoading = true;`, `const hasPermission = false;`
  - ❌ **BAD:** `const loading = true;`, `const permission = false;`
- **File Names:** kebab-case. (e.g., `user-profile.tsx`, `auth.service.ts`).
- **Directories:** lowercase-with-dashes (e.g., `auth-wizard/`, `user-profile/`, `product-list/`).

## 4. Function Signatures

- Always provide explicit types for function parameters.
- Always provide an explicit return type for functions, _especially_ for exported functions. This prevents a change in implementation from accidentally breaking a public contract.
  - **BAD:** `export const getUser = (id: string) => db.users.find(id);`
  - **GOOD:** `export const getUser = (id: string): User | undefined => db.users.find(id);`

## 5. Non-Null Assertions

- The non-null assertion operator (`!`) is strictly forbidden.
- If an object might be null or undefined, you MUST check for its existence before accessing its properties.
  - **BAD:** `const name = user!.name;`
  - **GOOD:** `if (!user) { throw new Error("User not found"); } const name = user.name;`

## 6. Enums vs. Objects

- **Avoid `enum`:** TypeScript enums have runtime overhead and can cause bundling issues. Use const objects with `as const` assertion instead.
- **Use const objects with `as const`:** This provides type safety without runtime code.
  - **BAD (enum):**
    ```typescript
    enum Status {
      Pending = "pending",
      Success = "success",
      Error = "error",
    }
    ```
  - **GOOD (const object):**

    ```typescript
    const Status = {
      Pending: "pending",
      Success: "success",
      Error: "error",
    } as const;

    type Status = (typeof Status)[keyof typeof Status];
    // Usage: let status: Status = Status.Pending;
    ```
- **Use maps for key-value associations:**
  - **GOOD:**
    ```typescript
    const StatusLabels = new Map([
      ["pending", "In Progress"],
      ["success", "Completed"],
      ["error", "Failed"],
    ]);
    ```

## 7. Function Declaration Style

- **Use `function` keyword for pure functions:** Improves stack traces and hoisting behavior.
  - **GOOD:**
    ```typescript
    function calculateTotal(items: Item[]): number {
      return items.reduce((sum, item) => sum + item.price, 0);
    }
    ```
  - **ACCEPTABLE (arrow for callbacks/props):**
    ```typescript
    const handleClick = (event: MouseEvent) => {
      console.log(event);
    };
    ```
- **Use arrow functions for:** Callbacks, array methods, and component props.
- **Use `function` keyword for:** Top-level functions, utilities, and service methods.

```

```

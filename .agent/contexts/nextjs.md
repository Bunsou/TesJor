# ## Next.js 14+ (App Router) Standards

This document defines the strict coding standards for all Next.js components and file structures.

## 1. App Router is Standard

- All routes, UI, and APIs MUST be built using the App Router (`src/app/`). The `pages/` directory is not used.
- All file names MUST follow the App Router conventions:
  - `page.tsx`: The main page UI.
  - `layout.tsx`: The layout for a segment and its children.
  - `loading.tsx`: A loading UI using React Suspense.
  - `error.tsx`: An error UI for a segment.
  - `route.ts`: API endpoints.

## 2. Server Components First (Default)

- All components MUST be **Server Components by default**.
- You MUST NOT add `'use client'` to a component unless it is _absolutely necessary_.
- **Valid reasons for `'use client'`:**
  1.  Using React hooks (`useState`, `useEffect`, `useContext`, etc.).
  2.  Using event listeners (`onClick`, `onChange`, etc.).
  3.  Accessing browser-only APIs (`window`, `localStorage`).

## 3. Component Structure

- **Keep Client Components Small:** When you must use a Client Component, keep it as small and specific as possible.
- **Pattern: Pass Server Components as Props:**

  - Do _not_ import a Server Component into a Client Component.
  - Instead, pass the Server Component as `children` or a `prop` to the Client Component from a parent Server Component.
  - **BAD (Client Component):**
    ```tsx
    "use client";
    import ServerIcon from "./server-icon"; // <-- This is not allowed!
    export default function ClientButton() {
      return (
        <button>
          <ServerIcon />
        </button>
      );
    }
    ```
  - **GOOD (Server Component Wrapper):**

    ```tsx
    // app/page.tsx (Server)
    import ClientButton from "./client-button";
    import ServerIcon from "./server-icon";
    export default function Page() {
      return <ClientButton icon={<ServerIcon />} />;
    }

    // client-button.tsx (Client)
    ("use client");
    export default function ClientButton({ icon }: { icon: React.ReactNode }) {
      return <button>{icon}</button>;
    }
    ```

## 4. Data Fetching

- All server-side data fetching MUST be done in Server Components using `async/await`.
- Use the native `fetch` API, as Next.js automatically memoizes (caches) it.
- **Example (Server Component):**

  ```tsx
  async function getPost(id: string) {
    const res = await fetch(`httpsax://.../posts/${id}`);
    return res.json();
  }

  export default async function PostPage({
    params,
  }: {
    params: { id: string };
  }) {
    const post = await getPost(params.id);
    return <div>{post.title}</div>;
  }
  ```

## 5. Component File Structure

- Components MUST follow a consistent 5-part structure for readability:

  1. **Component definition** (main component)
  2. **Sub-components** (related child components)
  3. **Helper functions** (utilities specific to this component)
  4. **Static content** (constants, configurations)
  5. **Types** (TypeScript interfaces/types)

- **Example:**

  ```tsx
  // 1. Component definition
  export function ProductCard({ product }: ProductCardProps) {
    const discount = calculateDiscount(product.price, product.salePrice);

    return (
      <Card>
        <ProductImage src={product.image} />
        <ProductInfo product={product} discount={discount} />
      </Card>
    );
  }

  // 2. Sub-components
  function ProductImage({ src }: { src: string }) {
    return <img src={src} alt="Product" />;
  }

  function ProductInfo({ product, discount }: ProductInfoProps) {
    return (
      <div>
        <h3>{product.name}</h3>
        {discount > 0 && <Badge>{discount}% off</Badge>}
      </div>
    );
  }

  // 3. Helper functions
  function calculateDiscount(price: number, salePrice?: number): number {
    if (!salePrice) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  }

  // 4. Static content
  const DEFAULT_IMAGE = "/placeholder.png";
  const BADGE_STYLES = "bg-red-500 text-white px-2 py-1";

  // 5. Types
  interface ProductCardProps {
    product: Product;
  }

  interface ProductInfoProps {
    product: Product;
    discount: number;
  }
  ```

## 6. Performance Optimization

### Server Components First Strategy

- **Default to Server Components:** Start with Server Components and only use `'use client'` when absolutely necessary.
- **Decision Matrix for `'use client'`:**
  - ✅ **Needs hooks** (`useState`, `useEffect`, `useContext`) → Client Component
  - ✅ **Needs event handlers** (`onClick`, `onChange`) → Client Component
  - ✅ **Needs browser APIs** (`window`, `localStorage`) → Client Component
  - ❌ **Only displays data** → Server Component
  - ❌ **Only renders children** → Server Component
  - ❌ **Static content** → Server Component

### Minimize `useEffect` and `useState`

- Avoid `useEffect` for data fetching. Use Server Components with `async/await` instead.
- Avoid `useState` for derived values. Use computed values instead.
- **BAD (Client Component with useEffect):**
  ```tsx
  "use client";
  export function UserProfile({ userId }: { userId: string }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
      fetch(`/api/users/${userId}`)
        .then((res) => res.json())
        .then(setUser);
    }, [userId]);

    return <div>{user?.name}</div>;
  }
  ```
- **GOOD (Server Component with async/await):**

  ```tsx
  async function getUser(userId: string) {
    const res = await fetch(`/api/users/${userId}`);
    return res.json();
  }

  export async function UserProfile({ userId }: { userId: string }) {
    const user = await getUser(userId);
    return <div>{user.name}</div>;
  }
  ```

### Dynamic Imports for Non-Critical Components

- Use `next/dynamic` to lazy-load components that are not immediately visible.
- This reduces initial bundle size and improves load times.
- **Example:**

  ```tsx
  import dynamic from "next/dynamic";

  const HeavyChart = dynamic(() => import("./heavy-chart"), {
    loading: () => <div>Loading chart...</div>,
    ssr: false, // Disable SSR if component uses browser APIs
  });

  export function Dashboard() {
    return (
      <div>
        <h1>Dashboard</h1>
        <HeavyChart />
      </div>
    );
  }
  ```

### Suspense Boundaries

- Wrap Client Components in `<Suspense>` boundaries to prevent blocking the entire page.
- This allows other parts of the page to render while the Client Component loads.
- **Example:**

  ```tsx
  import { Suspense } from "react";
  import ClientWidget from "./client-widget";

  export default function Page() {
    return (
      <div>
        <h1>Page Title</h1>
        <Suspense fallback={<div>Loading widget...</div>}>
          <ClientWidget />
        </Suspense>
      </div>
    );
  }
  ```

## 7. URL State Management (nuqs)

- **Recommended (not mandatory):** Use the `nuqs` library for managing state in the URL (query parameters).
- **Benefits:** Type-safe URL state, automatic syncing with browser history, SSR-compatible.
- **Installation:**
  ```bash
  npm install nuqs
  ```
- **Usage Example:**

  ```tsx
  "use client";
  import { useQueryState, parseAsString, parseAsInteger } from "nuqs";

  export function SearchFilters() {
    const [search, setSearch] = useQueryState("q", parseAsString);
    const [page, setPage] = useQueryState(
      "page",
      parseAsInteger.withDefault(1)
    );

    return (
      <div>
        <input
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
        <div>Page: {page}</div>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    );
  }
  ```

## 8. Web Vitals Optimization

- Monitor and optimize Core Web Vitals: **LCP**, **CLS**, **FID**.
- **Target Metrics:**
  - **LCP (Largest Contentful Paint):** < 2.5 seconds
  - **CLS (Cumulative Layout Shift):** < 0.1
  - **FID (First Input Delay):** < 100 milliseconds

### LCP Optimization Strategies

- Use `next/image` for automatic image optimization (WebP format, lazy loading).
- Preload critical resources:

  ```tsx
  import { Metadata } from "next";

  export const metadata: Metadata = {
    other: {
      preload: "/hero-image.jpg",
    },
  };
  ```

- Use Server Components for above-the-fold content.

### CLS Optimization Strategies

- Always specify `width` and `height` for images:

  ```tsx
  import Image from "next/image";

  <Image src="/hero.jpg" alt="Hero" width={800} height={600} />;
  ```

- Avoid injecting content above existing content after page load.
- Reserve space for dynamic content with skeleton loaders.

### FID Optimization Strategies

- Minimize JavaScript bundle size with dynamic imports.
- Use Web Workers for heavy computations.
- Defer non-critical JavaScript with `next/script`:

  ```tsx
  import Script from "next/script";

  <Script src="/analytics.js" strategy="lazyOnload" />;
  ```

## 9. Syntax Best Practices

### Concise Conditionals

- Use concise conditional syntax for readability.
- **GOOD:**
  ```tsx
  {
    isLoading && <Spinner />;
  }
  {
    error && <ErrorMessage error={error} />;
  }
  {
    user ? <UserProfile user={user} /> : <LoginPrompt />;
  }
  ```
- **AVOID (verbose):**
  ```tsx
  {
    isLoading === true ? <Spinner /> : null;
  }
  {
    error !== null && error !== undefined ? (
      <ErrorMessage error={error} />
    ) : null;
  }
  ```

### Declarative JSX

- Keep JSX declarative and avoid imperative logic.
- **BAD (imperative):**
  ```tsx
  function ProductList({ products }: { products: Product[] }) {
    const elements = [];
    for (let i = 0; i < products.length; i++) {
      elements.push(<ProductCard key={i} product={products[i]} />);
    }
    return <div>{elements}</div>;
  }
  ```
- **GOOD (declarative):**
  ```tsx
  function ProductList({ products }: { products: Product[] }) {
    return (
      <div>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }
  ```

```

```

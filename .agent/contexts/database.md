````markdown
# ## Database & ORM Standards

This document defines the strict standards for database operations in this project.

## 1. Database Client Setup

- Use **Drizzle ORM** as the database client.
- The database client MUST be initialized in `src/server/db/client.ts`.
- Use a singleton pattern to prevent multiple instances in development.

**Example `src/server/db/client.ts`:**

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(process.env.DATABASE_URL!);
if (process.env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
```

## 2. Schema Design Standards

- The Drizzle schema MUST be in `src/server/db/schema.ts`.
- All tables MUST use:
  - `id` as the primary key (use `uuid` or `serial` for auto-increment)
  - `createdAt` timestamp with default `now()`
  - `updatedAt` timestamp with automatic updates
- Export all tables and relations from `schema.ts`.

**Example Schema:**

```typescript
// src/server/db/schema.ts
import { pgTable, text, timestamp, pgEnum, uuid, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['USER', 'ADMIN']);

// Tables
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  password: text('password').notNull(),
  role: roleEnum('role').default('USER').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().\$onUpdate(() => new Date()),
});

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  published: boolean('published').default(false).notNull(),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().\$onUpdate(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

// Types (inferred from schema)
export type User = typeof users.\$inferSelect;
export type NewUser = typeof users.\$inferInsert;
export type Post = typeof posts.\$inferSelect;
export type NewPost = typeof posts.\$inferInsert;
```

## 3. Query Organization

- All reusable database queries MUST be in `src/server/db/queries/`.
- Organize queries by resource (e.g., `users.ts`, `posts.ts`).
- Export query functions from each file.
- All queries MUST have explicit return types.

**Example `src/server/db/queries/users.ts`:**

```typescript
import { eq } from 'drizzle-orm';
import { db } from '@/server/db/client';
import { users } from '@/server/db/schema';
import type { User, NewUser } from '@/server/db/schema';

export async function findUserById(id: string): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function createUser(data: NewUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function updateUser(
  id: string,
  data: Partial<NewUser>
): Promise<User> {
  const [user] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id));
}

export async function listUsers(limit = 10, offset = 0): Promise<User[]> {
  return await db.query.users.findMany({
    limit,
    offset,
  });
}
```

## 4. Type Safety

- MUST use Drizzle's inferred types (e.g., `User`, `NewUser` from `\$inferSelect` and `\$inferInsert`).
- NEVER use `any` for database types.
- For custom queries with partial selects, define the return type explicitly.

**Example with custom select:**

```typescript
import { db } from '@/server/db/client';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import type { User } from '@/server/db/schema';

// Define a type for public user (without password)
export type UserPublic = Omit<User, 'password'>;

export async function findUserPublic(id: string): Promise<UserPublic | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
}
```

## 5. Error Handling

- Database errors MUST be caught and converted to application errors.
- Use custom error classes from `src/server/utils/error.ts`.

**Example:**

```typescript
import { eq } from 'drizzle-orm';
import { NotFoundError, BadRequestError } from '@/server/utils/error';
import { db } from '@/server/db/client';
import { users } from '@/server/db/schema';
import type { User } from '@/server/db/schema';

export async function findUserById(id: string): Promise<User> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  } catch (error) {
    if (error instanceof Error && error.message.includes('duplicate key')) {
      throw new BadRequestError('User with this email already exists');
    }
    throw error;
  }
}
```

## 6. Transactions

- Use Drizzle transactions for operations that must be atomic.
- Use the `db.transaction()` method for complex operations.

**Example:**

```typescript
import { db } from '@/server/db/client';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function transferCredits(
  fromUserId: string,
  toUserId: string,
  amount: number
): Promise<void> {
  await db.transaction(async (tx) => {
    const sender = await tx.query.users.findFirst({
      where: eq(users.id, fromUserId),
    });

    if (!sender || sender.credits < amount) {
      throw new Error('Insufficient credits');
    }

    await tx
      .update(users)
      .set({ credits: sender.credits - amount })
      .where(eq(users.id, fromUserId));

    const receiver = await tx.query.users.findFirst({
      where: eq(users.id, toUserId),
    });

    if (!receiver) {
      throw new Error('Receiver not found');
    }

    await tx
      .update(users)
      .set({ credits: receiver.credits + amount })
      .where(eq(users.id, toUserId));
  });
}
```

## 7. Seeding

- Database seeds MUST be in `src/server/db/seed.ts`.
- Use TypeScript for the seed file.
- Add seed script to `package.json`: `"db:seed": "tsx src/server/db/seed.ts"`

**Example `src/server/db/seed.ts`:**

```typescript
import { db } from './client';
import { users } from './schema';
import { hash } from 'bcrypt';

async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await hash('admin123', 10);

  await db.insert(users).values({
    email: 'admin@example.com',
    name: 'Admin User',
    password: adminPassword,
    role: 'ADMIN',
  }).onConflictDoNothing();

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
```

## 8. Migrations

- Use Drizzle Kit for schema changes and migrations.
- Always create descriptive migration names.
- Store migrations in `drizzle/` directory.

**Configuration (`drizzle.config.ts` in project root):**

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

**Commands:**

```bash
# Generate migration from schema changes
npx drizzle-kit generate:pg

# Apply migrations (push to database)
npx drizzle-kit push:pg

# View your database in Drizzle Studio
npx drizzle-kit studio

# Drop everything and push schema (dev only - DANGEROUS)
npx drizzle-kit push:pg --force
```

## 9. Drizzle Studio

- Use Drizzle Studio for visual database exploration.
- Access at `https://local.drizzle.studio` after running `drizzle-kit studio`.

**Launch Drizzle Studio:**

```bash
npx drizzle-kit studio
```

## 10. Query Patterns

### Basic Queries

```typescript
import { eq, and, or, like, gt, gte, lt, lte } from 'drizzle-orm';

// Find one
const user = await db.query.users.findFirst({
  where: eq(users.email, 'user@example.com'),
});

// Find many
const activeUsers = await db.query.users.findMany({
  where: eq(users.active, true),
  limit: 10,
  offset: 0,
});

// With relations
const userWithPosts = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    posts: true,
  },
});

// Complex where
const results = await db.query.users.findMany({
  where: and(
    eq(users.role, 'ADMIN'),
    or(
      like(users.name, '%john%'),
      like(users.email, '%@admin.com')
    )
  ),
});
```

### Insert, Update, Delete

```typescript
// Insert one
const [newUser] = await db.insert(users).values({
  email: 'user@example.com',
  name: 'John Doe',
  password: hashedPassword,
}).returning();

// Insert multiple
await db.insert(users).values([
  { email: 'user1@example.com', name: 'User 1', password: '...' },
  { email: 'user2@example.com', name: 'User 2', password: '...' },
]);

// Update
const [updated] = await db
  .update(users)
  .set({ name: 'New Name' })
  .where(eq(users.id, userId))
  .returning();

// Delete
await db.delete(users).where(eq(users.id, userId));
```

### Joins and Aggregations

```typescript
import { count, sum, avg } from 'drizzle-orm';

// Manual join
const results = await db
  .select({
    user: users,
    postCount: count(posts.id),
  })
  .from(users)
  .leftJoin(posts, eq(users.id, posts.authorId))
  .groupBy(users.id);

// Using relations (preferred)
const userWithPostCount = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    posts: {
      columns: { id: true },
    },
  },
});
```
````

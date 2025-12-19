import { NextRequest } from "next/server";
import { auth } from "@/server/services/auth/auth.service";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "@/shared/utils/error-handler";

// Get current session
export async function getSession(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return session;
}

// Require authentication
export async function requireAuth(req: NextRequest) {
  const session = await getSession(req);

  if (!session?.user) {
    throw new AppError("UNAUTHORIZED", "Authentication required");
  }

  return session;
}

// Require admin role
export async function requireAdmin(req: NextRequest) {
  const session = await requireAuth(req);

  // Get user from database to check role
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user || user.role !== "admin") {
    throw new AppError("ADMIN_REQUIRED", "Admin access required");
  }

  return { session, user };
}

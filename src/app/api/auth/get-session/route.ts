import { NextRequest } from "next/server";
import { asyncHandler, getSession } from "@/server/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const GET = asyncHandler(async (request: NextRequest) => {
  // Get session using Better Auth
  const session = await getSession(request);

  if (!session) {
    return sendSuccessResponse({ session: null });
  }

  // Fetch user data from database
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      image: users.image,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) {
    return sendSuccessResponse({ session: null });
  }

  // Return session with full user data
  return sendSuccessResponse({
    session: {
      ...session,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      },
    },
  });
});

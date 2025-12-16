import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Get session using Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return Response.json({ session: null }, { status: 200 });
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
      return Response.json({ session: null }, { status: 200 });
    }

    // Return session with full user data
    return Response.json(
      {
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
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching session:", error);
    return Response.json({ session: null }, { status: 200 });
  }
}

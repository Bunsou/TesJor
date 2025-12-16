import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "./auth";

const f = createUploadthing();

export const uploadRouter = {
  contentImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // Check if user is authenticated and is admin
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user) {
        throw new Error("Unauthorized - Please sign in");
      }

      // Get user from database to check role
      const { db } = await import("@/db");
      const { users } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized - Admin access required");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

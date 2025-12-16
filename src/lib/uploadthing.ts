import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "./auth";
import type { Session } from "./auth";

const f = createUploadthing();

export const uploadRouter = {
  contentImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // Check if user is authenticated and is admin
      const session = (await auth.api.getSession({
        headers: req.headers,
      })) as Session | null;

      const userRole = session?.user
        ? (session.user as Session["user"]).role
        : undefined;

      if (!session?.user || userRole !== "admin") {
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

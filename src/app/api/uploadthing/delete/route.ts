import { NextRequest } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    // Extract file key from URL
    const fileKey = url.split("/").pop();

    if (!fileKey) {
      return Response.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Delete file from UploadThing
    await utapi.deleteFiles(fileKey);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete file:", error);
    return Response.json({ error: "Failed to delete file" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, publicId } = body;

    if (!url && !publicId) {
      return NextResponse.json(
        { error: "URL or publicId is required" },
        { status: 400 }
      );
    }

    // Extract public ID from URL if not provided
    let idToDelete = publicId;
    if (!idToDelete && url) {
      // Extract public ID from Cloudinary URL
      // Example: https://res.cloudinary.com/cloud/image/upload/v123456/tesjor/image.jpg
      const urlParts = url.split("/");
      const uploadIndex = urlParts.indexOf("upload");
      if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
        // Get everything after /upload/v123456/
        const pathParts = urlParts.slice(uploadIndex + 2);
        // Remove file extension
        const lastPart = pathParts[pathParts.length - 1];
        pathParts[pathParts.length - 1] = lastPart.split(".")[0];
        idToDelete = pathParts.join("/");
      }
    }

    if (!idToDelete) {
      return NextResponse.json(
        { error: "Could not extract public ID from URL" },
        { status: 400 }
      );
    }

    // Delete file from Cloudinary
    await cloudinary.uploader.destroy(idToDelete);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}

import { v2 as cloudinary } from "cloudinary";
import { config } from "@/shared/config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

// Upload file to Cloudinary
export async function uploadFile(
  base64File: string,
  folder: string = "tesjor"
) {
  const result = await cloudinary.uploader.upload(base64File, {
    folder,
    resource_type: "auto",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

// Delete file from Cloudinary
export async function deleteFile(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

// Extract public ID from Cloudinary URL
export function extractPublicId(url: string): string | null {
  // Example: https://res.cloudinary.com/cloud/image/upload/v123456/tesjor/image.jpg
  const urlParts = url.split("/");
  const uploadIndex = urlParts.indexOf("upload");

  if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
    // Get everything after /upload/v123456/
    const pathParts = urlParts.slice(uploadIndex + 2);
    // Remove file extension
    const lastPart = pathParts[pathParts.length - 1];
    pathParts[pathParts.length - 1] = lastPart.split(".")[0];
    return pathParts.join("/");
  }

  return null;
}

export { cloudinary };

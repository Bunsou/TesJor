"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleRemove = async () => {
    if (value) {
      try {
        // Call delete endpoint
        await fetch("/api/uploadthing/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
      onChange("");
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <UploadButton<OurFileRouter, "contentImage">
            endpoint="contentImage"
            onClientUploadComplete={(res) => {
              if (res?.[0]?.url) {
                onChange(res[0].url);
              }
              setIsUploading(false);
            }}
            onUploadError={(error: Error) => {
              alert(`Upload failed: ${error.message}`);
              setIsUploading(false);
            }}
            onUploadBegin={() => {
              setIsUploading(true);
            }}
          />
          {isUploading && (
            <p className="mt-4 text-sm text-foreground-muted">
              Uploading image...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageUpload } from "@/components/shared/ImageUpload";

type FormData = {
  category: string;
  name: string;
  nameKh: string;
  description: string;
  province?: string;
  lat?: string;
  lng?: string;
  priceRange?: string;
  image?: string;
};

async function createContent(data: FormData) {
  const res = await fetch("/api/admin/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create content");
  }
  return res.json();
}

export default function AdminPage() {
  const { session } = useSession();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    category: "",
    name: "",
    nameKh: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const data = await createContent(formData);
      alert(`Successfully created: ${data.item.name}`);
      // Reset form
      setFormData({
        category: "",
        name: "",
        nameKh: "",
        description: "",
      });
      setStep(1);
    } catch (error) {
      alert(
        `Error: ${
          error instanceof Error ? error.message : "Failed to create content"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is admin
  if (session?.user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-foreground-muted">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  const hasLocation =
    formData.category === "place" || formData.category === "event";
  const hasPrice =
    formData.category === "food" ||
    formData.category === "drink" ||
    formData.category === "souvenir";

  const isStep1Valid = formData.category !== "";
  const isStep2Valid =
    formData.name !== "" &&
    formData.nameKh !== "" &&
    formData.description !== "";
  const isStep3Valid =
    !hasLocation || (formData.province && formData.lat && formData.lng);

  const handleSubmitForm = () => {
    if (!isStep2Valid || !isStep3Valid) {
      alert("Please fill in all required fields");
      return;
    }
    handleSubmit();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        </div>
        <p className="text-foreground-muted">
          Create new content for the TesJor app
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                s === step
                  ? "bg-primary text-primary-foreground"
                  : s < step
                  ? "bg-primary/20 text-primary"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {s}
            </div>
            {s < 5 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  s < step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-card rounded-lg border border-border p-6">
        {/* Step 1: Category */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Select Category
              </h2>
              <p className="text-foreground-muted">
                Choose the type of content you want to create
              </p>
            </div>

            <div className="space-y-4">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="place">Place</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="drink">Drink</SelectItem>
                  <SelectItem value="souvenir">Souvenir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                size="lg"
              >
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Basic Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Basic Details
              </h2>
              <p className="text-foreground-muted">
                Enter the name and description
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">English Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Angkor Wat"
                />
              </div>

              <div>
                <Label htmlFor="nameKh">Khmer Name *</Label>
                <Input
                  id="nameKh"
                  value={formData.nameKh}
                  onChange={(e) =>
                    setFormData({ ...formData, nameKh: e.target.value })
                  }
                  placeholder="e.g., អង្គរវត្ត"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter a detailed description..."
                  className="w-full min-h-32 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setStep(1)} variant="outline" size="lg">
                <ChevronLeft className="w-5 h-5 mr-2" /> Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!isStep2Valid}
                size="lg"
              >
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Location & Price */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Additional Details
              </h2>
              <p className="text-foreground-muted">
                {hasLocation
                  ? "Enter location information"
                  : hasPrice
                  ? "Enter price range"
                  : "No additional details needed"}
              </p>
            </div>

            <div className="space-y-4">
              {hasLocation && (
                <>
                  <div>
                    <Label htmlFor="province">Province *</Label>
                    <Input
                      id="province"
                      value={formData.province || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, province: e.target.value })
                      }
                      placeholder="e.g., Siem Reap"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lat">Latitude *</Label>
                      <Input
                        id="lat"
                        value={formData.lat || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, lat: e.target.value })
                        }
                        placeholder="e.g., 13.4125"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lng">Longitude *</Label>
                      <Input
                        id="lng"
                        value={formData.lng || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, lng: e.target.value })
                        }
                        placeholder="e.g., 103.8670"
                      />
                    </div>
                  </div>
                </>
              )}

              {hasPrice && (
                <div>
                  <Label htmlFor="priceRange">Price Range</Label>
                  <Select
                    value={formData.priceRange || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priceRange: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget ($)</SelectItem>
                      <SelectItem value="moderate">Moderate ($$)</SelectItem>
                      <SelectItem value="expensive">Expensive ($$$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!hasLocation && !hasPrice && (
                <p className="text-center text-foreground-muted py-8">
                  No additional details required for this category.
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setStep(2)} variant="outline" size="lg">
                <ChevronLeft className="w-5 h-5 mr-2" /> Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!isStep3Valid}
                size="lg"
              >
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Image Upload */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Upload Image
              </h2>
              <p className="text-foreground-muted">
                Add an image for this content (optional)
              </p>
            </div>

            <div>
              <Label>Image</Label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setStep(3)} variant="outline" size="lg">
                <ChevronLeft className="w-5 h-5 mr-2" /> Back
              </Button>
              <Button onClick={() => setStep(5)} size="lg">
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Review & Submit
              </h2>
              <p className="text-foreground-muted">
                Review your content before submitting
              </p>
            </div>

            <div className="space-y-4 bg-background p-4 rounded-lg">
              <div>
                <p className="text-sm text-foreground-muted">Category</p>
                <p className="font-medium text-foreground capitalize">
                  {formData.category}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-foreground-muted">English Name</p>
                <p className="font-medium text-foreground">{formData.name}</p>
              </div>

              <div>
                <p className="text-sm text-foreground-muted">Khmer Name</p>
                <p className="font-medium text-foreground">{formData.nameKh}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-foreground-muted">Description</p>
                <p className="text-foreground">{formData.description}</p>
              </div>

              {formData.province && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-foreground-muted">Location</p>
                    <p className="font-medium text-foreground">
                      {formData.province}
                    </p>
                    <p className="text-sm text-foreground-muted">
                      {formData.lat}, {formData.lng}
                    </p>
                  </div>
                </>
              )}

              {formData.priceRange && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-foreground-muted">Price Range</p>
                    <p className="font-medium text-foreground capitalize">
                      {formData.priceRange}
                    </p>
                  </div>
                </>
              )}

              {formData.image && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-foreground-muted mb-2">Image</p>
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={formData.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setStep(4)} variant="outline" size="lg">
                <ChevronLeft className="w-5 h-5 mr-2" /> Back
              </Button>
              <Button
                onClick={handleSubmitForm}
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? "Creating..." : "Create Content"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

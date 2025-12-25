"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronRight,
  Save,
  FileText,
  MapPin,
  Image as ImageIcon,
  DollarSign,
  Clock,
  Phone,
  X,
  Plus,
  Star,
  Tag,
  Layers,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { provinces, categories, tags } from "@/constants/constants";
import { AdminMapPicker } from "@/features/admin/components/AdminMapPicker";
import { toast } from "sonner";

interface PriceOption {
  label: string;
  price: string;
}

interface TimeSlot {
  days: string[];
  open: string;
  close: string;
  closed: boolean;
}

export default function CreateCardPage() {
  const [formData, setFormData] = useState({
    titleEn: "",
    titleKh: "",
    description: "",
    category: "",
    province: "",
    tags: ["outdoors", "family-friendly"] as string[],
    xpPoints: "",
    address: "",
    lat: "",
    lng: "",
    mainImage: null as File | null,
    galleryImages: [] as File[],
    priceLevel: "$",
    priceOptions: [{ label: "Entry Fee", price: "5.00" }] as PriceOption[],
    timeSlots: [
      {
        days: ["M", "T", "W", "Th", "F"],
        open: "09:00",
        close: "17:00",
        closed: false,
      },
      { days: ["Sa", "Su"], open: "10:00", close: "16:00", closed: false },
    ] as TimeSlot[],
    phone: "",
    website: "",
    facebook: "",
  });

  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");

  const handleTagAdd = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const addPriceOption = () => {
    setFormData({
      ...formData,
      priceOptions: [...formData.priceOptions, { label: "", price: "" }],
    });
  };

  const removePriceOption = (index: number) => {
    setFormData({
      ...formData,
      priceOptions: formData.priceOptions.filter((_, i) => i !== index),
    });
  };

  const updatePriceOption = (
    index: number,
    field: keyof PriceOption,
    value: string
  ) => {
    const updated = [...formData.priceOptions];
    updated[index][field] = value;
    setFormData({ ...formData, priceOptions: updated });
  };

  // Operating Hours handlers
  const addTimeSlot = () => {
    setFormData({
      ...formData,
      timeSlots: [
        ...formData.timeSlots,
        { days: [], open: "09:00", close: "17:00", closed: false },
      ],
    });
  };

  const removeTimeSlot = (index: number) => {
    setFormData({
      ...formData,
      timeSlots: formData.timeSlots.filter((_, i) => i !== index),
    });
  };

  const toggleDay = (slotIndex: number, day: string) => {
    const updated = [...formData.timeSlots];
    const currentDays = updated[slotIndex].days;

    if (currentDays.includes(day)) {
      updated[slotIndex].days = currentDays.filter((d) => d !== day);
    } else {
      updated[slotIndex].days = [...currentDays, day];
    }

    setFormData({ ...formData, timeSlots: updated });
  };

  const updateTimeSlot = (
    index: number,
    field: keyof TimeSlot,
    value: string | boolean
  ) => {
    const updated = [...formData.timeSlots];
    if (field === "closed") {
      updated[index][field] = value as boolean;
    } else if (field === "open" || field === "close") {
      updated[index][field] = value as string;
    }
    setFormData({ ...formData, timeSlots: updated });
  };

  const handleLocationSelect = (data: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setFormData({
      ...formData,
      lat: data.lat.toString(),
      lng: data.lng.toString(),
      address: data.address,
    });
  };

  const handleClearLocation = () => {
    setFormData({
      ...formData,
      lat: "",
      lng: "",
      address: "",
    });
    toast.success("Location cleared");
  };

  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    // Store file locally
    setFormData((prev) => ({ ...prev, mainImage: file }));
  };

  const handleGalleryImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    if (files.some((file) => !file.type.startsWith("image/"))) {
      toast.error("Please upload only image files");
      return;
    }

    // Validate file sizes
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      toast.error("Each image must be less than 5MB");
      return;
    }

    // Store files locally
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ...files],
    }));
  };

  const handleRemoveMainImage = () => {
    setFormData((prev) => ({ ...prev, mainImage: null }));
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    // Response is wrapped in { success: true, data: { url, publicId } }
    return data.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ========== REQUIRED FIELDS VALIDATION ==========
      const missingFields = [];

      if (!formData.titleEn || formData.titleEn.trim() === "") {
        missingFields.push("Title (English)");
      }

      if (!formData.description || formData.description.trim() === "") {
        missingFields.push("Description");
      }

      if (!formData.category) {
        missingFields.push("Category");
      }

      if (!formData.province) {
        missingFields.push("Province");
      }

      if (!formData.xpPoints || formData.xpPoints.trim() === "") {
        missingFields.push("XP Points");
      }

      if (missingFields.length > 0) {
        toast.error(
          `📝 Required fields missing: ${missingFields.join(
            ", "
          )}\n\n✅ Optional: Province 'All of Cambodia', Location, Address, Contact Info, Price, Operating Hours`
        );
        setIsSubmitting(false);
        return;
      }

      // Validate XP Points (must be a positive number)
      const xpPointsNum = parseInt(formData.xpPoints);
      if (isNaN(xpPointsNum) || xpPointsNum < 0) {
        toast.error("XP Points must be a positive number (minimum 0)");
        setIsSubmitting(false);
        return;
      }

      // Upload main image if exists
      let mainImageUrl = "";
      if (formData.mainImage) {
        mainImageUrl = await uploadImageToCloudinary(formData.mainImage);
      }

      // Upload gallery images if exist
      let galleryImageUrls: string[] = [];
      if (formData.galleryImages.length > 0) {
        galleryImageUrls = await Promise.all(
          formData.galleryImages.map((file) => uploadImageToCloudinary(file))
        );
      }

      // Process operating hours - only include valid slots
      const validOperatingHours = formData.timeSlots
        .filter((slot) => {
          // Include if it's marked as closed, or if it has valid open/close times
          return (
            slot.closed || (slot.open && slot.close && slot.days.length > 0)
          );
        })
        .map((slot) => ({
          days: slot.days,
          open: slot.open || "",
          close: slot.close || "",
          closed: slot.closed,
        }));

      // Process price options - only include filled options
      const validPriceOptions = formData.priceOptions
        .filter((option) => option.label && option.price)
        .map((option) => ({
          label: option.label.trim(),
          price: option.price.trim(),
        }));

      // Process contact info - only include if at least one field is filled
      let contactInfo = null;
      if (formData.phone || formData.website || formData.facebook) {
        contactInfo = {
          phone: formData.phone.trim(),
          website: formData.website.trim(),
          facebook: formData.facebook.trim(),
        };
      }

      // Prepare data
      const listingData = {
        title: formData.titleEn.trim(),
        titleKh: formData.titleKh.trim() || null,
        description: formData.description.trim(),
        category: formData.category,
        province: formData.province, // Already validated above
        tags: formData.tags,
        xpPoints: xpPointsNum,
        // Optional fields
        address: formData.address.trim() || null,
        lat: formData.lat && formData.lat.trim() !== "" ? formData.lat : null,
        lng: formData.lng && formData.lng.trim() !== "" ? formData.lng : null,
        mainImage: mainImageUrl || null,
        photos: galleryImageUrls,
        priceLevel: formData.priceLevel || null,
        priceOptions: validPriceOptions.length > 0 ? validPriceOptions : null,
        operatingHours:
          validOperatingHours.length > 0 ? validOperatingHours : null,
        phone: contactInfo?.phone || null,
        website: contactInfo?.website || null,
        facebook: contactInfo?.facebook || null,
      };

      console.log("📤 Sending listing data:", listingData);

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ API Error:", error);
        throw new Error(error.message || "Failed to create listing");
      }

      const result = await response.json();
      toast.success("Card published successfully!");

      // Redirect to places page
      window.location.href = "/admin/places";
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to publish card. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F9F7F5]/80 dark:bg-[#201512]/80 backdrop-blur-md px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="hover:text-[#E07A5F] cursor-pointer">Admin</span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-[#E07A5F] cursor-pointer">Places</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900 dark:text-white">
            Create New
          </span>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-card-form"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-[#E07A5F] hover:bg-[#d1684e] shadow-lg shadow-[#E07A5F]/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Publishing..." : "Publish Card"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-8 pb-20">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            New Content Card
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add a new hidden gem, local food spot, or cultural activity.
          </p>
        </div>

        <form
          id="create-card-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* Basic Information */}
          <div className="bg-white dark:bg-[#2A201D] rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <FileText className="w-5 h-5 text-[#E07A5F]" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, titleEn: e.target.value })
                  }
                  className="w-full p-2 md:p-3 rounded-md border border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white transition-colors"
                  placeholder="e.g. Bamboo Train Experience"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Title (Khmer)
                </label>
                <input
                  type="text"
                  value={formData.titleKh}
                  onChange={(e) =>
                    setFormData({ ...formData, titleKh: e.target.value })
                  }
                  className="w-full p-2 md:p-3 rounded-md border border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] font-serif dark:bg-[#201512] dark:text-white transition-colors"
                  placeholder="e.g. ឡូរីបាត់ដំបង"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 md:p-3 rounded-md border border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white transition-colors"
                  placeholder="Describe the experience, history, and what makes it special..."
                  rows={4}
                />
                <p className="text-xs text-right mt-1 text-gray-600 dark:text-gray-400">
                  {formData.description.length}/500 characters
                </p>
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-wrap md:flex-nowrap gap-4">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="w-full bg-white dark:bg-[#201512] border-gray-300 dark:border-gray-700 h-11 md:h-12 focus:border-[#E07A5F] focus:ring-[#E07A5F]">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <SelectValue placeholder="Select category" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Province
                  </label>
                  <Select
                    value={formData.province}
                    onValueChange={(value) =>
                      setFormData({ ...formData, province: value })
                    }
                  >
                    <SelectTrigger className="w-full bg-white dark:bg-[#201512] border-gray-300 dark:border-gray-700 h-11 md:h-12 focus:border-[#E07A5F] focus:ring-[#E07A5F]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <SelectValue placeholder="Select province" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-70 overflow-y-auto">
                      {provinces.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                <div className="grow">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Tags
                  </label>
                  <div className="flex flex-col gap-2">
                    <Select
                      value={newTag}
                      onValueChange={(value) => {
                        if (!formData.tags.includes(value)) {
                          setFormData({
                            ...formData,
                            tags: [...formData.tags, value],
                          });
                          setNewTag("");
                        }
                      }}
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-[#201512] border-gray-300 dark:border-gray-700 h-11 md:h-12 focus:border-[#E07A5F] focus:ring-[#E07A5F]">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <SelectValue placeholder="Add tags..." />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {tags
                          .filter((tag) => !formData.tags.includes(tag))
                          .map((tag) => (
                            <SelectItem key={tag} value={tag}>
                              {tag}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 bg-[#E07A5F]/10 text-[#E07A5F] px-3 py-1.5 rounded-lg text-sm font-medium"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Select from dropdown to add tags.
                  </p>
                </div>
                <div className="w-full md:w-48">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    XP Points
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      step="any"
                      value={formData.xpPoints}
                      onChange={(e) =>
                        setFormData({ ...formData, xpPoints: e.target.value })
                      }
                      className="pl-10 w-full py-2 md:py-3 rounded-md border border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white transition-colors"
                      placeholder="0"
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Reward for visiting.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Map */}
          <div className="bg-white dark:bg-[#2A201D] rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPin className="w-5 h-5 text-[#E07A5F]" />
                Location & Map
              </h3>
              {(formData.lat !== "11.5564" ||
                formData.lng !== "104.9282" ||
                formData.address) && (
                <button
                  type="button"
                  onClick={handleClearLocation}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear Location
                </button>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Full Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full p-2 md:p-3 rounded-md border border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white transition-colors"
                  placeholder="e.g. O Dambang, Battambang Province, Cambodia"
                />
              </div>

              <AdminMapPicker
                initialLat={parseFloat(formData.lat)}
                initialLng={parseFloat(formData.lng)}
                onLocationSelect={handleLocationSelect}
                className="w-full h-120"
              />
            </div>
          </div>

          {/* Visual Assets */}
          <div className="bg-white dark:bg-[#2A201D] rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <ImageIcon className="w-5 h-5 text-[#E07A5F]" />
              Visual Assets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Main Cover Image
                </label>
                {formData.mainImage ? (
                  <div className="w-full aspect-4/3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden group">
                    <Image
                      src={URL.createObjectURL(formData.mainImage)}
                      alt="Main cover"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveMainImage}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full aspect-4/3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center text-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </label>
                )}
              </div>
              <div className="md:col-span-7 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Gallery Images ({formData.galleryImages.length})
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {formData.galleryImages.map((file, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 relative overflow-hidden group"
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-gray-600 hover:text-[#E07A5F] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageUpload}
                      className="hidden"
                    />
                    <Plus className="w-6 h-6" />
                    <span className="text-xs font-medium mt-1">Add</span>
                  </label>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Recommended: 3-5 images showing different angles.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Operating Hours */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pricing */}
            <div className="bg-white dark:bg-[#2A201D] rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-full">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <DollarSign className="w-5 h-5 text-[#E07A5F]" />
                Pricing
              </h3>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                    Price Level
                  </label>
                  <div className="flex w-full rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
                    {["Free", "$", "$$", "$$$"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, priceLevel: level })
                        }
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                          formData.priceLevel === level
                            ? "bg-white dark:bg-[#2A201D] shadow-sm text-[#E07A5F] ring-1 ring-black/5 dark:ring-white/10"
                            : "text-gray-600 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Price Breakdown
                  </label>
                  <div className="flex flex-col gap-3">
                    {formData.priceOptions.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) =>
                            updatePriceOption(index, "label", e.target.value)
                          }
                          className="grow p-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm dark:bg-[#201512] dark:text-white"
                          placeholder="Label (e.g. Adult)"
                        />
                        <div className="w-24 relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                            $
                          </span>
                          <input
                            type="number"
                            value={option.price}
                            onChange={(e) =>
                              updatePriceOption(index, "price", e.target.value)
                            }
                            className="w-full pl-5 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm dark:bg-[#201512] dark:text-white"
                            placeholder="0.00"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePriceOption(index)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPriceOption}
                      className="text-sm text-[#E07A5F] font-medium flex items-center gap-1 mt-1 hover:underline self-start"
                    >
                      <Plus className="w-4 h-4" /> Add Option
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white dark:bg-[#2A201D] rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <Clock className="w-5 h-5 text-[#E07A5F]" />
                Operating Hours
              </h3>
              <div className="flex flex-col gap-5">
                {formData.timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {["M", "T", "W", "Th", "F", "Sa", "Su"].map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(index, day)}
                            className={`w-7 h-7 rounded-full text-xs font-medium border transition-all ${
                              slot.days.includes(day)
                                ? "bg-[#E07A5F] text-white border-[#E07A5F]"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-[#E07A5F]"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(index)}
                        className="text-xs text-red-500 font-medium hover:text-red-700 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={slot.closed}
                          onChange={(e) =>
                            updateTimeSlot(index, "closed", e.target.checked)
                          }
                          className="rounded border-gray-300 text-[#E07A5F] focus:ring-[#E07A5F] h-4 w-4"
                        />
                        <label className="text-sm font-medium text-gray-900 dark:text-white">
                          Closed
                        </label>
                      </div>
                      {!slot.closed && (
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                              Open
                            </label>
                            <input
                              type="time"
                              value={slot.open}
                              onChange={(e) =>
                                updateTimeSlot(index, "open", e.target.value)
                              }
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 text-sm py-1.5 px-2 dark:bg-[#201512] dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                              Close
                            </label>
                            <input
                              type="time"
                              value={slot.close}
                              onChange={(e) =>
                                updateTimeSlot(index, "close", e.target.value)
                              }
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 text-sm py-1.5 px-2 dark:bg-[#201512] dark:text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#E07A5F] hover:border-[#E07A5F] hover:bg-[#E07A5F]/5 transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Day Group
                </button>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-[#2A201D] rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Phone className="w-5 h-5 text-[#E07A5F]" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="pl-9 w-full py-2 md:py-3 rounded-md border border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white"
                    placeholder="+855 12 345 678"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full p-2 md:p-3 rounded-md border border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white"
                  placeholder="https://"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Facebook Page
                </label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) =>
                    setFormData({ ...formData, facebook: e.target.value })
                  }
                  className="w-full p-2 md:p-3 rounded-md border border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white"
                  placeholder="fb.com/page-name"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

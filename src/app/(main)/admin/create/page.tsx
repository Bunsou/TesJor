"use client";

import { useState } from "react";
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
  Search,
} from "lucide-react";

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
    lat: "13.3617",
    lng: "103.8605",
    mainImage: null as File | null,
    galleryImages: [] as File[],
    priceLevel: "$",
    priceOptions: [{ label: "Entry Fee", price: "5.00" }] as PriceOption[],
    timeSlots: [
      { days: ["M", "T", "W", "T", "F"], open: "09:00", close: "17:00", closed: false },
      { days: ["S", "S"], open: "", close: "", closed: true },
    ] as TimeSlot[],
    phone: "",
    website: "",
    facebook: "",
  });

  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const updatePriceOption = (index: number, field: keyof PriceOption, value: string) => {
    const updated = [...formData.priceOptions];
    updated[index][field] = value;
    setFormData({ ...formData, priceOptions: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Implement submit logic
    console.log("Form data:", formData);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Card published successfully!");
    }, 1000);
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
          <span className="font-medium text-gray-900 dark:text-white">Create New</span>
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

        <form id="create-card-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white transition-colors"
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
                  onChange={(e) => setFormData({ ...formData, titleKh: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] font-serif dark:bg-[#201512] dark:text-white transition-colors"
                  placeholder="e.g. ឡូរីបាត់ដំបង"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white transition-colors"
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
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white"
                  >
                    <option value="">Select category</option>
                    <option value="place">Place</option>
                    <option value="food">Food</option>
                    <option value="drink">Drink</option>
                    <option value="souvenir">Souvenir</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Province
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full rounded-xl border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white"
                  >
                    <option value="">Select province</option>
                    <option value="Siem Reap">Siem Reap</option>
                    <option value="Phnom Penh">Phnom Penh</option>
                    <option value="Battambang">Battambang</option>
                    <option value="Kampot">Kampot</option>
                  </select>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                <div className="grow">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Tags
                  </label>
                  <div className="flex items-center gap-2 p-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#201512] focus-within:border-[#E07A5F] focus-within:ring-1 focus-within:ring-[#E07A5F] transition-colors">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-[#E07A5F]/10 text-[#E07A5F] px-2 py-1 rounded-lg text-xs font-medium"
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
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleTagAdd();
                        }
                      }}
                      className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm placeholder-gray-400 dark:text-white"
                      placeholder="Type tag and press enter..."
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Separate tags with Enter or Comma.
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
                      value={formData.xpPoints}
                      onChange={(e) => setFormData({ ...formData, xpPoints: e.target.value })}
                      className="pl-10 w-full rounded-xl border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white transition-colors"
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
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <MapPin className="w-5 h-5 text-[#E07A5F]" />
              Location & Map
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Full Address
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="pl-10 w-full rounded-xl border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white transition-colors"
                    placeholder="Search for a location..."
                  />
                </div>
              </div>
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 relative overflow-hidden cursor-crosshair">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-600 font-medium bg-white/80 dark:bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    Click to drop pin
                  </p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-[#E07A5F] drop-shadow-lg">
                  <MapPin className="w-10 h-10 fill-current" />
                </div>
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <div className="bg-white dark:bg-[#2A201D] px-3 py-1.5 rounded-lg shadow-md text-xs font-mono border border-gray-200 dark:border-gray-700">
                    Lat: {formData.lat}
                  </div>
                  <div className="bg-white dark:bg-[#2A201D] px-3 py-1.5 rounded-lg shadow-md text-xs font-mono border border-gray-200 dark:border-gray-700">
                    Lng: {formData.lng}
                  </div>
                </div>
              </div>
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
                <div className="w-full aspect-4/3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center text-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Click to upload
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
              <div className="md:col-span-7 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Gallery Images
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700 relative overflow-hidden group"></div>
                  <div className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700 relative overflow-hidden group"></div>
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-gray-600 hover:text-[#E07A5F] transition-colors">
                    <Plus className="w-6 h-6" />
                    <span className="text-xs font-medium mt-1">Add</span>
                  </div>
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
                        onClick={() => setFormData({ ...formData, priceLevel: level })}
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
                          onChange={(e) => updatePriceOption(index, "label", e.target.value)}
                          className="grow rounded-lg border-gray-300 dark:border-gray-700 text-sm dark:bg-[#201512] dark:text-white"
                          placeholder="Label (e.g. Adult)"
                        />
                        <div className="w-24 relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                            $
                          </span>
                          <input
                            type="number"
                            value={option.price}
                            onChange={(e) => updatePriceOption(index, "price", e.target.value)}
                            className="w-full pl-5 rounded-lg border-gray-300 dark:border-gray-700 text-sm dark:bg-[#201512] dark:text-white"
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
                        {slot.days.map((day) => (
                          <button
                            key={day}
                            type="button"
                            className="w-7 h-7 rounded-full bg-[#E07A5F] text-white text-xs font-medium border border-[#E07A5F] transition-all"
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="text-xs text-red-500 font-medium hover:text-red-700 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                    {slot.closed ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={slot.closed}
                            className="rounded border-gray-300 text-[#E07A5F] focus:ring-[#E07A5F] h-4 w-4"
                          />
                          <label className="text-sm font-medium text-gray-900 dark:text-white">
                            Closed
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                            Open
                          </label>
                          <input
                            type="time"
                            value={slot.open}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-700 text-sm py-1.5 dark:bg-[#201512] dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                            Close
                          </label>
                          <input
                            type="time"
                            value={slot.close}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-700 text-sm py-1.5 dark:bg-[#201512] dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-600 hover:text-[#E07A5F] hover:border-[#E07A5F] hover:bg-[#E07A5F]/5 transition-all"
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
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-9 w-full rounded-xl border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white"
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
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white"
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
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white"
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

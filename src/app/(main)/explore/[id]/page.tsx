"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import { getDefaultImage } from "@/lib/default-images";
import { Listing } from "@/server/db/schema";

interface ItemDetailResponse {
  item: Listing;
  isBookmarked: boolean;
  isVisited: boolean;
}

async function fetchItem(id: string) {
  const res = await fetch(`/api/listings/${id}`);
  if (!res.ok) throw new Error("Failed to fetch item");
  const json = await res.json();

  // Fetch user progress for this item
  let isBookmarked = false;
  let isVisited = false;

  try {
    const progressRes = await fetch(`/api/user/progress?itemId=${id}`);
    if (progressRes.ok) {
      const progressJson = await progressRes.json();
      isBookmarked = progressJson.data?.isBookmarked || false;
      isVisited = progressJson.data?.isVisited || false;
    }
  } catch {
    // User might not be logged in
  }

  return {
    item: json.data,
    isBookmarked,
    isVisited,
  };
}

async function toggleBookmark({
  itemId,
  category,
  action,
}: {
  itemId: string;
  category: string;
  action: "add" | "remove";
}) {
  const res = await fetch("/api/user/bookmark", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, category, action }),
  });
  if (!res.ok) throw new Error("Failed to toggle bookmark");
  return res.json();
}

async function toggleVisited({
  itemId,
  category,
  action,
}: {
  itemId: string;
  category: string;
  action: "add" | "remove";
}) {
  const res = await fetch("/api/user/visited", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, category, action }),
  });
  if (!res.ok) throw new Error("Failed to toggle visited");
  return res.json();
}

function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

function getCategoryStyle(category: string) {
  const styles: Record<string, string> = {
    place:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    activity:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    food: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    drink:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    souvenir:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  };
  return styles[category] || "bg-[#E07A5F]/10 text-[#E07A5F]";
}

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<ItemDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showHours, setShowHours] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadItem() {
      try {
        setIsLoading(true);
        setError(null);
        const itemData = await fetchItem(id);
        if (isMounted) {
          setData(itemData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load item");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadItem();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBookmark = async (action: "add" | "remove") => {
    if (!data) return;
    try {
      await toggleBookmark({
        itemId: id,
        category: data.item.category,
        action,
      });
      const itemData = await fetchItem(id);
      setData(itemData);
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const handleVisited = async (action: "add" | "remove") => {
    if (!data) return;
    try {
      const result = await toggleVisited({
        itemId: id,
        category: data.item.category,
        action,
      });
      const itemData = await fetchItem(id);
      setData(itemData);
      if (result.visited) {
        triggerConfetti();
      }
    } catch (err) {
      console.error("Failed to toggle visited:", err);
    }
  };

  const handleGetDirections = () => {
    if (!data?.item.lat || !data?.item.lng) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${data.item.lat},${data.item.lng}`;
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">Failed to load item details</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-[#E07A5F] text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const item = data.item;
  const isBookmarked = data.isBookmarked;
  const isVisited = data.isVisited;

  const imageSrc =
    imageError || !item.mainImage
      ? getDefaultImage(item.category)
      : item.mainImage;

  // Create images array (for carousel)
  const images = item.photos?.map((p) => p.url) || [imageSrc];
  if (images.length === 0) images.push(imageSrc);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#FDFCF6] dark:bg-[#201512]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6 md:gap-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/explore" className="hover:text-[#E07A5F] cursor-pointer">
            Explore
          </Link>
          <span className="material-symbols-outlined text-xs">
            chevron_right
          </span>
          <span className="hover:text-[#E07A5F] cursor-pointer capitalize">
            {item.category}
          </span>
          <span className="material-symbols-outlined text-xs">
            chevron_right
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {item.title}
          </span>
        </div>

        {/* Image Carousel */}
        <div className="w-full relative group rounded-2xl overflow-hidden shadow-sm aspect-[16/9] md:aspect-[21/9] bg-gray-200 dark:bg-gray-800">
          <div className="absolute inset-0 transition-transform duration-500 ease-out">
            <Image
              src={images[currentImageIndex] || imageSrc}
              alt={item.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>

          {/* Carousel Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full shadow-sm transition-colors ${
                      idx === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Title Section */}
            <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-gray-800 pb-8">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getCategoryStyle(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                  {item.avgRating && (
                    <div className="flex items-center gap-1 text-[#E07A5F]">
                      <span className="material-symbols-outlined text-sm icon-filled">
                        star
                      </span>
                      <span className="text-sm font-bold">
                        {item.avgRating}
                      </span>
                    </div>
                  )}
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                  {item.title}
                </h1>
                {item.titleKh && (
                  <h2 className="text-2xl mt-1 font-khmer text-gray-500 dark:text-gray-400">
                    {item.titleKh}
                  </h2>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-gray-900 dark:text-white">
                {item.addressText && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                    </div>
                    <span className="font-medium">{item.addressText}</span>
                  </div>
                )}
                {item.priceLevel && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      <span className="material-symbols-outlined text-sm">
                        payments
                      </span>
                    </div>
                    <span className="font-medium">{item.priceLevel}</span>
                  </div>
                )}
                {item.views !== undefined && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined text-lg">
                      visibility
                    </span>
                    <span>{item.views} views</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-white leading-relaxed">
              <p>{item.description}</p>
            </div>

            {/* Operating Hours */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A201D] overflow-hidden">
              <button
                onClick={() => setShowHours(!showHours)}
                className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Operating Hours
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Open Now
                    </p>
                  </div>
                </div>
                <span
                  className={`material-symbols-outlined transition-transform text-gray-500 dark:text-gray-400 ${
                    showHours ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>
              {showHours && (
                <div className="px-4 pb-4 pt-0 text-sm border-t border-gray-100 dark:border-gray-800 mt-2">
                  <div className="flex flex-col gap-3 pt-3">
                    <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                      <span className="font-medium text-gray-500 dark:text-gray-400">
                        Monday - Friday
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        09:00 AM - 05:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                      <span className="font-medium text-gray-500 dark:text-gray-400">
                        Saturday - Sunday
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        10:00 AM - 04:00 PM
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="flex flex-col gap-6 pt-4" id="reviews">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Reviews
              </h3>
              <div className="bg-white dark:bg-[#2A201D] p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-wrap gap-8 items-center">
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-black text-gray-900 dark:text-white">
                    {item.avgRating || "N/A"}
                  </span>
                  <div className="flex text-[#E07A5F] my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`material-symbols-outlined text-lg ${
                          star <= Math.floor(Number(item.avgRating) || 0)
                            ? "icon-filled"
                            : ""
                        }`}
                      >
                        {star <= Number(item.avgRating || 0)
                          ? "star"
                          : star - 0.5 <= Number(item.avgRating || 0)
                          ? "star_half"
                          : "star"}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.reviewCount || 0} ratings
                  </span>
                </div>
                <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div
                      key={rating}
                      className="flex items-center gap-3 text-xs"
                    >
                      <span className="w-3 text-gray-900 dark:text-white">
                        {rating}
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#E07A5F] rounded-full"
                          style={{
                            width: `${
                              rating === 5 ? 85 : rating === 4 ? 10 : 3
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Map */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-8 h-fit">
            {/* Action Hub */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A201D] p-5 flex flex-col gap-4 shadow-sm order-2 lg:order-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                  Action Hub
                </h4>
                <div className="flex items-center gap-1.5 text-xs font-semibold bg-orange-50 dark:bg-orange-900/20 text-[#E07A5F] px-2 py-1 rounded-md">
                  <span className="material-symbols-outlined text-sm">
                    bolt
                  </span>
                  +100 XP
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={handleGetDirections}
                  className="col-span-1 md:col-span-2 w-full px-5 py-4 rounded-xl bg-[#E07A5F] hover:bg-[#c66a50] text-white font-bold text-sm transition-all shadow-lg shadow-[#E07A5F]/30 hover:shadow-[#E07A5F]/40 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined">directions</span>
                  Get Directions
                </button>
                <button
                  onClick={() => handleVisited(isVisited ? "remove" : "add")}
                  className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isVisited
                      ? "border-[#2D6A4F] bg-[#2D6A4F] text-white"
                      : "border-[#E07A5F]/20 hover:border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F]/5"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${
                      isVisited ? "icon-filled" : ""
                    }`}
                  >
                    beenhere
                  </span>
                  {isVisited ? "Visited" : "Mark Visited"}
                </button>
                <button
                  onClick={() =>
                    handleBookmark(isBookmarked ? "remove" : "add")
                  }
                  className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isBookmarked
                      ? "border-[#E07A5F] bg-[#E07A5F] text-white"
                      : "border-[#E07A5F]/20 hover:border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F]/5"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${
                      isBookmarked ? "icon-filled" : ""
                    }`}
                  >
                    bookmark
                  </span>
                  {isBookmarked ? "Saved" : "Bookmark"}
                </button>
              </div>
            </div>

            {/* Map Preview */}
            {item.lat && item.lng && (
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A201D] p-1 order-1 lg:order-2 shadow-sm">
                <div className="w-full h-80 lg:h-[300px] rounded-lg bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=${
                      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
                    }&q=${item.lat},${item.lng}&zoom=14`}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <Link
                    href="/map"
                    className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors cursor-pointer group"
                  >
                    <span className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full shadow-lg group-hover:scale-105 transition-transform flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">
                        map
                      </span>
                      Explore Map
                    </span>
                  </Link>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Location
                    </p>
                    <p className="text-sm font-semibold mt-0.5 text-gray-900 dark:text-white">
                      {item.addressText || "View on map"}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[#E07A5F]">
                    near_me
                  </span>
                </div>
              </div>
            )}

            {/* Highlights */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A201D] p-5 order-3 shadow-sm">
              <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                Highlights
              </h4>
              <ul className="flex flex-col gap-3">
                {[
                  "Authentic Local Experience",
                  "Photo Opportunities",
                  "Cultural Significance",
                  "Family Friendly",
                ].map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-sm group cursor-default"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center shrink-0 group-hover:bg-[#E07A5F] group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-sm">
                        check
                      </span>
                    </span>
                    <span className="py-0.5 text-gray-900 dark:text-white">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

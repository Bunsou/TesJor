"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDefaultImage } from "@/lib/default-images";
import { Listing } from "@/server/db/schema";
import {
  useListingsSlugDetail,
  ImageCarousel,
  Breadcrumb,
  ItemHeader,
  OperatingHours,
  ReviewsSection,
  ActionHub,
  MapPreview,
  RelatedListings,
} from "@/features/listings";
import { OperatingHoursProps } from "../listings/components/OperatingHours";

interface Review {
  id: string;
  rating: number;
  content: string | null;
  userId: string;
  userName: string | null;
  userImage: string | null;
  createdAt: Date;
}

interface ItemDetailResponse {
  item: Listing & { reviews?: Review[] };
  isBookmarked: boolean;
  isVisited: boolean;
}

interface ExploreDetailClientProps {
  slug: string;
  initialData?: ItemDetailResponse | null;
  initialError?: string | null;
}

export default function ExploreDetailClient({
  slug,
  initialData,
  initialError,
}: ExploreDetailClientProps) {
  const router = useRouter();

  const {
    data,
    isLoading,
    error,
    isBookmarkLoading,
    isVisitedLoading,
    handleBookmark,
    handleVisited,
    refreshData,
  } = useListingsSlugDetail(slug, { initialData, initialError });
  const [imageError, setImageError] = useState(false);

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

  const images = [imageSrc];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#FDFCF6] dark:bg-[#201512]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6 md:gap-8">
        <Breadcrumb category={item.category} title={item.title} />

        <ImageCarousel
          images={images}
          alt={item.title}
          onError={() => setImageError(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <ItemHeader item={item} />

            <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-white leading-relaxed">
              <p>{item.description}</p>
            </div>

            <OperatingHours
              operatingHours={
                item.operatingHours as OperatingHoursProps["operatingHours"]
              }
            />

            <ReviewsSection
              item={item}
              reviews={item.reviews}
              onReviewSubmitted={refreshData}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-8 h-fit">
            <div className="order-2 lg:order-1">
              <ActionHub
                item={item}
                isBookmarked={isBookmarked}
                isVisited={isVisited}
                isBookmarkLoading={isBookmarkLoading}
                isVisitedLoading={isVisitedLoading}
                onGetDirections={handleGetDirections}
                onToggleVisited={handleVisited}
                onToggleBookmark={handleBookmark}
              />
            </div>

            {item.lat && item.lng && (
              <div className="order-1 lg:order-2">
                <MapPreview
                  lat={item.lat}
                  lng={item.lng}
                  addressText={item.addressText}
                  province={item.province}
                />
              </div>
            )}

            {/* You might also like */}
            <div className="order-3">
              <RelatedListings slug={slug} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

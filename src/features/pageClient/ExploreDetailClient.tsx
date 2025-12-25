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
  PricingDetails,
  ReviewsSection,
  ActionHub,
  MapPreview,
  RelatedListings,
} from "@/features/listings";
import { OperatingHoursProps } from "../listings/components/OperatingHours";
import { PricingDetailsProps } from "../listings/components/PricingDetails";

interface Review {
  id: string;
  rating: number;
  content: string | null;
  userId: string;
  userName: string | null;
  userImage: string | null;
  createdAt: Date;
}

interface ListingPhoto {
  id: string;
  listingId: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
}

interface ItemDetailResponse {
  item: Listing & { reviews?: Review[]; photos?: ListingPhoto[] };
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

  // Build images array: main image first, then gallery photos
  const images = [imageSrc];

  // Add gallery photos if they exist
  const itemWithPhotos = item as Listing & { photos?: ListingPhoto[] };
  if (
    itemWithPhotos.photos &&
    Array.isArray(itemWithPhotos.photos) &&
    itemWithPhotos.photos.length > 0
  ) {
    const galleryImages = itemWithPhotos.photos
      .filter((photo) => photo.imageUrl && photo.imageUrl.trim() !== "")
      .map((photo) => photo.imageUrl);
    images.push(...galleryImages);
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#FDFCF6] dark:bg-[#201512]">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-8 flex flex-col gap-4 md:gap-8 pb-20 md:pb-8">
        <Breadcrumb category={item.category} title={item.title} />

        <ImageCarousel
          images={images}
          alt={item.title}
          onError={() => setImageError(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          <div className="md:col-span-7 flex flex-col gap-8">
            <ItemHeader item={item} />

            <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-white leading-relaxed">
              <p>{item.description}</p>
            </div>

            <OperatingHours
              operatingHours={
                item.operatingHours as OperatingHoursProps["operatingHours"]
              }
            />

            {/* Pricing Details */}
            <PricingDetails
              priceDetails={
                item.priceDetails as PricingDetailsProps["priceDetails"]
              }
              priceLevel={item.priceLevel}
            />

            <div className="hidden md:block">
              <ReviewsSection
                item={item}
                reviews={item.reviews}
                onReviewSubmitted={refreshData}
              />
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col gap-6 md:sticky md:top-8 h-fit">
            <div className="order-2 md:order-1">
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
              <div className="order-1 md:order-2">
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

            {/* Reviews - Mobile only, at the bottom */}
            <div className="md:hidden order-4">
              <ReviewsSection
                item={item}
                reviews={item.reviews}
                onReviewSubmitted={refreshData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDefaultImage } from "@/lib/default-images";
import {
  useListingsSlugDetail,
  ImageCarousel,
  Breadcrumb,
  ItemHeader,
  OperatingHours,
  ReviewsSection,
  ActionHub,
  MapPreview,
  HighlightsList,
} from "@/features/listings";

export default function ExploreDetailClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params.id as string;

  const { data, isLoading, error, handleBookmark, handleVisited, refreshData } =
    useListingsSlugDetail(slug);
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

            <OperatingHours />

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

            {/* <div className="order-3">
              <HighlightsList />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Listing } from "@/server/db/schema";
import { FaStar, FaRegStar, FaStarHalfStroke } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";

interface ReviewsSectionProps {
  item: Listing;
  reviews?: Array<{
    id: string;
    rating: number;
    content: string | null;
    userId: string;
    userName: string | null;
    userImage: string | null;
    createdAt: Date;
  }>;
  onReviewSubmitted?: () => void;
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - new Date(date).getTime()) / 1000
  );

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} ${mins === 1 ? "minute" : "minutes"} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

export function ReviewsSection({
  item,
  reviews = [],
  onReviewSubmitted,
}: ReviewsSectionProps) {
  const { session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // [5, 4, 3, 2, 1]
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[5 - review.rating]++;
    }
  });

  const totalReviews = reviews.length;

  const handleSubmitReview = async () => {
    if (!session) {
      setError("Please sign in to leave a review");
      return;
    }

    if (userRating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/listings/${item.slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: userRating,
          content: reviewContent.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit review");
      }

      setSuccess("Review submitted successfully!");
      setShowReviewForm(false);
      setReviewContent("");
      setUserRating(0);

      // Callback to refresh data
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
    const stars = [];
    const iconSize = size === "lg" ? "text-2xl" : "text-base";

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className={`${iconSize} text-[#E07A5F]`} />);
      } else if (i - 0.5 <= rating) {
        stars.push(
          <FaStarHalfStroke key={i} className={`${iconSize} text-[#E07A5F]`} />
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            className={`${iconSize} text-gray-300 dark:text-gray-600`}
          />
        );
      }
    }
    return stars;
  };

  const renderInteractiveStars = () => {
    return [1, 2, 3, 4, 5].map((star) => {
      const isFilled = star <= (hoverRating || userRating);
      return (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setUserRating(star)}
          className="transition-transform hover:scale-110"
        >
          {isFilled ? (
            <FaStar className="text-3xl text-[#E07A5F]" />
          ) : (
            <FaRegStar className="text-3xl text-gray-300 dark:text-gray-600" />
          )}
        </button>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 pt-3 md:pt-4" id="reviews">
      <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
        Reviews
      </h3>

      {/* Rating Overview */}
      <div className="bg-white dark:bg-[#2A201D] p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-wrap gap-4 md:gap-8 items-center">
        <div className="flex flex-col items-center">
          <span className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
            {item.avgRating ? Number(item.avgRating).toFixed(1) : "N/A"}
          </span>
          <div className="flex gap-0.5 md:gap-1 my-1.5 md:my-2">
            {renderStars(Number(item.avgRating) || 0, "lg")}
          </div>
          <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {totalReviews > 0
              ? `${totalReviews} review${totalReviews !== 1 ? "s" : ""}`
              : "No reviews yet"}
          </span>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 min-w-[200px] flex flex-col gap-1 md:gap-1.5">
          {[5, 4, 3, 2, 1].map((rating, index) => {
            const count = ratingCounts[index];
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div
                key={rating}
                className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs"
              >
                <span className="w-3 text-gray-900 dark:text-white">
                  {rating}
                </span>
                <div className="flex-1 h-1.5 md:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E07A5F] rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-6 md:w-8 text-right text-gray-500 dark:text-gray-400">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Review Form */}
      {session ? (
        <>
          {!showReviewForm ? (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-[#E07A5F] hover:bg-[#E07A5F]/90 text-white"
            >
              Write a Review
            </Button>
          ) : (
            <div className="bg-white dark:bg-[#2A201D] p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white mb-3 md:mb-4">
                Leave a Review
              </h4>

              {/* Star Rating */}
              <div className="mb-3 md:mb-4">
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Rating
                </label>
                <div className="flex gap-1.5 md:gap-2">
                  {renderInteractiveStars()}
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-3 md:mb-4">
                <label
                  htmlFor="review-content"
                  className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Your Review (Optional)
                </label>
                <textarea
                  id="review-content"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  style={{ fontSize: "16px" }}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#201512] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 md:gap-3">
                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || userRating === 0}
                  className="bg-[#E07A5F] hover:bg-[#E07A5F]/90 text-white text-xs md:text-sm min-h-[44px]"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
                <Button
                  onClick={() => {
                    setShowReviewForm(false);
                    setUserRating(0);
                    setReviewContent("");
                    setError(null);
                  }}
                  variant="outline"
                  disabled={isSubmitting}
                  className="text-xs md:text-sm min-h-[44px]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-50 dark:bg-[#2A201D] p-4 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to leave a review
          </p>
        </div>
      )}

      {/* Individual Reviews */}
      {reviews.length > 0 && (
        <div className="flex flex-col gap-3 md:gap-4">
          <h4 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">
            User Reviews
          </h4>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-[#2A201D] p-3 md:p-4 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-start gap-2 md:gap-3 mb-2 md:mb-3">
                <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0">
                  <AvatarImage
                    src={review.userImage || undefined}
                    alt={review.userName || "User"}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback className="bg-[#E07A5F] text-white text-xs md:text-sm">
                    {review.userName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5 md:mb-1 gap-2">
                    <span className="font-medium text-xs md:text-sm text-gray-900 dark:text-white truncate">
                      {review.userName || "Anonymous"}
                    </span>
                    <span className="flex gap-0.5 shrink-0">
                      {renderStars(review.rating)}
                    </span>
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-2 md:mb-4">
                    {getRelativeTime(review.createdAt)}
                  </div>
                  {review.content && (
                    <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm">
                      {review.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

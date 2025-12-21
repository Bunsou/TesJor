import { Listing } from "@/server/db/schema";

interface ReviewsSectionProps {
  item: Listing;
}

export function ReviewsSection({ item }: ReviewsSectionProps) {
  return (
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
            {item.avgRating
              ? `${Number(item.avgRating).toFixed(1)} average`
              : "No ratings"}
          </span>
        </div>
        <div className="flex-1 min-w-50 flex flex-col gap-1.5">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3 text-xs">
              <span className="w-3 text-gray-900 dark:text-white">
                {rating}
              </span>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E07A5F] rounded-full"
                  style={{
                    width: `${rating === 5 ? 85 : rating === 4 ? 10 : 3}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

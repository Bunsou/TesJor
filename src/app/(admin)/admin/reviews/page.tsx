"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Search, Trash2 } from "lucide-react";
import { Star } from "lucide-react";
import Image from "next/image";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage: string | null;
  userRole: string;
  listingId: string;
  listingTitle: string;
  listingProvince: string;
  rating: number;
  comment: string;
  createdAt: string;
  isSpam?: boolean;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5 text-yellow-400">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4.5 h-4.5 ${
            i < rating
              ? "fill-yellow-400"
              : "fill-gray-300 dark:fill-gray-600 text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Mock data for demonstration
  useEffect(() => {
    async function fetchReviews() {
      setIsLoading(true);

      // Simulate API call - replace with actual endpoint
      setTimeout(() => {
        const mockReviews: Review[] = [
          {
            id: "1",
            userId: "user1",
            userName: "Dara Sok",
            userImage:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCRG0MoF_Oz92xOFO0cTeglMsfZT_MUrR6TvnRqeJ8Vp2ti3CXekWCqVPVOePgloPrdcCbXE5e4-nPu5Tmc-2TjQoJQnsHhuC2QLmlQkGsXOJ8SwoFLssEFD-Jwv-BwYoHQ7Ng2tYWPr88ZOKAjjzUGO4brcx1ivDNPuHxaIO3vyPbRWd0hxOXWHMu00KfKMssUjoUf_TnH7F2azfolHTJgIuc_NjVDp3Y1mJy6BUYNF8JAQqGNQa0-3DbRLYED_yeEgziW9cYaFh4",
            userRole: "Traveler",
            listingId: "listing1",
            listingTitle: "Bamboo Train",
            listingProvince: "Battambang",
            rating: 5,
            comment:
              "Absolutely loved the experience! It's a bit bumpy but that's part of the charm. The views of the rice paddies were stunning...",
            createdAt: "2023-10-24T10:30:00Z",
          },
          {
            id: "2",
            userId: "user2",
            userName: "Sophie M.",
            userImage: null,
            userRole: "Local Guide",
            listingId: "listing2",
            listingTitle: "Kampot Pepper Farm",
            listingProvince: "Kampot",
            rating: 4,
            comment:
              "Very informative tour about pepper cultivation. The tasting session was unique. A bit hot walking around though.",
            createdAt: "2023-10-22T14:15:00Z",
          },
          {
            id: "3",
            userId: "user3",
            userName: "John Smith",
            userImage:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAZmxUP-Jl3ki4bmM22aMvIrDFcQ7gKM4g-HgN_ciLuWN7tr2aUHL0Q4tgnIcxfx6s3kL4OUSstZe21F635M_rgsGtwZk2BHNsTwK7YfvzkOjmnHh3JEi_9-WIvsRa4-Z91hxPr6YLdoeOCsCqLLFznlSjI_Iv0oqSW-mBavMaIECPjai9-rUZShQXg0OB7cJDkP0j_4cAWFI0P57Xhc6k8Gx2OwGe2CY5BOIoDDtIgIobShDZ9Dwfhs_aNOUgWN2ZWmRPrv3T_6Yc",
            userRole: "Visitor",
            listingId: "listing3",
            listingTitle: "Floating Village",
            listingProvince: "Siem Reap",
            rating: 2,
            comment:
              "The boat ride was okay but felt very commercialized. Not as 'hidden' as expected. Food was good though.",
            createdAt: "2023-10-20T16:45:00Z",
          },
          {
            id: "4",
            userId: "bot99",
            userName: "Bot User 99",
            userImage: null,
            userRole: "Unknown",
            listingId: "listing4",
            listingTitle: "Wat Ek Phnom",
            listingProvince: "Battambang",
            rating: 1,
            comment: "Buy cheap raybans at...",
            createdAt: "2023-10-19T09:00:00Z",
            isSpam: true,
          },
        ];
        setReviews(mockReviews);
        setTotalItems(128);
        setIsLoading(false);
      }, 500);
    }

    fetchReviews();
  }, [currentPage, searchQuery, ratingFilter, sortFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      // Replace with actual API call
      setReviews(reviews.filter((r) => r.id !== id));
      alert("Review deleted successfully");
    } catch {
      alert("Failed to delete review");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const pendingCount = 12;
  const reportedCount = 3;

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F9F7F5]/80 dark:bg-[#201512]/80 backdrop-blur-md px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="hover:text-[#E07A5F] cursor-pointer">Admin</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900 dark:text-white">
            Reviews Management
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6 pb-20">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              User Reviews
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and moderate reviews from the community.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-700 shadow-sm text-xs font-medium text-gray-600">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              Pending: {pendingCount}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-700 shadow-sm text-xs font-medium text-gray-600">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Reported: {reportedCount}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#2A201D] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:text-white transition-colors text-sm py-2"
              placeholder="Search by reviewer or place..."
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2A201D] text-sm py-2 pl-3 pr-8 focus:ring-[#E07A5F] focus:border-[#E07A5F] dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              className="rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2A201D] text-sm py-2 pl-3 pr-8 focus:ring-[#E07A5F] focus:border-[#E07A5F] dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#2A201D] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-250">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/20">
                  <th className="p-5 font-semibold">Reviewer</th>
                  <th className="p-5 font-semibold">Place</th>
                  <th className="p-5 font-semibold w-1/3">
                    Rating &amp; Review
                  </th>
                  <th className="p-5 font-semibold">Date</th>
                  <th className="p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                          </div>
                        </div>
                      </td>
                      <td className="p-5 align-top">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-1" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                      </td>
                      <td className="p-5 align-top">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                      </td>
                      <td className="p-5 align-top">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                      </td>
                      <td className="p-5 align-top">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-10 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-500">
                      No reviews found
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr
                      key={review.id}
                      className={`group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${
                        review.isSpam ? "opacity-70" : ""
                      } ${
                        review.rating >= 4
                          ? "bg-green-50/30 dark:bg-green-900/5"
                          : ""
                      }`}
                    >
                      <td className="p-5 align-top">
                        <div className="flex items-center gap-3">
                          {review.userImage ? (
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                              <Image
                                alt={review.userName}
                                fill
                                className="object-cover"
                                src={review.userImage}
                              />
                            </div>
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                                review.isSpam
                                  ? "bg-indigo-100 text-indigo-600"
                                  : "bg-[#E07A5F]/10 text-[#E07A5F]"
                              }`}
                            >
                              {getInitials(review.userName)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {review.userName}
                            </p>
                            <p className="text-xs text-gray-600">
                              {review.userRole}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 align-top">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {review.listingTitle}
                        </span>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {review.listingProvince}
                        </p>
                      </td>
                      <td className="p-5 align-top">
                        <div className="flex flex-col gap-2">
                          <StarRating rating={review.rating} />
                          <p
                            className={`text-gray-900 dark:text-white leading-relaxed ${
                              review.isSpam ? "italic text-gray-500" : ""
                            }`}
                          >
                            &ldquo;{review.comment}&rdquo;
                          </p>
                        </div>
                      </td>
                      <td className="p-5 align-top text-gray-600 dark:text-gray-400">
                        {formatDate(review.createdAt)}
                        <p className="text-xs mt-0.5">
                          {formatTime(review.createdAt)}
                        </p>
                      </td>
                      <td className="p-5 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200"
                            title={review.isSpam ? "Delete Forever" : "Delete"}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {reviews.length} of {totalItems} reviews
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

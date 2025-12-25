"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Search, Trash2 } from "lucide-react";
import { Star } from "lucide-react";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
  content: string | null;
  createdAt: string;
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [ratingFilter, setRatingFilter] = useState(
    searchParams.get("rating") || ""
  );
  const [sortFilter, setSortFilter] = useState(
    searchParams.get("sort") || "newest"
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<{
    id: string;
    userName: string;
    listingTitle: string;
  } | null>(null);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [ratingFilter, sortFilter, debouncedSearch]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (currentPage > 1) params.set("page", currentPage.toString());
    if (ratingFilter) params.set("rating", ratingFilter);
    if (sortFilter !== "newest") params.set("sort", sortFilter);
    if (debouncedSearch) params.set("search", debouncedSearch);

    const queryString = params.toString();
    router.push(`/admin/reviews${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [currentPage, ratingFilter, sortFilter, debouncedSearch, router]);

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (ratingFilter) params.set("rating", ratingFilter);
      if (sortFilter) params.set("sort", sortFilter);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/admin/reviews?${params}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.data.items || []);
        setTotalItems(data.data.total || 0);
      } else {
        console.error("Failed to fetch reviews:", res.status, res.statusText);
        setReviews([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, ratingFilter, sortFilter, debouncedSearch]);

  const openDeleteModal = (
    id: string,
    userName: string,
    listingTitle: string
  ) => {
    setReviewToDelete({ id, userName, listingTitle });
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;

    const toastId = toast.loading("Deleting review...");

    try {
      const res = await fetch(`/api/admin/reviews/${reviewToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Review deleted successfully", { id: toastId });

        // Check if we need to go back a page
        const newTotal = totalItems - 1;
        const newTotalPages = Math.ceil(newTotal / itemsPerPage);

        if (currentPage > newTotalPages && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          // Refetch current page data
          await fetchReviews();
        }
      } else {
        toast.error("Failed to delete review", { id: toastId });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete review", { id: toastId });
    } finally {
      setDeleteModalOpen(false);
      setReviewToDelete(null);
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

  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium px-3 py-1 bg-white dark:bg-[#2A201D] rounded-full border border-gray-200 dark:border-gray-800 text-gray-600">
              <span className="text-[#E07A5F] font-bold">{totalItems}</span>{" "}
              Total Reviews
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
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-[#E07A5F]/10 text-[#E07A5F]">
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
                          {review.content ? (
                            <p className="text-gray-900 dark:text-white leading-relaxed">
                              &ldquo;{review.content}&rdquo;
                            </p>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                              No comment provided
                            </p>
                          )}
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
                            onClick={() =>
                              openDeleteModal(
                                review.id,
                                review.userName,
                                review.listingTitle
                              )
                            }
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200"
                            title="Delete"
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
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
              {totalItems > 0 ? (
                <>
                  Showing{" "}
                  {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{" "}
                  to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} reviews
                </>
              ) : (
                "No reviews found"
              )}
            </span>
            <div className="flex gap-2 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || totalPages === 0}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="hidden sm:flex items-center gap-1">
                {totalPages > 0 &&
                  (() => {
                    const pages = [];
                    const showPages = 5;

                    if (totalPages <= showPages) {
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      if (currentPage <= 3) {
                        for (let i = 1; i <= 4; i++) pages.push(i);
                        pages.push(-1);
                        pages.push(totalPages);
                      } else if (currentPage >= totalPages - 2) {
                        pages.push(1);
                        pages.push(-1);
                        for (let i = totalPages - 3; i <= totalPages; i++)
                          pages.push(i);
                      } else {
                        pages.push(1);
                        pages.push(-1);
                        pages.push(currentPage - 1);
                        pages.push(currentPage);
                        pages.push(currentPage + 1);
                        pages.push(-2);
                        pages.push(totalPages);
                      }
                    }

                    return pages.map((page, idx) => {
                      if (page === -1 || page === -2) {
                        return (
                          <span
                            key={`ellipsis-${idx}`}
                            className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-400"
                          >
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-[#E07A5F] text-white"
                              : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    });
                  })()}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the review from{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {reviewToDelete?.userName}
              </span>{" "}
              for{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {reviewToDelete?.listingTitle}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

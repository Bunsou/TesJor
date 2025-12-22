"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronRight,
  Plus,
  Search,
  MapPin,
  Eye,
  Heart,
  Edit,
  Trash2,
} from "lucide-react";
import { getDefaultImage } from "@/lib/default-images";

interface Listing {
  id: string;
  slug: string;
  title: string;
  titleKh: string | null;
  category: string;
  province: string;
  mainImage: string | null;
  views: number;
  avgRating: string | null;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    place:
      "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-100 dark:border-orange-500/20",
    food: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    drink:
      "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-100 dark:border-green-500/20",
    souvenir:
      "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-100 dark:border-purple-500/20",
    event:
      "bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400 border-pink-100 dark:border-pink-500/20",
  };
  return colors[category] || colors.place;
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    place: "Place",
    food: "Food",
    drink: "Drink",
    souvenir: "Souvenir",
    event: "Event",
  };
  return labels[category] || category;
};

export default function AllPlacesPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchListings() {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        });

        if (categoryFilter) params.set("category", categoryFilter);
        if (provinceFilter) params.set("province", provinceFilter);
        if (searchQuery) params.set("search", searchQuery);

        const res = await fetch(`/api/listings/all?${params}`);
        if (res.ok) {
          const data = await res.json();
          setListings(data.data.items || []);
          setTotalItems(data.data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, [currentPage, categoryFilter, provinceFilter, searchQuery]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setListings(listings.filter((l) => l.id !== id));
        alert("Listing deleted successfully");
      }
    } catch {
      alert("Failed to delete listing");
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
            All Places
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/create")}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-[#E07A5F] hover:bg-[#d1684e] shadow-lg shadow-[#E07A5F]/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6 pb-20">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Content Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and organize all discovered places and hidden gems.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium px-3 py-1 bg-white dark:bg-[#2A201D] rounded-full border border-gray-200 dark:border-gray-800 text-gray-600">
              <span className="text-[#E07A5F] font-bold">{totalItems}</span>{" "}
              Total Places
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#2A201D] rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col xl:flex-row gap-4 justify-between items-center">
          <div className="relative w-full xl:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#201512] focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:text-white transition-colors text-sm py-2.5"
              placeholder="Search by name, tags, or ID..."
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full xl:w-auto items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide px-2">
                Filters:
              </span>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#201512] text-sm focus:border-[#E07A5F] focus:ring-[#E07A5F] py-2.5 pl-3 pr-8 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="place">Place</option>
              <option value="food">Food</option>
              <option value="drink">Drink</option>
              <option value="souvenir">Souvenir</option>
              <option value="event">Event</option>
            </select>
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#201512] text-sm focus:border-[#E07A5F] focus:ring-[#E07A5F] py-2.5 pl-3 pr-8 dark:text-white"
            >
              <option value="">All Provinces</option>
              <option value="Siem Reap">Siem Reap</option>
              <option value="Phnom Penh">Phnom Penh</option>
              <option value="Battambang">Battambang</option>
              <option value="Kampot">Kampot</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#2A201D] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-250">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-xs uppercase text-gray-600 dark:text-gray-400 font-semibold bg-gray-50/50 dark:bg-white/5">
                  <th className="p-5 font-semibold">Place Details</th>
                  <th className="p-5 font-semibold">Category</th>
                  <th className="p-5 font-semibold">Location</th>
                  <th className="p-5 font-semibold">Stats</th>
                  <th className="p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                      </td>
                      <td className="p-5">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                      </td>
                      <td className="p-5">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                      </td>
                      <td className="p-5">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : listings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-500">
                      No listings found
                    </td>
                  </tr>
                ) : (
                  listings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0 relative">
                            <Image
                              src={
                                listing.mainImage ||
                                getDefaultImage(
                                  listing.category as
                                    | "place"
                                    | "food"
                                    | "drink"
                                    | "souvenir"
                                    | "event"
                                )
                              }
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {listing.title}
                            </p>
                            {listing.titleKh && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 font-serif mt-0.5">
                                {listing.titleKh}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(
                            listing.category
                          )}`}
                        >
                          {getCategoryLabel(listing.category)}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{listing.province}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-1 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {listing.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />{" "}
                            {listing.avgRating || 0} rating
                          </span>
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              router.push(`/explore/${listing.slug}`)
                            }
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 hover:text-[#E07A5F] transition-colors"
                            title="View Live"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              router.push(`/admin/places/${listing.id}/edit`)
                            }
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 hover:text-[#E07A5F] transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              entries
            </span>
            <div className="flex gap-2 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="hidden sm:flex items-center gap-1">
                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#E07A5F] text-white"
                        : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 5 && (
                  <>
                    <span className="w-9 h-9 flex items-center justify-center text-gray-600">
                      ...
                    </span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-9 h-9 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 text-sm font-medium transition-colors"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

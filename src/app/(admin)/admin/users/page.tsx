"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Search, Trash2 } from "lucide-react";
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

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  xpPoints: number;
  createdAt: string;
  lastActive: string | null;
}

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  // Get state from URL
  const searchQuery = searchParams.get("search") || "";
  const dateFilter = searchParams.get("date") || "";
  const roleFilter = searchParams.get("role") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 10;

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch users from API
  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", currentPage.toString());
        params.set("limit", itemsPerPage.toString());
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (dateFilter) params.set("date", dateFilter);
        if (roleFilter) params.set("role", roleFilter);

        const response = await fetch(`/api/admin/users?${params}`);
        const data = await response.json();

        if (data.success) {
          setUsers(data.data.items);
          setTotalItems(data.data.total);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, [currentPage, debouncedSearch, dateFilter, roleFilter, itemsPerPage]);

  const openDeleteModal = (id: string, name: string, email: string) => {
    setUserToDelete({ id, name, email });
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    const toastId = toast.loading("Deleting user...");

    try {
      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update state
        setUsers(users.filter((u) => u.id !== userToDelete.id));
        const newTotal = totalItems - 1;
        setTotalItems(newTotal);

        // If current page becomes empty, go to previous page
        const totalPages = Math.ceil(newTotal / itemsPerPage);
        if (currentPage > totalPages && currentPage > 1) {
          updateURLParams({ page: (currentPage - 1).toString() });
        }

        toast.success("User deleted successfully", { id: toastId });
      } else {
        toast.error("Failed to delete user", { id: toastId });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user", { id: toastId });
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Update URL parameters
  const updateURLParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle filter changes
  const handleSearchChange = (value: string) => {
    updateURLParams({ search: value, page: "1" });
  };

  const handleDateFilterChange = (value: string) => {
    updateURLParams({ date: value, page: "1" });
  };

  const handleRoleFilterChange = (value: string) => {
    updateURLParams({ role: value, page: "1" });
  };

  const handlePageChange = (page: number) => {
    updateURLParams({ page: page.toString() });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-[#E07A5F]/10 text-[#E07A5F]",
      "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F9F7F5]/80 dark:bg-[#201512]/80 backdrop-blur-md px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="hover:text-[#E07A5F] cursor-pointer">Admin</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900 dark:text-white">
            Users
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          {/* Page Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all {totalItems} registered users on TesJor.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium px-3 py-1 bg-white dark:bg-[#2A201D] rounded-full border border-gray-200 dark:border-gray-800 text-gray-600">
              <span className="text-[#E07A5F] font-bold">{totalItems}</span>{" "}
              Total Users
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#2A201D] rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E07A5F] transition-colors w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-black focus:border-[#E07A5F] focus:ring-1 focus:ring-[#E07A5F] outline-none transition-all dark:text-white text-sm"
              placeholder="Search by name, email or ID..."
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
              className="pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:border-[#E07A5F] focus:ring-[#E07A5F] text-sm text-gray-900 dark:text-white appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <option value="">Any Date</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="365">This Year</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilterChange(e.target.value)}
              className="pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:border-[#E07A5F] focus:ring-[#E07A5F] text-sm text-gray-900 dark:text-white appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#2A201D] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-250">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-[#E07A5F] transition-colors group">
                    <div className="flex items-center gap-1">
                      User ID
                      <span className="opacity-0 group-hover:opacity-100 text-sm">
                        ⇅
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-[#E07A5F] transition-colors group">
                    <div className="flex items-center gap-1">
                      Name
                      <span className="opacity-0 group-hover:opacity-100 text-sm">
                        ⇅
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-[#E07A5F] transition-colors group">
                    <div className="flex items-center gap-1">
                      Registered
                      <span className="opacity-0 group-hover:opacity-100 text-sm">
                        ⇅
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-10 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-400">
                        {user.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                              <Image
                                alt={user.name}
                                fill
                                className="object-cover"
                                src={user.image}
                              />
                            </div>
                          ) : (
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(
                                user.name
                              )}`}
                            >
                              {getInitials(user.name)}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {user.name}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {user.role} • {user.xpPoints} XP
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {user.lastActive
                          ? new Date(user.lastActive).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              openDeleteModal(user.id, user.name, user.email)
                            }
                            className="p-1.5 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
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
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#2A201D]">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {totalItems}
              </span>{" "}
              results
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {/* Smart page number display */}
              {(() => {
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                const pages = [];

                if (totalPages <= 7) {
                  // Show all pages if 7 or fewer
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === i
                            ? "bg-[#E07A5F] text-white"
                            : "border border-gray-200 dark:border-gray-700 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                } else {
                  // Always show first page
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === 1
                          ? "bg-[#E07A5F] text-white"
                          : "border border-gray-200 dark:border-gray-700 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      1
                    </button>
                  );

                  // Show ellipsis if needed
                  if (currentPage > 3) {
                    pages.push(
                      <span
                        key="ellipsis-start"
                        className="px-2 py-1.5 text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }

                  // Show pages around current page
                  const start = Math.max(2, currentPage - 1);
                  const end = Math.min(totalPages - 1, currentPage + 1);

                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === i
                            ? "bg-[#E07A5F] text-white"
                            : "border border-gray-200 dark:border-gray-700 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }

                  // Show ellipsis if needed
                  if (currentPage < totalPages - 2) {
                    pages.push(
                      <span
                        key="ellipsis-end"
                        className="px-2 py-1.5 text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }

                  // Always show last page
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => handlePageChange(totalPages)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === totalPages
                          ? "bg-[#E07A5F] text-white"
                          : "border border-gray-200 dark:border-gray-700 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}

              <button
                disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {userToDelete?.name}
              </span>{" "}
              ({userToDelete?.email})? This action cannot be undone and will
              remove all associated data.
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

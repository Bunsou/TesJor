"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Search, Trash2 } from "lucide-react";
import Image from "next/image";

interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  level: string;
  registeredAt: string;
  lastActive: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Mock data for demonstration
  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);

      // Simulate API call - replace with actual endpoint
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: "1",
            userId: "#TJ-8821",
            name: "Sophea Vann",
            email: "sophea.v@example.com",
            image: null,
            level: "Level 4 Explorer",
            registeredAt: "2023-10-24",
            lastActive: "2 hours ago",
          },
          {
            id: "2",
            userId: "#TJ-8822",
            name: "David Miller",
            email: "david.m@gmail.com",
            image: null,
            level: "Level 2 Tourist",
            registeredAt: "2023-10-23",
            lastActive: "1 day ago",
          },
          {
            id: "3",
            userId: "#TJ-8823",
            name: "Chanda Meas",
            email: "chanda.m@cam-tours.com",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCRG0MoF_Oz92xOFO0cTeglMsfZT_MUrR6TvnRqeJ8Vp2ti3CXekWCqVPVOePgloPrdcCbXE5e4-nPu5Tmc-2TjQoJQnsHhuC2QLmlQkGsXOJ8SwoFLssEFD-Jwv-BwYoHQ7Ng2tYWPr88ZOKAjjzUGO4brcx1ivDNPuHxaIO3vyPbRWd0hxOXWHMu00KfKMssUjoUf_TnH7F2azfolHTJgIuc_NjVDp3Y1mJy6BUYNF8JAQqGNQa0-3DbRLYED_yeEgziW9cYaFh4",
            level: "Guide",
            registeredAt: "2023-10-20",
            lastActive: "5 mins ago",
          },
          {
            id: "4",
            userId: "#TJ-8824",
            name: "Sarah Jenkins",
            email: "sarah.j@hotmail.com",
            image: null,
            level: "Level 1 Novice",
            registeredAt: "2023-10-15",
            lastActive: "Oct 28, 2023",
          },
        ];
        setUsers(mockUsers);
        setTotalItems(128);
        setIsLoading(false);
      }, 500);
    }

    fetchUsers();
  }, [currentPage, searchQuery, dateFilter, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      // Replace with actual API call
      setUsers(users.filter((u) => u.id !== id));
      alert("User deleted successfully");
    } catch {
      alert("Failed to delete user");
    }
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
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all registered tourists and guides on TesJor.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#2A201D] rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E07A5F] transition-colors w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-black focus:border-[#E07A5F] focus:ring-1 focus:ring-[#E07A5F] outline-none transition-all dark:text-white text-sm"
              placeholder="Search by name, email or ID..."
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:border-[#E07A5F] focus:ring-[#E07A5F] text-sm text-gray-900 dark:text-white appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <option value="">Any Date</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="365">This Year</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:border-[#E07A5F] focus:ring-[#E07A5F] text-sm text-gray-900 dark:text-white appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
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
                        {user.userId}
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
                              {user.level}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.registeredAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleDelete(user.id)}
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
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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

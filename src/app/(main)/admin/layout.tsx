"use client";

import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { Shield } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("session111: ", session?.user?.role);
    if (!isLoading && !session) {
      router.push("/sign-in");
    }
    if (!isLoading && session && session.user?.role !== "admin") {
      router.push("/explore");
    }
  }, [session, isLoading, router]);

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

  console.log("admin111: ", session?.user?.role);
  if (!session || session.user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex transition-colors duration-200 bg-[#F9F7F5] dark:bg-[#201512]">
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto relative bg-[#F9F7F5] dark:bg-[#201512] scroll-smooth">
        {children}
      </main>
    </div>
  );
}

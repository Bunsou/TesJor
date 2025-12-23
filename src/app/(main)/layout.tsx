"use client";

import { useSession } from "@/hooks/useSession";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { ErrorBoundary } from "@/components/error-boundary";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Public pages that don't require authentication
  const publicPages = ["/explore", "/map"];
  const isPublicPage = publicPages.some((route) => pathname.startsWith(route));

  useEffect(() => {
    // Only redirect to sign-in if on a protected page without session
    if (!isLoading && !session && !isPublicPage) {
      router.push("/sign-in");
    }
  }, [session, isLoading, router, isPublicPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-foreground-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content for protected pages without session
  if (!session && !isPublicPage) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="md:ml-64 pb-20 md:pb-6">{children}</main>
        <BottomNav />
      </div>
    </ErrorBoundary>
  );
}

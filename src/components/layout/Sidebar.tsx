"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Bookmark, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navItems = [
  { href: "/explore", label: "Explore", icon: Home },
  { href: "/map", label: "Map", icon: Map },
  { href: "/my-trips", label: "My Trips", icon: Bookmark },
  { href: "/profile", label: "Profile", icon: User },
];

const adminNavItem = {
  href: "/admin",
  label: "Admin",
  icon: Shield,
};

export function Sidebar() {
  const pathname = usePathname();
  const { session, isLoading } = useSession();
  const isAdmin = session?.user?.role === "admin";

  // Always show all nav items, add admin if user is admin
  const allItems = isAdmin ? [...navItems, adminNavItem] : navItems;

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-primary-foreground border-r border-border fixed left-0 top-0 z-40">
      <div className="p-6">
        <Link href="/explore" className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-primary">TesJor</h1>
        </Link>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-2">
          {allItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground-muted hover:bg-accent hover:text-primary-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-border flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-row items-center gap-2 w-full animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            </div>
          </div>
        ) : session ? (
          <div className="flex flex-row items-center gap-2">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border-4 border-white dark:border-[#2A201D] shadow-lg bg-cover bg-center bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={session?.user?.image || undefined}
                  alt={session?.user?.name || "User"}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="text-3xl font-bold bg-primary/20 text-primary">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {session?.user?.name || "User"}
              </p>
            </div>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="w-full py-2 px-8 bg-primary text-primary-foreground rounded-lg font-medium text-center hover:bg-primary/90 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Bookmark, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";

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
  const { session } = useSession();
  const isAdmin = session?.user?.role === "admin";

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

      <div className="p-6 border-t border-border">
        <p className="text-sm text-foreground-muted">{session?.user?.email}</p>
      </div>
    </aside>
  );
}

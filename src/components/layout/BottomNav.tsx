"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Bookmark, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/explore", label: "Explore", icon: Home },
  { href: "/map", label: "Map", icon: Map },
  { href: "/my-trips", label: "My Trips", icon: Bookmark },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

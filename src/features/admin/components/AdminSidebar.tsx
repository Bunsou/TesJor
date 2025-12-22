"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  MessageSquare,
  Users,
} from "lucide-react";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/create", label: "Create Card", icon: PlusCircle },
  { href: "/admin/places", label: "All Places", icon: List },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { session } = useSession();

  return (
    <aside className="hidden md:flex w-64 h-full bg-white dark:bg-[#2A201D] border-r border-gray-200 dark:border-gray-800 flex-col justify-between shrink-0 transition-colors duration-200 z-20">
      <div className="p-6">
        <div className="flex flex-col mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            TesJor{" "}
            <span className="text-xs font-normal text-[#E07A5F] align-top">
              Admin
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Content Management
          </p>
        </div>
        <nav className="flex flex-col gap-2">
          {adminNavItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                  isActive
                    ? "bg-[#E07A5F]/10 text-[#E07A5F] dark:bg-[#E07A5F]/20"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            <Avatar className="w-full h-full">
              <AvatarImage
                src={session?.user?.image || undefined}
                alt={session?.user?.name || "Admin"}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback className="text-sm font-bold bg-[#E07A5F]/20 text-[#E07A5F]">
                {session?.user?.name?.[0]?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

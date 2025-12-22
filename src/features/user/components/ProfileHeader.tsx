"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MapPin, Zap } from "lucide-react";
import SettingDialog from "./SettingDialog";

interface User {
  name?: string;
  email?: string;
  image?: string | null;
}

interface ProfileHeaderProps {
  user?: User;
  userLevel: { level: number; name: string };
}

export function ProfileHeader({ user, userLevel }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-[#2A201D] shadow-lg bg-cover bg-center bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <Avatar className="w-full h-full">
              <AvatarImage
                src={user?.image || undefined}
                alt={user?.name || "User"}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback className="text-3xl font-bold bg-primary/20 text-primary">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
            {user?.name || "Anonymous"}
          </h1>
          <p className="text-[#926154] dark:text-[#d6c1bd] text-sm md:text-base">
            {user?.email || "No email"}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
              <Zap className="size-3" />
              Level {userLevel.level} • {userLevel.name}
            </span>
            <span className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1">
              <MapPin className="size-3" />
              Cambodia
            </span>
          </div>
        </div>
      </div>
      <SettingDialog />
    </div>
  );
}

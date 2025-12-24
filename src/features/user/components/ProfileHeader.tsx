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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full border-2 md:border-4 border-white dark:border-[#2A201D] shadow-lg bg-cover bg-center bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <Avatar className="w-full h-full">
              <AvatarImage
                src={user?.image || undefined}
                alt={user?.name || "User"}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback className="text-2xl md:text-3xl font-bold bg-primary/20 text-primary">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col gap-0.5 md:gap-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
            {user?.name || "Anonymous"}
          </h1>
          <p className="text-[#926154] dark:text-[#d6c1bd] text-xs md:text-sm">
            {user?.email || "No email"}
          </p>
          <div className="flex items-center gap-1.5 md:gap-2 mt-1 md:mt-2 flex-wrap">
            <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg bg-primary/10 text-primary text-[10px] md:text-xs font-semibold flex items-center gap-0.5 md:gap-1">
              <Zap className="size-2.5 md:size-3" />L{userLevel.level} •{" "}
              {userLevel.name}
            </span>
            <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] md:text-xs font-semibold flex items-center gap-0.5 md:gap-1">
              <MapPin className="size-2.5 md:size-3" />
              Cambodia
            </span>
          </div>
        </div>
      </div>
      <SettingDialog />
    </div>
  );
}

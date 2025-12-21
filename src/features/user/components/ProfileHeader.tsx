"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, MapPin, Zap } from "lucide-react";

interface User {
  name?: string;
  email?: string;
  image?: string | null;
}

interface ProfileHeaderProps {
  user?: User;
  userLevel: { level: number; name: string };
}

async function signOut() {
  await fetch("/api/auth/sign-out", { method: "POST" });
  window.location.href = "/sign-in";
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

      <Dialog>
        <DialogTrigger asChild>
          <button className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-800 text-[#1a110f] dark:text-[#f2eae8] font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2">
            <Settings className="size-4" />
            Settings
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
            <button className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-3">
              <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-400">
                edit
              </span>
              <div>
                <p className="font-medium text-sm text-[#1a110f] dark:text-[#f2eae8]">
                  Edit Profile
                </p>
                <p className="text-xs text-[#926154] dark:text-[#d6c1bd]">
                  Update your information
                </p>
              </div>
            </button>

            <button className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-3">
              <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-400">
                notifications
              </span>
              <div>
                <p className="font-medium text-sm text-[#1a110f] dark:text-[#f2eae8]">
                  Notifications
                </p>
                <p className="text-xs text-[#926154] dark:text-[#d6c1bd]">
                  Manage your notifications
                </p>
              </div>
            </button>

            <button className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-3">
              <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-400">
                shield
              </span>
              <div>
                <p className="font-medium text-sm text-[#1a110f] dark:text-[#f2eae8]">
                  Privacy & Security
                </p>
                <p className="text-xs text-[#926154] dark:text-[#d6c1bd]">
                  Control your privacy
                </p>
              </div>
            </button>

            <button className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-3">
              <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-400">
                language
              </span>
              <div>
                <p className="font-medium text-sm text-[#1a110f] dark:text-[#f2eae8]">
                  Language
                </p>
                <p className="text-xs text-[#926154] dark:text-[#d6c1bd]">
                  English
                </p>
              </div>
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

            <button
              onClick={signOut}
              className="w-full px-4 py-3 text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <div>
                <p className="font-medium text-sm">Sign Out</p>
                <p className="text-xs opacity-70">Sign out of your account</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

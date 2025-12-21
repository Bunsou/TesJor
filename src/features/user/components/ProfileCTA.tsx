"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function ProfileCTA() {
  return (
    <div className="bg-gradient-to-br from-primary to-orange-400 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="size-5" />
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold">
            New
          </span>
        </div>
        <h3 className="font-bold text-lg mb-1">Unlock Premium</h3>
        <p className="text-sm text-white/90 mb-4">
          Get exclusive badges, faster XP, and personalized trip
          recommendations.
        </p>
        <Link
          href="/premium"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-xl font-semibold text-sm hover:bg-white/90 transition-all shadow-md group-hover:shadow-lg"
        >
          Learn More
          <span className="material-symbols-outlined text-base">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}

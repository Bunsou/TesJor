"use client";

import { LocateFixed } from "lucide-react";

interface MapControlsProps {
  onRecenter: () => void;
}

export function MapControls({ onRecenter }: MapControlsProps) {
  return (
    <div className="absolute bottom-20 md:bottom-8 right-3 md:right-16 flex flex-col gap-2 md:gap-3 z-20">
      <button
        onClick={onRecenter}
        className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white dark:bg-[#2A201D] text-[#1a110f] dark:text-[#f2eae8] shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-gray-200 dark:border-gray-700"
        title="Recenter to my location"
      >
        <LocateFixed className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
}

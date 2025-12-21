"use client";

import { LocateFixed } from "lucide-react";

interface MapControlsProps {
  onRecenter: () => void;
}

export function MapControls({ onRecenter }: MapControlsProps) {
  return (
    <div className="absolute bottom-28 md:bottom-8 right-8 md:right-16 flex flex-col gap-3 z-20">
      <button
        onClick={onRecenter}
        className="w-12 h-12 rounded-xl bg-white dark:bg-[#2A201D] text-[#1a110f] dark:text-[#f2eae8] shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-gray-200 dark:border-gray-700"
        title="Recenter to my location"
      >
        <span className="material-symbols-outlined">
          <LocateFixed />
        </span>
      </button>
    </div>
  );
}

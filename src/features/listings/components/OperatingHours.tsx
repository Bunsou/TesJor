"use client";

import { useState } from "react";

export function OperatingHours() {
  const [showHours, setShowHours] = useState(true);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A201D] overflow-hidden">
      <button
        onClick={() => setShowHours(!showHours)}
        className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-white">
              Operating Hours
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              Open Now
            </p>
          </div>
        </div>
        <span
          className={`material-symbols-outlined transition-transform text-gray-500 dark:text-gray-400 ${
            showHours ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>
      {showHours && (
        <div className="px-4 pb-4 pt-0 text-sm border-t border-gray-100 dark:border-gray-800 mt-2">
          <div className="flex flex-col gap-3 pt-3">
            <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Monday - Friday
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                09:00 AM - 05:00 PM
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Saturday - Sunday
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                10:00 AM - 04:00 PM
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

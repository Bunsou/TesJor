"use client";

import { ChevronDown, Clock4 } from "lucide-react";
import { useState } from "react";

interface TimeSlot {
  days: string[];
  open: string;
  close: string;
  closed: boolean;
}

export interface OperatingHoursProps {
  operatingHours?: TimeSlot[] | null;
}

// Map day abbreviations to full names
const dayMap: Record<string, string> = {
  M: "Monday",
  T: "Tuesday",
  W: "Wednesday",
  Th: "Thursday",
  F: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
};

// Format time from 24h to 12h format
const formatTime = (time: string): string => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour.toString().padStart(2, "0")}:${minutes} ${ampm}`;
};

// Format day range (e.g., "Monday - Friday")
const formatDayRange = (days: string[]): string => {
  if (days.length === 0) return "";
  if (days.length === 1) return dayMap[days[0]] || days[0];

  // Check if it's a continuous range
  const dayOrder = ["M", "T", "W", "Th", "F", "Sa", "Su"];
  const sortedDays = [...days].sort(
    (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
  );

  // If consecutive days, show as range
  const isConsecutive = sortedDays.every((day, idx) => {
    if (idx === 0) return true;
    return dayOrder.indexOf(day) === dayOrder.indexOf(sortedDays[idx - 1]) + 1;
  });

  if (isConsecutive && sortedDays.length > 2) {
    return `${dayMap[sortedDays[0]]} - ${
      dayMap[sortedDays[sortedDays.length - 1]]
    }`;
  }

  // Otherwise, list them out
  return sortedDays.map((d) => dayMap[d] || d).join(", ");
};

export function OperatingHours({ operatingHours }: OperatingHoursProps) {
  const [showHours, setShowHours] = useState(true);

  // If no operating hours provided, don't render
  if (!operatingHours || operatingHours.length === 0) {
    return null;
  }

  // Check if currently open (simplified - just checks if any slot is not closed)
  const hasOpenHours = operatingHours.some((slot) => !slot.closed);
  const isOpenNow = hasOpenHours; // You can enhance this with actual time checking

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A201D] overflow-hidden">
      <button
        onClick={() => setShowHours(!showHours)}
        className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <span className="material-symbols-outlined">
              <Clock4 />
            </span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-white">
              Operating Hours
            </p>
            <p
              className={`text-xs font-medium ${
                isOpenNow
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isOpenNow ? "Open Now" : "Closed"}
            </p>
          </div>
        </div>
        <span
          className={`material-symbols-outlined transition-transform text-gray-500 dark:text-gray-400 ${
            showHours ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={20} />
        </span>
      </button>
      {showHours && (
        <div className="px-4 pb-4 pt-0 text-sm border-t border-gray-100 dark:border-gray-800 mt-2">
          <div className="flex flex-col gap-3 pt-3">
            {operatingHours.map((slot, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-800/50 last:border-0"
              >
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {formatDayRange(slot.days)}
                </span>
                <span
                  className={`font-semibold ${
                    slot.closed
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {slot.closed
                    ? "Closed"
                    : `${formatTime(slot.open)} - ${formatTime(slot.close)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

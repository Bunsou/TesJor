"use client";

import {
  CalendarCheck,
  CircleCheck,
  MessageSquareHeart,
  Star,
} from "lucide-react";

interface TravelHistoryItem {
  id: string;
  type: "visit" | "quest" | "review";
  title: string;
  subtitle: string;
  date: string;
  xp?: number;
  rating?: number;
  image?: string;
  note?: string;
}

interface TravelHistoryProps {
  items: TravelHistoryItem[];
}

const getHistoryIcon = (type: string) => {
  switch (type) {
    case "visit":
      return <CalendarCheck className="size-[1.2rem]" />;
    case "quest":
      return <CircleCheck className="size-[1.2rem]" />;
    case "review":
      return <MessageSquareHeart className="size-[1.2rem]" />;
    default:
      return "location_on";
  }
};

const getHistoryColor = (type: string) => {
  switch (type) {
    case "visit":
      return "bg-primary/10 text-primary";
    case "quest":
      return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
    case "review":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    default:
      return "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400";
  }
};

export function TravelHistory({ items }: TravelHistoryProps) {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold text-[#1a110f] dark:text-[#f2eae8] mb-5">
        Travel History
      </h2>
      <div className="relative">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="relative pl-12 pb-6">
              {index < items.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              )}

              <div className="flex gap-4">
                <div
                  className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center ${getHistoryColor(
                    item.type
                  )}`}
                >
                  {getHistoryIcon(item.type)}
                </div>

                <div className="flex-1 bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-[#1a110f] dark:text-[#f2eae8]">
                      {item.title}
                    </h4>
                    {item.xp && (
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center gap-0.5">
                        +{item.xp} XP
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#926154] dark:text-[#d6c1bd] mb-1">
                    {item.subtitle}
                  </p>

                  {item.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${
                            i < item.rating!
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {item.note && (
                    <p className="text-xs text-[#926154] dark:text-[#d6c1bd] italic border-l-2 border-primary/30 pl-2 py-1 mt-2">
                      &quot;{item.note}&quot;
                    </p>
                  )}

                  <p className="text-[10px] text-[#926154] dark:text-[#d6c1bd] mt-2">
                    {item.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full mt-4 py-3 rounded-xl bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-800 text-[#1a110f] dark:text-[#f2eae8] font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
        View Full History
      </button>
    </div>
  );
}

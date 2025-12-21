import { ReactNode } from "react";

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

interface TravelHistoryItemProps {
  item: TravelHistoryItem;
  icon: ReactNode;
  iconColor: string;
}

export function TravelHistoryItem({
  item,
  icon,
  iconColor,
}: TravelHistoryItemProps) {
  return (
    <div className="relative pl-10 pb-10">
      {/* Timeline Icon */}
      <div
        className={`absolute left-0 top-0 w-10 h-10 rounded-full ${iconColor} flex items-center justify-center shadow-md`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="ml-2">
        <div className="flex items-start justify-between mb-1">
          <h4 className="font-semibold text-[#1a110f] dark:text-[#f2eae8] text-sm">
            {item.title}
          </h4>
          {item.xp && (
            <span className="text-xs font-bold text-primary shrink-0 ml-2">
              +{item.xp} XP
            </span>
          )}
        </div>
        <p className="text-xs text-[#926154] dark:text-[#d6c1bd] mb-2">
          {item.subtitle}
        </p>
        {item.note && (
          <p className="text-xs text-[#666] dark:text-[#999] italic mb-2">
            &quot;{item.note}&quot;
          </p>
        )}
        {item.rating && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`material-symbols-outlined text-sm ${
                  i < item.rating!
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              >
                star
              </span>
            ))}
          </div>
        )}
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {item.date}
        </span>
      </div>
    </div>
  );
}

import { Check } from "lucide-react";

const DEFAULT_HIGHLIGHTS = [
  "Authentic Local Experience",
  "Photo Opportunities",
  "Cultural Significance",
  "Family Friendly",
];

interface HighlightsListProps {
  highlights?: string[];
}

export function HighlightsList({
  highlights = DEFAULT_HIGHLIGHTS,
}: HighlightsListProps) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A201D] p-5 shadow-sm">
      <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
        Highlights
      </h4>
      <ul className="flex flex-col gap-3">
        {highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex items-start gap-3 text-sm group cursor-default"
          >
            <span className="w-6 h-6 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center shrink-0 group-hover:bg-[#E07A5F] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">
                <Check size={16} />
              </span>
            </span>
            <span className="py-0.5 text-gray-900 dark:text-white">
              {highlight}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

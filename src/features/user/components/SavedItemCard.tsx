import Image from "next/image";

interface SavedItemCardProps {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export function SavedItemCard({ title, subtitle, image }: SavedItemCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#332621] hover:bg-gray-100 dark:hover:bg-[#3d2e28] transition-colors cursor-pointer group">
      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-[#1a110f] dark:text-[#f2eae8] truncate">
          {title}
        </h4>
        <p className="text-xs text-[#926154] dark:text-[#d6c1bd]">{subtitle}</p>
      </div>
      <span className="material-symbols-outlined text-[#926154] dark:text-[#d6c1bd] group-hover:translate-x-1 transition-transform">
        chevron_right
      </span>
    </div>
  );
}

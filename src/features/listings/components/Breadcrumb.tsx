import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface BreadcrumbProps {
  category: string;
  title: string;
}

export function Breadcrumb({ category, title }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm text-gray-500 dark:text-gray-400">
      <Link href="/explore" className="hover:text-[#E07A5F] cursor-pointer">
        Explore
      </Link>
      <span className="material-symbols-outlined">
        <ChevronRight size={14} className="md:w-4 md:h-4" />
      </span>
      <Link
        href={`/explore`}
        className="hover:text-[#E07A5F] cursor-pointer capitalize"
      >
        {category}
      </Link>
      <span className="material-symbols-outlined">
        <ChevronRight size={14} className="md:w-4 md:h-4" />
      </span>
      <span className="font-medium text-gray-900 dark:text-white truncate">
        {title}
      </span>
    </div>
  );
}

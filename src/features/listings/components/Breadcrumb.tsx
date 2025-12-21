import Link from "next/link";

interface BreadcrumbProps {
  category: string;
  title: string;
}

export function Breadcrumb({ category, title }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link href="/explore" className="hover:text-[#E07A5F] cursor-pointer">
        Explore
      </Link>
      <span className="material-symbols-outlined text-xs">chevron_right</span>
      <span className="hover:text-[#E07A5F] cursor-pointer capitalize">
        {category}
      </span>
      <span className="material-symbols-outlined text-xs">chevron_right</span>
      <span className="font-medium text-gray-900 dark:text-white">{title}</span>
    </div>
  );
}

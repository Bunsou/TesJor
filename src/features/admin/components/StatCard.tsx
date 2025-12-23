import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  hoverBorderColor: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  hoverBorderColor,
}: StatCardProps) {
  return (
    <div
      className={`bg-white dark:bg-[#2A201D] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col justify-between group ${hoverBorderColor} transition-colors`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div
          className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor} group-hover:bg-opacity-100transition-colors`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

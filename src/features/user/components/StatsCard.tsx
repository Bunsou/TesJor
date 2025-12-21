interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subLabel?: string;
  iconBgColor: string;
  iconColor: string;
}

export function StatsCard({
  icon,
  label,
  value,
  subLabel,
  iconBgColor,
  iconColor,
}: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-[#2A201D] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        {label}
      </p>
      {subLabel && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {subLabel}
        </p>
      )}
    </div>
  );
}

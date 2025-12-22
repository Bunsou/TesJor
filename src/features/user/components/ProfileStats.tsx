interface ProfileStatsGridProps {
  stats: {
    placesVisited: number;
    xpEarned: number;
    reviews: number;
    bookmarked: number;
  };
}

export function ProfileStatsGrid({ stats }: ProfileStatsGridProps) {
  const statItems = [
    {
      icon: "location_on",
      label: "Places Visited",
      value: stats.placesVisited,
      color:
        "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    },
    {
      icon: "star",
      label: "XP Earned",
      value: stats.xpEarned,
      color:
        "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    },
    {
      icon: "rate_review",
      label: "Reviews",
      value: stats.reviews,
      color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      icon: "bookmark",
      label: "Bookmarked",
      value: stats.bookmarked,
      color: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-white dark:bg-[#2A201D] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <div
            className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}
          >
            <span className="material-symbols-outlined text-xl">
              {item.icon}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-[#1a110f] dark:text-[#f2eae8] mb-1">
            {item.value}
          </h3>
          <p className="text-xs text-[#926154] dark:text-[#d6c1bd]">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

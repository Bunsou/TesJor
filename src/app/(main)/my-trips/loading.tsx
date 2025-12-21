export default function MyTripsLoading() {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-background dark:bg-[#201512]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          {/* Title */}
          <div className="bg-gray-200 dark:bg-gray-700 h-10 w-64 rounded-lg" />

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-3">
              <div className="bg-gray-200 dark:bg-gray-700 h-6 w-32 rounded" />
              <div className="bg-gray-200 dark:bg-gray-700 h-10 w-16 rounded" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-3">
              <div className="bg-gray-200 dark:bg-gray-700 h-6 w-32 rounded" />
              <div className="bg-gray-200 dark:bg-gray-700 h-10 w-16 rounded" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-gray-200 dark:bg-gray-700 h-10 w-32 rounded-t-lg" />
          <div className="bg-gray-200 dark:bg-gray-700 h-10 w-32 rounded-t-lg" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="flex gap-2 mt-2">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

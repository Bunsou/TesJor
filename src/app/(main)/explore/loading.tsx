export default function ExploreLoading() {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#FDFCF6] dark:bg-[#201512]">
      <div className="max-w-5xl mx-auto px-4 lg:px-10 py-8">
        {/* Search Header */}
        <div className="mb-10">
          <div className="bg-gray-200 dark:bg-gray-700 h-12 rounded-full w-full mb-4" />
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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

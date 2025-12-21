export default function MapLoading() {
  return (
    <div className="relative w-full h-full">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800">
        {/* Simple marker indicators */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-[#E07A5F]/30 rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-[#E07A5F]/20 rounded-full" />
        <div className="absolute bottom-1/3 left-1/2 w-10 h-10 bg-[#E07A5F]/40 rounded-full" />
        <div className="absolute top-2/3 right-1/4 w-7 h-7 bg-[#E07A5F]/25 rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-9 h-9 bg-[#E07A5F]/35 rounded-full" />
      </div>

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 z-10">
        <div className="bg-white dark:bg-gray-700 h-12 rounded-full shadow-lg" />
      </div>

      {/* Category Pills */}
      <div className="absolute top-20 left-4 right-4 z-10">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-9 w-24 bg-white dark:bg-gray-700 rounded-full shadow-md flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg" />
        <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg" />
      </div>

      {/* Loading Indicator */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-white dark:bg-gray-700 rounded-xl px-6 py-4 shadow-lg">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            Loading map...
          </p>
        </div>
      </div>
    </div>
  );
}

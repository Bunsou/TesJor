export default function ProfileLoading() {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-background dark:bg-[#201512]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-2"
            >
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>

        {/* Level Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="h-7 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

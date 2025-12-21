export default function ExploreDetailLoading() {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#FDFCF6] dark:bg-[#201512]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6 md:gap-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Image */}
        <div className="w-full h-[400px] md:h-[500px] bg-gray-200 dark:bg-gray-700 rounded-2xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>

            {/* Operating Hours */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-4">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-4">
              <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-3"
                >
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Action Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-4">
              <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-4">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"
                  />
                ))}
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
              <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

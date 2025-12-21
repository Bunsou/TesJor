"use client";

export function TripsLoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

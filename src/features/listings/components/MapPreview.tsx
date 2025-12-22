import { Map, Navigation } from "lucide-react";
import Link from "next/link";

interface MapPreviewProps {
  lat: string | number;
  lng: string | number;
  addressText?: string | null;
  province?: string | null;
}

export function MapPreview({
  lat,
  lng,
  addressText,
  province,
}: MapPreviewProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A201D] p-1 shadow-sm">
      <div className="w-full h-80 lg:h-75 rounded-lg bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=${
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
          }&q=${lat},${lng}&zoom=14`}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <Link
          href={`/map?lat=${lat}&lng=${lng}`}
          className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors cursor-pointer group"
        >
          <span className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full shadow-lg group-hover:scale-105 transition-transform flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">
              <Map size={20} />
            </span>
            Explore Map
          </span>
        </Link>
      </div>
      <div className="p-3 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {province || "Location"}
          </p>
          <p className="text-sm font-semibold mt-0.5 text-gray-900 dark:text-white">
            {addressText || "View on map"}
          </p>
        </div>
        <span className="material-symbols-outlined text-[#E07A5F]">
          <Navigation size={20} />
        </span>
      </div>
    </div>
  );
}

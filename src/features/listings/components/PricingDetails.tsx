"use client";

import { ChevronDown, CircleDollarSign } from "lucide-react";
import { useState } from "react";

interface PriceOption {
  label: string;
  price: string;
}

export interface PricingDetailsProps {
  priceDetails?: PriceOption[] | null;
  priceLevel?: string | null;
}

export function PricingDetails({
  priceDetails,
  priceLevel,
}: PricingDetailsProps) {
  const [showPricing, setShowPricing] = useState(true);

  // If no pricing details provided, don't render
  if (!priceDetails || priceDetails.length === 0) {
    return null;
  }

  // Format price with $ symbol
  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return `$${numPrice.toFixed(2)}`;
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A201D] overflow-hidden">
      <button
        onClick={() => setShowPricing(!showPricing)}
        className="w-full flex items-center justify-between p-3 md:p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CircleDollarSign size={18} className="md:w-5 md:h-5" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">
              Pricing Details
            </p>
            {priceLevel && (
              <p className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-400">
                Price Level: {priceLevel}
              </p>
            )}
          </div>
        </div>
        <span
          className={`material-symbols-outlined transition-transform text-gray-500 dark:text-gray-400 ${
            showPricing ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={18} className="md:w-5 md:h-5" />
        </span>
      </button>
      {showPricing && (
        <div className="px-3 md:px-4 pb-3 md:pb-4 pt-0 text-xs md:text-sm border-t border-gray-100 dark:border-gray-800 mt-2">
          <div className="flex flex-col gap-2 md:gap-3 pt-2 md:pt-3">
            {priceDetails.map((option, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-800/50 last:border-0"
              >
                <span className="font-medium text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                  {option.label}
                </span>
                <span className="font-semibold text-xs md:text-sm text-emerald-600 dark:text-emerald-400">
                  {formatPrice(option.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

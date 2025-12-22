import { ReactNode } from "react";

interface ActionButtonProps {
  icon: ReactNode;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
  variant?: "default" | "compact" | "overlay";
  activeColor?: string;
  className?: string;
}

export function ActionButton({
  icon,
  active = false,
  onClick,
  title,
  variant = "default",
  activeColor = "bg-white dark:bg-black/80 text-red-500",
  className = "",
}: ActionButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return "w-8 h-8 text-base";
      case "overlay":
        return "p-2 backdrop-blur-sm shadow-sm";
      default:
        return "p-2";
    }
  };

  const baseStyles =
    "rounded-full transition-all flex items-center justify-center";
  const inactiveStyles =
    variant === "overlay"
      ? "bg-white/80 dark:bg-black/50"
      : "bg-white dark:bg-[#2A201D] text-gray-700 dark:text-gray-300 hover:text-red-500 border border-gray-200 dark:border-gray-700";

  return (
    <button
      onClick={onClick}
      title={title}
      className={`${baseStyles} ${getVariantStyles()} ${
        active ? activeColor : inactiveStyles
      } ${className}`}
    >
      {icon}
    </button>
  );
}

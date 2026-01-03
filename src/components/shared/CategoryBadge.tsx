interface CategoryBadgeProps {
  category: string;
  variant?: "default" | "compact";
  className?: string;
}

export function CategoryBadge({
  category,
  variant = "default",
  className = "",
}: CategoryBadgeProps) {
  const getCategoryStyle = (cat: string) => {
    const styles: Record<string, string> = {
      place:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",

      event:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      food: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      souvenir:
        "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    };
    return (
      styles[cat] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  const baseStyles =
    variant === "compact" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`${baseStyles} rounded-lg font-bold capitalize ${getCategoryStyle(
        category
      )} ${className}`}
    >
      {category === "food" ? "Food & Drink" : category}
    </span>
  );
}

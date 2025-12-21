import { ReactNode, JSX } from "react";

interface Badge {
  id: string;
  name: string;
  icon: string | JSX.Element;
  earned: boolean;
  color: string;
}

interface BadgeItemProps {
  badge: Badge;
  colors: string;
}

export function BadgeItem({ badge, colors }: BadgeItemProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-xl ${colors} transition-all ${
        badge.earned ? "cursor-pointer hover:scale-105" : "cursor-not-allowed"
      }`}
    >
      <div className="text-3xl mb-2">
        {typeof badge.icon === "string" ? (
          <span className="text-4xl">{badge.icon}</span>
        ) : (
          badge.icon
        )}
      </div>
      <p className="text-xs font-medium text-center">{badge.name}</p>
      {!badge.earned && <p className="text-[10px] mt-1 opacity-70">Locked</p>}
    </div>
  );
}

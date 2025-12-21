import { Trees, Utensils, TreePalm, Martini, Mountain } from "lucide-react";

export const SAMPLE_TRAVEL_HISTORY = [
  {
    id: "1",
    type: "visit" as const,
    title: 'Attended "Sangkran at Kampong Phluk"',
    subtitle: "Cultural Event • Siem Reap",
    date: "2 days ago",
    xp: 100,
    image: "/default-image/placeholder.png",
    note: "Amazing energy! The boat races were the highlight.",
  },
  {
    id: "2",
    type: "quest" as const,
    title: 'Completed Quest: "Temple Hunter"',
    subtitle: "Achievement Unlocked",
    date: "1 week ago",
    xp: 500,
  },
  {
    id: "3",
    type: "review" as const,
    title: 'Reviewed "Nom Banh Chok Teuk Sray"',
    subtitle: "Local Food • Battambang",
    date: "2 weeks ago",
    rating: 5,
  },
];

export const SAMPLE_SAVED_ITEMS = [
  {
    id: "1",
    title: "Angkor Sangkran",
    subtitle: "Apr 14 • Siem Reap",
    image: "/default-image/placeholder.png",
  },
  {
    id: "2",
    title: "Kulen Waterfall Hike",
    subtitle: "Nature • Siem Reap",
    image: "/default-image/placeholder.png",
  },
];

export const SAMPLE_BADGES = [
  {
    id: "1",
    name: "Temple Master",
    icon: "/icons/angkor-wat.png",
    earned: true,
    color: "blue",
  },
  {
    id: "2",
    name: "Nature Lover",
    icon: <Trees />,
    earned: true,
    color: "green",
  },
  {
    id: "3",
    name: "Foodie",
    icon: <Utensils />,
    earned: true,
    color: "yellow",
  },
  {
    id: "4",
    name: "Island Hopper",
    icon: <TreePalm />,
    earned: false,
    color: "gray",
  },
  {
    id: "5",
    name: "Night Owl",
    icon: <Martini />,
    earned: false,
    color: "gray",
  },
  {
    id: "6",
    name: "Adventurer",
    icon: <Mountain />,
    earned: false,
    color: "gray",
  },
];

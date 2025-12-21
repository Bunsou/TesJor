import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Listing } from "@/server/db/schema";

interface ItemDetailResponse {
  item: Listing;
  isBookmarked: boolean;
  isVisited: boolean;
}

interface UseItemDetailReturn {
  data: ItemDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  handleBookmark: (action: "add" | "remove") => Promise<void>;
  handleVisited: (action: "add" | "remove") => Promise<void>;
}

async function fetchItem(id: string): Promise<ItemDetailResponse> {
  const res = await fetch(`/api/listings/${id}`);
  if (!res.ok) throw new Error("Failed to fetch item");
  const json = await res.json();

  // Fetch user progress for this item
  let isBookmarked = false;
  let isVisited = false;

  try {
    const progressRes = await fetch(`/api/user/progress?itemId=${id}`);
    if (progressRes.ok) {
      const progressJson = await progressRes.json();
      isBookmarked = progressJson.data?.isBookmarked || false;
      isVisited = progressJson.data?.isVisited || false;
    }
  } catch {
    // User might not be logged in
  }

  return {
    item: json.data,
    isBookmarked,
    isVisited,
  };
}

async function toggleBookmark({
  itemId,
  category,
  action,
}: {
  itemId: string;
  category: string;
  action: "add" | "remove";
}) {
  const res = await fetch("/api/user/bookmark", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, category, action }),
  });
  if (!res.ok) throw new Error("Failed to toggle bookmark");
  return res.json();
}

async function toggleVisited({
  itemId,
  category,
  action,
}: {
  itemId: string;
  category: string;
  action: "add" | "remove";
}) {
  const res = await fetch("/api/user/visited", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, category, action }),
  });
  if (!res.ok) throw new Error("Failed to toggle visited");
  return res.json();
}

function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

export function useItemDetail(id: string): UseItemDetailReturn {
  const [data, setData] = useState<ItemDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadItem() {
      try {
        setIsLoading(true);
        setError(null);
        const itemData = await fetchItem(id);
        if (isMounted) {
          setData(itemData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load item");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadItem();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBookmark = async (action: "add" | "remove") => {
    if (!data) return;
    try {
      await toggleBookmark({
        itemId: id,
        category: data.item.category,
        action,
      });
      const itemData = await fetchItem(id);
      setData(itemData);
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const handleVisited = async (action: "add" | "remove") => {
    if (!data) return;
    try {
      const result = await toggleVisited({
        itemId: id,
        category: data.item.category,
        action,
      });
      const itemData = await fetchItem(id);
      setData(itemData);
      if (result.visited) {
        triggerConfetti();
      }
    } catch (err) {
      console.error("Failed to toggle visited:", err);
    }
  };

  return {
    data,
    isLoading,
    error,
    handleBookmark,
    handleVisited,
  };
}

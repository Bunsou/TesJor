import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { Listing } from "@/server/db/schema";

interface Review {
  id: string;
  rating: number;
  content: string | null;
  userId: string;
  userName: string | null;
  userImage: string | null;
  createdAt: Date;
}

interface ItemDetailResponse {
  item: Listing & { reviews?: Review[] };
  isBookmarked: boolean;
  isVisited: boolean;
}

interface UseListingsSlugDetailReturn {
  data: ItemDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  isBookmarkLoading: boolean;
  isVisitedLoading: boolean;
  handleBookmark: (action: "add" | "remove") => Promise<void>;
  handleVisited: (action: "add" | "remove") => Promise<void>;
  refreshData: () => Promise<void>;
}

async function fetchItem(slug: string): Promise<ItemDetailResponse> {
  const res = await fetch(`/api/listings/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch item");
  const json = await res.json();

  // Fetch user progress for this item using the item's ID from response
  let isBookmarked = false;
  let isVisited = false;

  try {
    const progressRes = await fetch(
      `/api/user/progress?itemId=${json.data.id}`
    );
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
    body: JSON.stringify({ listingId: itemId, action }),
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
    body: JSON.stringify({ listingId: itemId, action }),
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

export function useListingsSlugDetail(
  slug: string
): UseListingsSlugDetailReturn {
  const [data, setData] = useState<ItemDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [isVisitedLoading, setIsVisitedLoading] = useState(false);

  const loadItem = useCallback(async () => {
    try {
      setError(null);
      const itemData = await fetchItem(slug);
      setData(itemData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load item");
    }
  }, [slug]);

  const refreshData = useCallback(async () => {
    await loadItem();
  }, [loadItem]);

  useEffect(() => {
    let isMounted = true;

    async function initialLoad() {
      try {
        setIsLoading(true);
        setError(null);
        const itemData = await fetchItem(slug);
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

    initialLoad();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleBookmark = async (action: "add" | "remove") => {
    if (!data || isBookmarkLoading) return;

    // Store previous state for rollback
    const previousState = data.isBookmarked;

    try {
      // Optimistic update - update UI immediately
      setIsBookmarkLoading(true);
      setData({
        ...data,
        isBookmarked: action === "add",
      });

      // Make API call in background
      await toggleBookmark({
        itemId: data.item.id,
        category: data.item.category,
        action,
      });
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      // Rollback on error
      setData({
        ...data,
        isBookmarked: previousState,
      });
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleVisited = async (action: "add" | "remove") => {
    if (!data || isVisitedLoading) return;

    // Store previous state for rollback
    const previousState = data.isVisited;

    try {
      // Optimistic update - update UI immediately
      setIsVisitedLoading(true);
      setData({
        ...data,
        isVisited: action === "add",
      });

      // Trigger confetti immediately on add for better UX
      if (action === "add") {
        triggerConfetti();
      }

      // Make API call in background
      await toggleVisited({
        itemId: data.item.id,
        category: data.item.category,
        action,
      });
    } catch (err) {
      console.error("Failed to toggle visited:", err);
      // Rollback on error
      setData({
        ...data,
        isVisited: previousState,
      });
    } finally {
      setIsVisitedLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    isBookmarkLoading,
    isVisitedLoading,
    handleBookmark,
    handleVisited,
    refreshData,
  };
}

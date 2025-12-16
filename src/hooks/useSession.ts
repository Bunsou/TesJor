"use client";

import { useQuery } from "@tanstack/react-query";
import { Session } from "@/lib/auth";

async function getSession(): Promise<Session | null> {
  try {
    const res = await fetch("/api/auth/get-session", {
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.session;
  } catch {
    return null;
  }
}

export function useSession() {
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  return { session, isLoading };
}

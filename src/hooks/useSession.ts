"use client";

import { useState, useEffect } from "react";
import { Session } from "@/server/services/auth";

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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const sessionData = await getSession();
        if (isMounted) {
          setSession(sessionData);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return { session, isLoading };
}

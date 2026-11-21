"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, onAuthChange, type AuthUser } from "./auth";

export function useUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
    return onAuthChange(() => setUser(getCurrentUser()));
  }, []);

  return { user, username: user?.username ?? null, loading };
}
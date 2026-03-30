"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { AccountPreview } from "./account-preview";

export async function loadAuthenticatedAccount(): Promise<AccountPreview | null> {
  const supabase = createBrowserSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session?.access_token) {
    return null;
  }

  const response = await fetch("/api/account-session", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? "Unable to load your account.");
  }

  return (await response.json()) as AccountPreview;
}

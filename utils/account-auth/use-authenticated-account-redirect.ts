"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function useAuthenticatedAccountRedirect() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        if (data.session) {
          router.replace("/account");
          return;
        }
      } catch {
        // If Supabase isn't configured yet, keep the page accessible.
      }

      if (isMounted) {
        setIsCheckingSession(false);
      }
    };

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return isCheckingSession;
}

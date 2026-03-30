"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { writeAccountPreview } from "@/utils/account-auth/account-preview";
import { getHomePathForRole } from "@/utils/account-auth/account-role";
import { loadAuthenticatedAccount } from "@/utils/account-auth/load-authenticated-account";

export function useAuthenticatedAccountRedirect() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const account = await loadAuthenticatedAccount();

        if (!isMounted) {
          return;
        }

        if (account) {
          writeAccountPreview(account);
          router.replace(getHomePathForRole(account.role));
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

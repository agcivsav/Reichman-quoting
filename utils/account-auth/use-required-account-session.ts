"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearAccountPreview,
  readAccountPreview,
  writeAccountPreview,
} from "@/utils/account-auth/account-preview";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type AccountState = {
  email: string;
  name: string;
};

export function useRequiredAccountSession() {
  const router = useRouter();
  const [account, setAccount] = useState<AccountState | null>(() => readAccountPreview());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(() => !readAccountPreview());

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;

        if (!isMounted) {
          return;
        }

        if (!user) {
          clearAccountPreview();
          router.replace("/account/login");
          return;
        }

        const firstName =
          typeof user.user_metadata?.first_name === "string"
            ? user.user_metadata.first_name
            : "";
        const lastName =
          typeof user.user_metadata?.last_name === "string"
            ? user.user_metadata.last_name
            : "";

        const nextAccount = {
          email: user.email ?? "",
          name: `${firstName} ${lastName}`.trim(),
        };

        writeAccountPreview(nextAccount);
        setAccount(nextAccount);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        clearAccountPreview();
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load your account.",
        );
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return {
    account,
    errorMessage,
    isCheckingSession,
  };
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearAccountPreview,
  readAccountPreview,
  writeAccountPreview,
} from "@/utils/account-auth/account-preview";
import type { AccountRole } from "@/utils/account-auth/account-role";
import { getHomePathForRole } from "@/utils/account-auth/account-role";
import { loadAuthenticatedAccount } from "@/utils/account-auth/load-authenticated-account";

type UseRequiredAccountSessionOptions = {
  allowedRoles: readonly AccountRole[];
};

export function useRequiredAccountSession({
  allowedRoles,
}: UseRequiredAccountSessionOptions) {
  const router = useRouter();
  const allowedRolesKey = allowedRoles.join("|");
  const [account, setAccount] = useState(() => {
    const preview = readAccountPreview();
    return preview && allowedRoles.includes(preview.role) ? preview : null;
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(() => {
    const preview = readAccountPreview();
    return !preview || !allowedRoles.includes(preview.role);
  });

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const nextAccount = await loadAuthenticatedAccount();

        if (!isMounted) {
          return;
        }

        if (!nextAccount) {
          clearAccountPreview();
          router.replace("/account/login");
          return;
        }

        if (!allowedRoles.includes(nextAccount.role)) {
          writeAccountPreview(nextAccount);
          router.replace(getHomePathForRole(nextAccount.role));
          return;
        }

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
  }, [allowedRolesKey, allowedRoles, router]);

  return {
    account,
    errorMessage,
    isCheckingSession,
  };
}

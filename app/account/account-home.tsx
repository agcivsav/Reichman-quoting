"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { clearAccountPreview } from "@/utils/account-auth/account-preview";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRequiredAccountSession } from "@/utils/account-auth/use-required-account-session";

const accountAllowedRoles = ["customer", "sales_representative"] as const;

export default function AccountHome() {
  const router = useRouter();
  const { account, errorMessage, isCheckingSession } = useRequiredAccountSession({
    allowedRoles: accountAllowedRoles,
  });
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const confirmSignOut = async () => {
    setIsLoggingOut(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signOut({ scope: "local" });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      setIsLoggingOut(false);
      toast.error(error instanceof Error ? error.message : "Unable to log out.");
      return;
    }

    clearAccountPreview();
    setIsLogoutDialogOpen(false);
    setIsLoggingOut(false);
    toast.success("Logged out successfully.");
    router.replace("/account/login");
    router.refresh();
  };

  if (isCheckingSession) {
    return (
      <main className="page-shell grain-overlay">
        <section className="mx-auto w-full max-w-4xl px-5 pt-6 pb-8 sm:px-8 lg:pt-10 lg:pb-12">
          <div className="rounded-[2rem] border border-white/70 bg-white/84 px-6 py-10 text-sm text-muted shadow-[0_28px_80px_rgba(20,50,37,0.08)] backdrop-blur sm:px-8 lg:px-10">
            Loading your account...
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="page-shell grain-overlay">
        <section className="mx-auto w-full max-w-4xl px-5 pt-6 pb-8 sm:px-8 lg:pt-10 lg:pb-12">
          <div className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-10 text-sm text-red-700 shadow-[0_28px_80px_rgba(20,50,37,0.08)] sm:px-8 lg:px-10">
            {errorMessage}
          </div>
        </section>
      </main>
    );
  }

  if (!account) {
    return null;
  }

  return (
    <main className="page-shell grain-overlay">
      <ConfirmDialog
        cancelLabel="Stay signed in"
        confirmLabel="Log out"
        confirmPendingLabel="Logging out..."
        description="You will be signed out of your Reichman Sales & Service account and returned to the login page."
        isOpen={isLogoutDialogOpen}
        isPending={isLoggingOut}
        onCancel={() => setIsLogoutDialogOpen(false)}
        onConfirm={confirmSignOut}
        title="Log out?"
      />
      <section className="mx-auto w-full max-w-4xl px-5 pt-6 pb-8 sm:px-8 lg:pt-10 lg:pb-12">
        <div className="rounded-[2rem] border border-white/70 bg-white/84 shadow-[0_28px_80px_rgba(20,50,37,0.08)] backdrop-blur">
          <div className="border-b border-brand/10 bg-[linear-gradient(135deg,rgba(31,75,58,0.08),rgba(197,145,70,0.12))] px-6 py-8 sm:px-8 lg:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand">
              Reichman Sales &amp; Service
            </p>
            <h1 className="mt-4 font-display text-4xl text-brand-strong sm:text-5xl">
              Account
            </h1>
          </div>

          <div className="px-6 py-8 sm:px-8 lg:px-10">
            <p className="text-lg font-semibold text-brand-strong">
              {account.name || "Welcome back"}
            </p>
            <p className="mt-2 text-sm leading-7 text-muted">{account.email}</p>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-muted">
              Your account area is ready. Next we can wire this screen into profile,
              orders, approvals, and account management tools.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-brand-strong hover:border-brand/25"
              >
                Go to home
              </Link>
              <button
                type="button"
                onClick={() => setIsLogoutDialogOpen(true)}
                className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

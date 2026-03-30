"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { LoginFormValues } from "@/types/account-login";
import {
  readAccountRoleHint,
  writeAccountPreview,
} from "@/utils/account-auth/account-preview";
import {
  getHomePathForRole,
  isAccountRole,
} from "@/utils/account-auth/account-role";
import { loadAuthenticatedAccount } from "@/utils/account-auth/load-authenticated-account";
import { useAuthenticatedAccountRedirect } from "@/utils/account-auth/use-authenticated-account-redirect";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClassName =
  "mt-2.5 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-sm text-foreground shadow-[0_1px_0_rgba(255,255,255,0.8),0_10px_25px_rgba(20,50,37,0.03)] placeholder:text-muted/70 focus:border-brand/30 focus:shadow-[0_0_0_4px_rgba(197,145,70,0.12)] focus:outline-none";

function getAccountName(user: User | null | undefined) {
  const firstName =
    typeof user?.user_metadata?.first_name === "string" ? user.user_metadata.first_name : "";
  const lastName =
    typeof user?.user_metadata?.last_name === "string" ? user.user_metadata.last_name : "";

  return `${firstName} ${lastName}`.trim();
}

function getOptimisticAccount(user: User | null | undefined, fallbackEmail: string) {
  const email = user?.email?.trim().toLowerCase() ?? fallbackEmail;
  const metadataRole = user?.user_metadata?.role ?? user?.app_metadata?.role;
  const role = isAccountRole(metadataRole) ? metadataRole : readAccountRoleHint(email);

  if (!role) {
    return null;
  }

  return {
    email,
    name: getAccountName(user),
    role,
  };
}

export default function LoginForm() {
  const router = useRouter();
  const isCheckingSession = useAuthenticatedAccountRedirect();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  useEffect(() => {
    router.prefetch("/account");
    router.prefetch("/dashboard");
  }, [router]);

  const syncAuthenticatedAccount = async () => {
    const account = await loadAuthenticatedAccount();

    if (!account) {
      return;
    }

    writeAccountPreview(account);
    router.replace(getHomePathForRole(account.role));
  };

  const onValidSubmit = async (values: LoginFormValues) => {
    setSubmissionMessage(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const normalizedEmail = values.email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: values.password,
      });

      if (error) {
        setSubmissionMessage(error.message);
        toast.error(error.message);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const optimisticAccount = getOptimisticAccount(data.user, normalizedEmail);

      toast.success("Logged in successfully.");

      if (optimisticAccount) {
        writeAccountPreview(optimisticAccount);
        router.replace(getHomePathForRole(optimisticAccount.role));
        void syncAuthenticatedAccount();
        return;
      }

      const account = await loadAuthenticatedAccount();

      if (!account) {
        throw new Error("Unable to load the authenticated account.");
      }

      writeAccountPreview(account);
      router.replace(getHomePathForRole(account.role));
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in.";
      setSubmissionMessage(message);
      toast.error(message);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  };

  const onInvalidSubmit = () => {
    const message = "Please correct the highlighted fields and try again.";
    setSubmissionMessage(message);
    toast.error(message);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isCheckingSession) {
    return (
      <main className="page-shell grain-overlay">
        <section className="mx-auto w-full max-w-3xl px-5 pt-4 pb-8 sm:px-8 lg:pt-8 lg:pb-12">
          <div className="rounded-[2rem] border border-white/70 bg-white/84 px-6 py-10 text-sm text-muted shadow-[0_28px_80px_rgba(20,50,37,0.08)] backdrop-blur sm:px-8 lg:px-10">
            Checking your session...
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell grain-overlay">
      <section className="mx-auto w-full max-w-3xl px-5 pt-4 pb-8 sm:px-8 lg:pt-8 lg:pb-12">
        <div className="rounded-[2rem] border border-white/70 bg-white/84 shadow-[0_28px_80px_rgba(20,50,37,0.08)] backdrop-blur">
          <div className="rounded-t-[2rem] border-b border-brand/10 bg-[linear-gradient(135deg,rgba(31,75,58,0.08),rgba(197,145,70,0.12))] px-6 py-8 sm:px-8 lg:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand">
              Reichman Sales &amp; Service
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-brand-strong sm:text-5xl">
              Sign in to your account
            </h1>
          </div>

          <form
            className="px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
            noValidate
            onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
          >
            {submissionMessage ? (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-700">
                {submissionMessage}
              </div>
            ) : null}

            <div className="grid gap-5">
              <label className="block">
                <span className="text-sm font-semibold text-brand-strong">Email Address *</span>
                <input
                  className={`${inputClassName} ${
                    errors.email
                      ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
                      : ""
                  }`}
                  autoComplete="email"
                  type="email"
                  {...register("email", {
                    pattern: {
                      message: "Enter a valid email address.",
                      value: emailPattern,
                    },
                    required: "Email address is required.",
                  })}
                />
                {errors.email?.message ? (
                  <span className="mt-2 block text-sm text-red-600">{errors.email.message}</span>
                ) : null}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-brand-strong">Password *</span>
                <input
                  className={`${inputClassName} ${
                    errors.password
                      ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
                      : ""
                  }`}
                  autoComplete="current-password"
                  type="password"
                  {...register("password", {
                    minLength: {
                      message: "Password must be at least 8 characters.",
                      value: 8,
                    },
                    required: "Password is required.",
                  })}
                />
                {errors.password?.message ? (
                  <span className="mt-2 block text-sm text-red-600">
                    {errors.password.message}
                  </span>
                ) : null}
              </label>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-7 text-muted">
                Need an account?{" "}
                <Link
                  href="/account/sign-up"
                  className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:text-brand-strong"
                >
                  Register here
                </Link>
                .
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(20,50,37,0.18)] hover:-translate-y-0.5 hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

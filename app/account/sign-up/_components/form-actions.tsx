"use client";

import Link from "next/link";

type FormActionsProps = {
  isSubmitting: boolean;
};

export function FormActions({ isSubmitting }: FormActionsProps) {
  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm leading-7 text-muted">Fields marked with * are required.</p>
        <p className="mt-1 text-sm leading-7 text-muted">
          Already have an account?{" "}
          <Link
            href="/account/login"
            className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:text-brand-strong"
          >
            Log in here
          </Link>
          .
        </p>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(20,50,37,0.18)] hover:-translate-y-0.5 hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Validating..." : "Sign Up for An Account"}
      </button>
    </div>
  );
}

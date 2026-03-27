"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import type { Path } from "react-hook-form";
import { LicenseReminderFooter } from "@/components/license-reminder-footer";
import { defaultSignUpFormValues } from "@/constants/account-registration";
import type {
  LicenseTypeOption,
  SignUpFormValues,
} from "@/types/account-registration";
import { useAuthenticatedAccountRedirect } from "@/utils/account-auth/use-authenticated-account-redirect";
import { registerAccountAction } from "./actions";
import {
  BillingAddressSection,
  ShippingAddressSection,
} from "./_components/address-sections";
import { ContactDetailsSection } from "./_components/contact-details-section";
import { FormActions } from "./_components/form-actions";
import { LicenseSection } from "./_components/license-section";
import { SecuritySection } from "./_components/security-section";

type SignUpFormProps = {
  licenseTypes: LicenseTypeOption[];
};

export default function SignUpForm({ licenseTypes }: SignUpFormProps) {
  const router = useRouter();
  const isCheckingSession = useAuthenticatedAccountRedirect();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    control,
    setError,
    reset,
  } = useForm<SignUpFormValues>({
    defaultValues: defaultSignUpFormValues,
    mode: "onBlur",
  });
  const [submissionMessage, setSubmissionMessage] = useState<{
    tone: "error" | "success";
    value: string;
  } | null>(null);

  const shippingSameAsBilling = useWatch({
    control,
    name: "shippingSameAsBilling",
  });
  const password = useWatch({
    control,
    name: "password",
  });

  const scrollToFormTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onValidSubmit = async (values: SignUpFormValues) => {
    setSubmissionMessage(null);

    const result = await registerAccountAction(values);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (!message) {
            continue;
          }

          setError(field as Path<SignUpFormValues>, {
            message,
            type: "server",
          });
        }
      }

      setSubmissionMessage({
        tone: "error",
        value: result.message,
      });
      toast.error(result.message);
      scrollToFormTop();
      return;
    }

    reset();
    toast.success("Registration submitted successfully. Redirecting to login...");
    router.push("/account/login");
  };

  const onInvalidSubmit = () => {
    const message = "Please correct the highlighted fields and try again.";
    setSubmissionMessage({ tone: "error", value: message });
    toast.error(message);
    scrollToFormTop();
  };

  if (isCheckingSession) {
    return (
      <main className="page-shell grain-overlay">
        <section className="mx-auto w-full max-w-5xl px-5 pt-4 pb-8 sm:px-8 lg:pt-8 lg:pb-12">
          <div className="rounded-[2rem] border border-white/70 bg-white/84 px-6 py-10 text-sm text-muted shadow-[0_28px_80px_rgba(20,50,37,0.08)] backdrop-blur sm:px-8 lg:px-10">
            Checking your session...
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell grain-overlay">
      <section className="mx-auto w-full max-w-5xl px-5 pt-4 pb-8 sm:px-8 lg:pt-8 lg:pb-12">
        <div className="w-full rounded-[2rem] border border-white/70 bg-white/84 shadow-[0_28px_80px_rgba(20,50,37,0.08)] backdrop-blur">
          <div className="rounded-t-[2rem] border-b border-brand/10 bg-[linear-gradient(135deg,rgba(31,75,58,0.08),rgba(197,145,70,0.12))] px-6 py-8 sm:px-8 lg:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand">
              Reichman Sales &amp; Service
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-brand-strong sm:text-5xl">
              Sign up for an account
            </h1>
          </div>

          <form
            className="px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
            noValidate
            onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
          >
            {submissionMessage ? (
              <div
                className={`mb-6 rounded-2xl px-4 py-3 text-sm leading-7 ${
                  submissionMessage.tone === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {submissionMessage.value}
              </div>
            ) : null}
            <ContactDetailsSection errors={errors} register={register} />
            <LicenseSection
              errors={errors}
              licenseTypes={licenseTypes}
              register={register}
            />
            <BillingAddressSection errors={errors} register={register} />
            <ShippingAddressSection
              errors={errors}
              register={register}
              shippingSameAsBilling={shippingSameAsBilling}
            />
            <SecuritySection errors={errors} password={password} register={register} />
            <FormActions isSubmitting={isSubmitting} />
          </form>

          <LicenseReminderFooter />
        </div>
      </section>
    </main>
  );
}

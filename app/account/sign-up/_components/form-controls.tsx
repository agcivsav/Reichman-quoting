"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import type {
  FieldErrors,
  Path,
  UseFormRegisterReturn,
} from "react-hook-form";
import type { SignUpFormValues } from "@/types/account-registration";

const inputClassName =
  "mt-2.5 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-sm text-foreground shadow-[0_1px_0_rgba(255,255,255,0.8),0_10px_25px_rgba(20,50,37,0.03)] placeholder:text-muted/70 focus:border-brand/30 focus:shadow-[0_0_0_4px_rgba(197,145,70,0.12)] focus:outline-none";

type BaseFieldProps = {
  error?: string;
  label: string;
  wrapperClassName?: string;
};

type TextFieldProps = BaseFieldProps &
  InputHTMLAttributes<HTMLInputElement> & {
    register: UseFormRegisterReturn;
  };

export function Field({
  error,
  label,
  register,
  wrapperClassName,
  ...props
}: TextFieldProps) {
  return (
    <label className={wrapperClassName ?? "block"}>
      <span className="text-sm font-semibold text-brand-strong">{label}</span>
      <input
        className={`${inputClassName} ${error ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]" : ""}`}
        {...register}
        {...props}
      />
      {error ? <span className="mt-2 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

type SelectFieldProps = BaseFieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    children: ReactNode;
    register: UseFormRegisterReturn;
  };

export function SelectField({
  children,
  error,
  label,
  register,
  wrapperClassName,
  ...props
}: SelectFieldProps) {
  return (
    <label className={wrapperClassName ?? "block"}>
      <span className="text-sm font-semibold text-brand-strong">{label}</span>
      <select
        className={`${inputClassName} ${error ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]" : ""}`}
        {...register}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-2 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-2xl text-brand-strong">{title}</h2>
    </div>
  );
}

export function getError(
  errors: FieldErrors<SignUpFormValues>,
  name: Path<SignUpFormValues>,
) {
  return errors[name]?.message;
}

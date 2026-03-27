"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { SignUpFormValues } from "@/types/account-registration";
import { Field, SectionHeading, getError } from "./form-controls";

type SecuritySectionProps = {
  errors: FieldErrors<SignUpFormValues>;
  password: string;
  register: UseFormRegister<SignUpFormValues>;
};

export function SecuritySection({
  errors,
  password,
  register,
}: SecuritySectionProps) {
  return (
    <div className="mt-10">
      <SectionHeading eyebrow="Security" title="Create your password" />
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          autoComplete="new-password"
          error={getError(errors, "password")}
          label="Password *"
          register={register("password", {
            minLength: {
              message: "Password must be at least 8 characters.",
              value: 8,
            },
            required: "Password is required.",
          })}
          type="password"
        />
        <Field
          autoComplete="new-password"
          error={getError(errors, "confirmPassword")}
          label="Confirm Password *"
          register={register("confirmPassword", {
            required: "Please confirm your password.",
            validate: (value) => value === password || "Passwords do not match.",
          })}
          type="password"
        />
      </div>
    </div>
  );
}

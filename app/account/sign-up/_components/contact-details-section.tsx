"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { SignUpFormValues } from "@/types/account-registration";
import {
  hasValidPhoneNumber,
  phoneNumberMessage,
} from "@/utils/account-registration/phone";
import { Field, SectionHeading, getError } from "./form-controls";

type ContactDetailsSectionProps = {
  errors: FieldErrors<SignUpFormValues>;
  register: UseFormRegister<SignUpFormValues>;
};

export function ContactDetailsSection({
  errors,
  register,
}: ContactDetailsSectionProps) {
  return (
    <div>
      <SectionHeading eyebrow="Required Fields" title="Contact details" />
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="First Name *"
          autoComplete="given-name"
          error={getError(errors, "firstName")}
          register={register("firstName", { required: "First name is required." })}
        />
        <Field
          label="Last Name *"
          autoComplete="family-name"
          error={getError(errors, "lastName")}
          register={register("lastName", { required: "Last name is required." })}
        />
        <Field
          label="Email Address *"
          autoComplete="email"
          error={getError(errors, "email")}
          register={register("email", {
            pattern: {
              message: "Enter a valid email address.",
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            },
            required: "Email address is required.",
          })}
          type="email"
        />
        <Field
          label="Main Phone # *"
          autoComplete="tel"
          error={getError(errors, "mainPhone")}
          register={register("mainPhone", {
            required: "Main phone is required.",
            validate: (value) => hasValidPhoneNumber(value) || phoneNumberMessage,
          })}
          type="tel"
        />
        <Field
          label="Secondary Phone # *"
          error={getError(errors, "secondaryPhone")}
          register={register("secondaryPhone", {
            required: "Secondary phone is required.",
            validate: (value) => hasValidPhoneNumber(value) || phoneNumberMessage,
          })}
          type="tel"
        />
        <Field
          label="Company or Farm Name *"
          autoComplete="organization"
          error={getError(errors, "companyOrFarmName")}
          register={register("companyOrFarmName", {
            required: "Company or farm name is required.",
          })}
        />
      </div>
    </div>
  );
}

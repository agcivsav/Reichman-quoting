"use client";

import { states } from "@/constants/states";
import type {
  LicenseTypeOption,
  SignUpFormValues,
} from "@/types/account-registration";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Field, SectionHeading, SelectField, getError } from "./form-controls";

type LicenseSectionProps = {
  errors: FieldErrors<SignUpFormValues>;
  licenseTypes: LicenseTypeOption[];
  register: UseFormRegister<SignUpFormValues>;
};

export function LicenseSection({
  errors,
  licenseTypes,
  register,
}: LicenseSectionProps) {
  return (
    <div className="mt-10 rounded-[1.75rem] border border-border bg-surface px-5 py-6 sm:px-6">
      <SectionHeading
        eyebrow="License Info"
        title="Registration type and credentials"
      />
      <div className="space-y-5">
        <fieldset>
          <legend className="text-sm font-semibold text-brand-strong">
            I am registering as a *
          </legend>
          <div className="mt-3 grid gap-3">
            {licenseTypes.map((licenseType) => (
              <label
                key={licenseType.id}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border bg-white px-4 py-3 text-sm text-foreground hover:border-brand/25 ${
                  errors.registrationType ? "border-red-300" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  value={licenseType.name}
                  className="mt-1 h-4 w-4 border-border text-brand"
                  {...register("registrationType", {
                    required: "Please choose a registration type.",
                  })}
                />
                <span className="leading-6">{licenseType.name}</span>
              </label>
            ))}
          </div>
          {errors.registrationType?.message ? (
            <span className="mt-2 block text-sm text-red-600">
              {errors.registrationType.message}
            </span>
          ) : null}
        </fieldset>

        <div className="grid gap-5 md:grid-cols-3">
          <Field
            label="License # *"
            error={getError(errors, "licenseNumber")}
            register={register("licenseNumber", {
              required: "License number is required.",
            })}
          />
          <Field
            label="Expiration Date *"
            error={getError(errors, "licenseExpirationDate")}
            register={register("licenseExpirationDate", {
              required: "Expiration date is required.",
            })}
            type="date"
          />
          <SelectField
            defaultValue=""
            error={getError(errors, "licenseState")}
            label="Issuing State *"
            register={register("licenseState", {
              required: "Issuing state is required.",
            })}
          >
            <option value="" disabled>
              Select state
            </option>
            {states.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </SelectField>
        </div>
      </div>
    </div>
  );
}

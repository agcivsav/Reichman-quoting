"use client";

import { states } from "@/constants/states";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { SignUpFormValues } from "@/types/account-registration";
import { Field, SectionHeading, SelectField, getError } from "./form-controls";

type BillingAddressSectionProps = {
  errors: FieldErrors<SignUpFormValues>;
  register: UseFormRegister<SignUpFormValues>;
};

type ShippingAddressSectionProps = BillingAddressSectionProps & {
  shippingSameAsBilling: boolean;
};

export function BillingAddressSection({
  errors,
  register,
}: BillingAddressSectionProps) {
  return (
    <div className="mt-10">
      <SectionHeading eyebrow="Billing Address" title="Billing address" />
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          autoComplete="address-line1"
          error={getError(errors, "billingAddressLine1")}
          label="Address Line 1 *"
          register={register("billingAddressLine1", {
            required: "Billing address line 1 is required.",
          })}
          wrapperClassName="md:col-span-2"
        />
        <Field
          autoComplete="address-line2"
          error={getError(errors, "billingAddressLine2")}
          label="Address Line 2"
          register={register("billingAddressLine2")}
          wrapperClassName="md:col-span-2"
        />
        <Field
          autoComplete="address-level2"
          error={getError(errors, "billingCity")}
          label="City *"
          register={register("billingCity", {
            required: "Billing city is required.",
          })}
        />
        <SelectField
          defaultValue=""
          error={getError(errors, "billingState")}
          label="State *"
          register={register("billingState", {
            required: "Billing state is required.",
          })}
        >
          <option value="" disabled>
            Select state
          </option>
          {states.map((state) => (
            <option key={`billing-${state.value}`} value={state.value}>
              {state.label}
            </option>
          ))}
        </SelectField>
        <Field
          autoComplete="postal-code"
          error={getError(errors, "billingZipCode")}
          label="Zip Code *"
          register={register("billingZipCode", {
            pattern: {
              message: "Enter a valid ZIP code.",
              value: /^\d{5}(-\d{4})?$/,
            },
            required: "Billing ZIP code is required.",
          })}
        />
      </div>
    </div>
  );
}

export function ShippingAddressSection({
  errors,
  register,
  shippingSameAsBilling,
}: ShippingAddressSectionProps) {
  const shippingRule = (label: string) => (value: string) => {
    if (shippingSameAsBilling || value.trim()) {
      return true;
    }

    return `${label} is required.`;
  };

  return (
    <div className="mt-10 rounded-[1.75rem] border border-border bg-surface px-5 py-6 sm:px-6">
      <SectionHeading eyebrow="Shipping Address" title="Shipping address" />
      <label className="mb-5 flex items-start gap-3 rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm text-foreground">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-border text-brand"
          {...register("shippingSameAsBilling")}
        />
        <span className="leading-6">Shipping Same As Billing Address</span>
      </label>

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-out ${
          shippingSameAsBilling
            ? "max-h-0 -translate-y-2 opacity-0"
            : "max-h-[38rem] translate-y-0 opacity-100"
        }`}
        aria-hidden={shippingSameAsBilling}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            autoComplete="shipping street-address"
            error={getError(errors, "shippingAddressLine1")}
            label="Address Line 1 *"
            register={register("shippingAddressLine1", {
              validate: shippingRule("Shipping address line 1"),
            })}
            wrapperClassName="md:col-span-2"
          />
          <Field
            autoComplete="shipping address-line2"
            error={getError(errors, "shippingAddressLine2")}
            label="Address Line 2"
            register={register("shippingAddressLine2")}
            wrapperClassName="md:col-span-2"
          />
          <Field
            autoComplete="shipping address-level2"
            error={getError(errors, "shippingCity")}
            label="City *"
            register={register("shippingCity", {
              validate: shippingRule("Shipping city"),
            })}
          />
          <SelectField
            defaultValue=""
            error={getError(errors, "shippingState")}
            label="State *"
            register={register("shippingState", {
              validate: shippingRule("Shipping state"),
            })}
          >
            <option value="" disabled>
              Select state
            </option>
            {states.map((state) => (
              <option key={`shipping-${state.value}`} value={state.value}>
                {state.label}
              </option>
            ))}
          </SelectField>
          <Field
            autoComplete="shipping postal-code"
            error={getError(errors, "shippingZipCode")}
            label="Zip Code *"
            register={register("shippingZipCode", {
              validate: (value) => {
                if (shippingSameAsBilling) {
                  return true;
                }

                if (!value.trim()) {
                  return "Shipping ZIP code is required.";
                }

                return /^\d{5}(-\d{4})?$/.test(value)
                  ? true
                  : "Enter a valid ZIP code.";
              },
            })}
          />
        </div>
      </div>
    </div>
  );
}

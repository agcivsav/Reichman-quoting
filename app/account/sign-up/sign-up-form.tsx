"use client";

import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import type {
  FieldErrors,
  Path,
  UseFormRegisterReturn,
} from "react-hook-form";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

const registrationTypes = [
  "Private Applicator",
  "Commercial or Aerial Applicator (For Hire)",
  "Licensed Dealer or Wholesaler",
] as const;

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District Of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const;

const inputClassName =
  "mt-2.5 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-sm text-foreground shadow-[0_1px_0_rgba(255,255,255,0.8),0_10px_25px_rgba(20,50,37,0.03)] placeholder:text-muted/70 focus:border-brand/30 focus:shadow-[0_0_0_4px_rgba(197,145,70,0.12)] focus:outline-none";

type SignUpFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  mainPhone: string;
  secondaryPhone: string;
  companyOrFarmName: string;
  registrationType: (typeof registrationTypes)[number] | "";
  licenseNumber: string;
  licenseExpirationDate: string;
  licenseState: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  shippingSameAsBilling: boolean;
  shippingAddressLine1: string;
  shippingAddressLine2: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  password: string;
  confirmPassword: string;
};

type BaseFieldProps = {
  error?: string;
  label: string;
  wrapperClassName?: string;
};

type TextFieldProps = BaseFieldProps &
  InputHTMLAttributes<HTMLInputElement> & {
    register: UseFormRegisterReturn;
  };

function Field({
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
      {error ? (
        <span className="mt-2 block text-sm text-red-600">{error}</span>
      ) : null}
    </label>
  );
}

type DropdownFieldProps = BaseFieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    children: ReactNode;
    register: UseFormRegisterReturn;
  };

function SelectField({
  children,
  error,
  label,
  register,
  wrapperClassName,
  ...props
}: DropdownFieldProps) {
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
      {error ? (
        <span className="mt-2 block text-sm text-red-600">{error}</span>
      ) : null}
    </label>
  );
}

function SectionHeading({
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

function getError(
  errors: FieldErrors<SignUpFormValues>,
  name: Path<SignUpFormValues>,
) {
  return errors[name]?.message;
}

export default function SignUpForm() {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    control,
  } = useForm<SignUpFormValues>({
    defaultValues: {
      billingAddressLine1: "",
      billingAddressLine2: "",
      billingCity: "",
      billingState: "",
      billingZipCode: "",
      companyOrFarmName: "",
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      licenseExpirationDate: "",
      licenseNumber: "",
      licenseState: "",
      mainPhone: "",
      password: "",
      registrationType: "",
      secondaryPhone: "",
      shippingAddressLine1: "",
      shippingAddressLine2: "",
      shippingCity: "",
      shippingSameAsBilling: false,
      shippingState: "",
      shippingZipCode: "",
    },
    mode: "onBlur",
  });

  const shippingSameAsBilling = useWatch({
    control,
    name: "shippingSameAsBilling",
  });
  const password = useWatch({
    control,
    name: "password",
  });

  const requiredMessage = (label: string) => `${label} is required.`;

  const shippingRule = (label: string) => (value: string) => {
    if (shippingSameAsBilling) {
      return true;
    }

    if (value.trim().length > 0) {
      return true;
    }

    return `${label} is required.`;
  };

  const onSubmit = handleSubmit(async (values) => {
    const submissionValues = shippingSameAsBilling
      ? {
          ...values,
          shippingAddressLine1: values.billingAddressLine1,
          shippingAddressLine2: values.billingAddressLine2,
          shippingCity: values.billingCity,
          shippingState: values.billingState,
          shippingZipCode: values.billingZipCode,
        }
      : values;

    console.info("Validated signup payload", submissionValues);
  });

  return (
    <main className="page-shell grain-overlay flex flex-1">
      <section className="mx-auto flex w-full max-w-5xl flex-1 px-5 py-8 sm:px-8 lg:py-12">
        <div className="w-full rounded-[2rem] border border-white/70 bg-white/84 shadow-[0_28px_80px_rgba(20,50,37,0.08)] backdrop-blur">
          <div className="rounded-t-[2rem] border-b border-brand/10 bg-[linear-gradient(135deg,rgba(31,75,58,0.08),rgba(197,145,70,0.12))] px-6 py-8 sm:px-8 lg:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand">
              Reichman Sales &amp; Service
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-brand-strong sm:text-5xl">
              Sign up for an account
            </h1>
          </div>

          <form className="px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10" noValidate onSubmit={onSubmit}>
            <div>
              <SectionHeading eyebrow="Required Fields" title="Contact details" />
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="First Name *"
                  autoComplete="given-name"
                  error={getError(errors, "firstName")}
                  register={register("firstName", {
                    required: requiredMessage("First name"),
                  })}
                />
                <Field
                  label="Last Name *"
                  autoComplete="family-name"
                  error={getError(errors, "lastName")}
                  register={register("lastName", {
                    required: requiredMessage("Last name"),
                  })}
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
                    required: requiredMessage("Main phone"),
                  })}
                  type="tel"
                />
                <Field
                  label="Secondary Phone # *"
                  error={getError(errors, "secondaryPhone")}
                  register={register("secondaryPhone", {
                    required: requiredMessage("Secondary phone"),
                  })}
                  type="tel"
                />
                <Field
                  label="Company or Farm Name *"
                  autoComplete="organization"
                  error={getError(errors, "companyOrFarmName")}
                  register={register("companyOrFarmName", {
                    required: requiredMessage("Company or farm name"),
                  })}
                />
              </div>
            </div>

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
                    {registrationTypes.map((type) => (
                      <label
                        key={type}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border bg-white px-4 py-3 text-sm text-foreground hover:border-brand/25 ${
                          errors.registrationType
                            ? "border-red-300"
                            : "border-border"
                        }`}
                      >
                        <input
                          type="radio"
                          value={type}
                          className="mt-1 h-4 w-4 border-border text-brand"
                          {...register("registrationType", {
                            required: "Please choose a registration type.",
                          })}
                        />
                        <span className="leading-6">{type}</span>
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
                      required: requiredMessage("License number"),
                    })}
                  />
                  <Field
                    label="Expiration Date *"
                    error={getError(errors, "licenseExpirationDate")}
                    register={register("licenseExpirationDate", {
                      required: requiredMessage("Expiration date"),
                    })}
                    type="date"
                  />
                  <SelectField
                    defaultValue=""
                    error={getError(errors, "licenseState")}
                    label="Issuing State *"
                    register={register("licenseState", {
                      required: requiredMessage("Issuing state"),
                    })}
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </SelectField>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <SectionHeading eyebrow="Billing Address" title="Billing address" />
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  autoComplete="address-line1"
                  error={getError(errors, "billingAddressLine1")}
                  label="Address Line 1 *"
                  register={register("billingAddressLine1", {
                    required: requiredMessage("Billing address line 1"),
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
                    required: requiredMessage("Billing city"),
                  })}
                />
                <SelectField
                  defaultValue=""
                  error={getError(errors, "billingState")}
                  label="State *"
                  register={register("billingState", {
                    required: requiredMessage("Billing state"),
                  })}
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
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
                      <option key={state} value={state}>
                        {state}
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

                        if (!value?.trim()) {
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
                    validate: (value) =>
                      value === password || "Passwords do not match.",
                  })}
                  type="password"
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm leading-7 text-muted">
                  Fields marked with * are required.
                </p>
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
          </form>

          <footer className="rounded-b-[2rem] border-t border-brand/10 bg-[linear-gradient(180deg,rgba(255,250,242,0.92),rgba(249,243,232,0.96))] px-6 py-5 sm:px-8 lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
              License Reminder
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
              Don&apos;t forget to renew your Department of Agriculture pesticides
              license. Every customer wanting to purchase restricted use
              chemicals must have a valid license number on file.
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}

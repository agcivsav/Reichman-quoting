import { states } from "@/constants/states";
import type {
  RegistrationField,
  SignUpFormValues,
} from "@/types/account-registration";
import {
  hasValidPhoneNumber,
  phoneNumberMessage,
} from "@/utils/account-registration/phone";
import { normalizeRegistrationValues } from "./normalize-registration-values";

const stateValues = new Set<string>(states.map((state) => state.value));

export function validateRegistrationValues(values: SignUpFormValues) {
  const normalized = normalizeRegistrationValues(values);
  const fieldErrors: Partial<Record<RegistrationField, string>> = {};

  const requireField = (
    field: RegistrationField,
    value: string,
    label: string,
  ) => {
    if (!value) {
      fieldErrors[field] = `${label} is required.`;
    }
  };

  requireField("firstName", normalized.firstName, "First name");
  requireField("lastName", normalized.lastName, "Last name");
  requireField("email", normalized.email, "Email address");
  requireField("mainPhone", normalized.mainPhone, "Main phone");
  requireField("secondaryPhone", normalized.secondaryPhone, "Secondary phone");
  requireField("companyOrFarmName", normalized.companyOrFarmName, "Company or farm name");
  requireField("registrationType", normalized.registrationType, "Registration type");
  requireField("licenseNumber", normalized.licenseNumber, "License number");
  requireField("licenseExpirationDate", normalized.licenseExpirationDate, "Expiration date");
  requireField("licenseState", normalized.licenseState, "Issuing state");
  requireField("billingAddressLine1", normalized.billingAddressLine1, "Billing address line 1");
  requireField("billingCity", normalized.billingCity, "Billing city");
  requireField("billingState", normalized.billingState, "Billing state");
  requireField("billingZipCode", normalized.billingZipCode, "Billing ZIP code");
  requireField("password", normalized.password, "Password");
  requireField("confirmPassword", normalized.confirmPassword, "Confirm password");

  if (!normalized.shippingSameAsBilling) {
    requireField("shippingAddressLine1", normalized.shippingAddressLine1, "Shipping address line 1");
    requireField("shippingCity", normalized.shippingCity, "Shipping city");
    requireField("shippingState", normalized.shippingState, "Shipping state");
    requireField("shippingZipCode", normalized.shippingZipCode, "Shipping ZIP code");
  }

  if (normalized.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (normalized.mainPhone && !hasValidPhoneNumber(normalized.mainPhone)) {
    fieldErrors.mainPhone = phoneNumberMessage;
  }

  if (normalized.secondaryPhone && !hasValidPhoneNumber(normalized.secondaryPhone)) {
    fieldErrors.secondaryPhone = phoneNumberMessage;
  }

  if (normalized.billingState && !stateValues.has(normalized.billingState)) {
    fieldErrors.billingState = "Please choose a valid state.";
  }

  if (normalized.licenseState && !stateValues.has(normalized.licenseState)) {
    fieldErrors.licenseState = "Please choose a valid state.";
  }

  if (normalized.shippingState && !stateValues.has(normalized.shippingState)) {
    fieldErrors.shippingState = "Please choose a valid state.";
  }

  if (normalized.billingZipCode && !/^\d{5}(-\d{4})?$/.test(normalized.billingZipCode)) {
    fieldErrors.billingZipCode = "Enter a valid ZIP code.";
  }

  if (normalized.shippingZipCode && !/^\d{5}(-\d{4})?$/.test(normalized.shippingZipCode)) {
    fieldErrors.shippingZipCode = "Enter a valid ZIP code.";
  }

  if (normalized.password && normalized.password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters.";
  }

  if (
    normalized.password &&
    normalized.confirmPassword &&
    normalized.password !== normalized.confirmPassword
  ) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  return {
    fieldErrors,
    normalized,
    valid: Object.keys(fieldErrors).length === 0,
  };
}

import type { SignUpFormValues } from "@/types/account-registration";

export function normalizeRegistrationValues(values: SignUpFormValues) {
  const normalized = {
    ...values,
    billingAddressLine1: values.billingAddressLine1.trim(),
    billingAddressLine2: values.billingAddressLine2.trim(),
    billingCity: values.billingCity.trim(),
    billingState: values.billingState.trim(),
    billingZipCode: values.billingZipCode.trim(),
    companyOrFarmName: values.companyOrFarmName.trim(),
    confirmPassword: values.confirmPassword,
    email: values.email.trim().toLowerCase(),
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    licenseExpirationDate: values.licenseExpirationDate,
    licenseNumber: values.licenseNumber.trim(),
    licenseState: values.licenseState.trim(),
    mainPhone: values.mainPhone.trim(),
    password: values.password,
    registrationType: values.registrationType,
    secondaryPhone: values.secondaryPhone.trim(),
    shippingAddressLine1: values.shippingAddressLine1.trim(),
    shippingAddressLine2: values.shippingAddressLine2.trim(),
    shippingCity: values.shippingCity.trim(),
    shippingSameAsBilling: values.shippingSameAsBilling,
    shippingState: values.shippingState.trim(),
    shippingZipCode: values.shippingZipCode.trim(),
  };

  if (normalized.shippingSameAsBilling) {
    normalized.shippingAddressLine1 = normalized.billingAddressLine1;
    normalized.shippingAddressLine2 = normalized.billingAddressLine2;
    normalized.shippingCity = normalized.billingCity;
    normalized.shippingState = normalized.billingState;
    normalized.shippingZipCode = normalized.billingZipCode;
  }

  return normalized;
}

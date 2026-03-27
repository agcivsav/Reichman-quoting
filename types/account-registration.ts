export type LicenseTypeOption = {
  id: string;
  name: string;
};

export type SignUpFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  mainPhone: string;
  secondaryPhone: string;
  companyOrFarmName: string;
  registrationType: string;
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

export type RegistrationField = keyof SignUpFormValues;

export type RegistrationActionResult =
  | { ok: true; message: string }
  | {
      ok: false;
      fieldErrors?: Partial<Record<RegistrationField, string>>;
      message: string;
    };

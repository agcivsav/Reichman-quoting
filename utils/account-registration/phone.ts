export const phoneNumberMessage =
  "Phone Number is invalid. Example format: (201) 555-0123";

export function hasValidPhoneNumber(value: string) {
  return value.replace(/\D/g, "").length === 10;
}

import type { Metadata } from "next";
import type { LicenseTypeOption } from "@/types/account-registration";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a Reichman Sales & Service account with the same registration fields as the current signup form.",
};

export const dynamic = "force-dynamic";

function hasDatabaseConnectionString() {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.SUPABASE_DB_URL ||
      process.env.SUPABASE_DATABASE_URL,
  );
}

async function loadLicenseTypes(): Promise<LicenseTypeOption[]> {
  if (!hasDatabaseConnectionString()) {
    return [];
  }

  const { getActiveLicenseTypes } = await import("@/db/queries/license-types");
  return getActiveLicenseTypes();
}

export default async function SignUpPage() {
  const licenseTypes = await loadLicenseTypes();

  return <SignUpForm licenseTypes={licenseTypes} />;
}

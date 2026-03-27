"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { addresses, licenseTypes, licenses, profiles } from "@/db/schema";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type {
  RegistrationActionResult,
  SignUpFormValues,
} from "@/types/account-registration";
import { validateRegistrationValues } from "@/utils/account-registration/validate-registration-values";

async function createSupabaseAuthUser(values: SignUpFormValues) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: values.email,
    email_confirm: false,
    password: values.password,
    user_metadata: {
      first_name: values.firstName,
      last_name: values.lastName,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user?.id) {
    throw new Error("Failed to create the Supabase auth user.");
  }

  return data.user.id;
}

async function deleteSupabaseAuthUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Failed to delete Supabase auth user during rollback.", error);
  }
}

function buildAddressRows(userId: string, values: SignUpFormValues) {
  const billingAddress = {
    city: values.billingCity,
    line1: values.billingAddressLine1,
    line2: values.billingAddressLine2 || null,
    postalCode: values.billingZipCode,
    state: values.billingState,
    type: "billing" as const,
    userId,
  };

  if (values.shippingSameAsBilling) {
    return [billingAddress];
  }

  return [
    billingAddress,
    {
      city: values.shippingCity,
      line1: values.shippingAddressLine1,
      line2: values.shippingAddressLine2 || null,
      postalCode: values.shippingZipCode,
      state: values.shippingState,
      type: "shipping" as const,
      userId,
    },
  ];
}

export async function registerAccountAction(
  values: SignUpFormValues,
): Promise<RegistrationActionResult> {
  const { fieldErrors, normalized, valid } = validateRegistrationValues(values);

  if (!valid) {
    return {
      ok: false,
      fieldErrors,
      message: "Please correct the highlighted fields and try again.",
    };
  }

  try {
    const userId = await createSupabaseAuthUser(normalized);

    const [matchingLicenseType] = await db
      .select({ id: licenseTypes.id })
      .from(licenseTypes)
      .where(
        and(
          eq(licenseTypes.isActive, true),
          eq(licenseTypes.name, normalized.registrationType),
        ),
      )
      .limit(1);

    if (!matchingLicenseType) {
      await deleteSupabaseAuthUser(userId);
      return {
        ok: false,
        fieldErrors: {
          registrationType: "This license type is not available yet.",
        },
        message: "License type configuration is incomplete.",
      };
    }

    try {
      await db.transaction(async (tx) => {
        await tx.insert(profiles).values({
          id: userId,
          companyName: normalized.companyOrFarmName,
          firstName: normalized.firstName,
          isOnboarded: false,
          lastName: normalized.lastName,
          phone: normalized.mainPhone,
          role: "customer",
          sameAsBilling: normalized.shippingSameAsBilling,
          secondaryPhone: normalized.secondaryPhone,
        });

        await tx.insert(addresses).values(buildAddressRows(userId, normalized));

        await tx.insert(licenses).values({
          expiresAt: new Date(`${normalized.licenseExpirationDate}T00:00:00.000Z`),
          licenseNumber: normalized.licenseNumber,
          licenseTypeId: matchingLicenseType.id,
          state: normalized.licenseState,
          userId,
        });

        await tx
          .update(profiles)
          .set({
            isOnboarded: true,
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, userId));
      });
    } catch (error) {
      await deleteSupabaseAuthUser(userId);
      throw error;
    }

    return {
      ok: true,
      message: "Account registration submitted successfully.",
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while registering the account.";

    if (message.toLowerCase().includes("already")) {
      return {
        ok: false,
        fieldErrors: {
          email: "This email is already registered.",
        },
        message,
      };
    }

    return {
      ok: false,
      message,
    };
  }
}

import { asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { licenseTypes } from "@/db/schema";

export async function getActiveLicenseTypes() {
  return db
    .select({
      id: licenseTypes.id,
      name: licenseTypes.name,
    })
    .from(licenseTypes)
    .where(eq(licenseTypes.isActive, true))
    .orderBy(asc(licenseTypes.sortOrder), asc(licenseTypes.name));
}

import { closeDbConnection, db } from "../client";
import { licenseTypes } from "../schema";

export async function seedLicenseTypes(database = db) {
  const inserted = await database
    .insert(licenseTypes)
    .values([
      { name: "Private Applicator", sortOrder: 1 },
      { name: "Commercial or Aerial Applicator (For Hire)", sortOrder: 2 },
      { name: "Licensed Dealer or Wholesaler", sortOrder: 3 },
    ])
    .onConflictDoNothing()
    .returning({
      id: licenseTypes.id,
      name: licenseTypes.name,
    });

  return inserted;
}

async function main() {
  try {
    const inserted = await seedLicenseTypes();

    console.info(`Seeded ${inserted.length} license type(s).`);

    if (inserted.length > 0) {
      console.table(inserted);
    }
  } catch (error) {
    console.error("Failed to seed license types.");
    throw error;
  } finally {
    await closeDbConnection();
  }
}

if (process.argv[1]?.endsWith("db\\seeds\\license-types.ts")) {
  void main();
}

import type { User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { isAccountRole } from "@/utils/account-auth/account-role";

export const dynamic = "force-dynamic";

type AuthenticatedUser = Pick<User, "app_metadata" | "email" | "id" | "user_metadata">;

function hasDatabaseConnectionString() {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.SUPABASE_DB_URL ||
      process.env.SUPABASE_DATABASE_URL,
  );
}

function getAccountName(user: AuthenticatedUser) {
  const firstName =
    typeof user.user_metadata?.first_name === "string" ? user.user_metadata.first_name : "";
  const lastName =
    typeof user.user_metadata?.last_name === "string" ? user.user_metadata.last_name : "";

  return `${firstName} ${lastName}`.trim();
}

async function loadAccountRole(user: AuthenticatedUser) {
  const metadataRole = user.user_metadata?.role ?? user.app_metadata?.role;

  if (isAccountRole(metadataRole)) {
    return metadataRole;
  }

  if (hasDatabaseConnectionString()) {
    const [{ eq }, { db }, { profiles }] = await Promise.all([
      import("drizzle-orm"),
      import("@/db/client"),
      import("@/db/schema"),
    ]);

    const [profile] = await db
      .select({ role: profiles.role })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);

    if (isAccountRole(profile?.role)) {
      return profile.role;
    }
  }

  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = user.email?.trim().toLowerCase();

  if (configuredAdminEmail && userEmail === configuredAdminEmail) {
    return "admin";
  }

  return "customer";
}

export async function GET(request: Request) {
  const authorizationHeader = request.headers.get("authorization");
  const accessToken = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.slice("Bearer ".length)
    : null;

  if (!accessToken) {
    return NextResponse.json({ message: "Missing access token." }, { status: 401 });
  }

  const { supabaseAdmin } = await import("@/lib/supabase/admin");
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !data.user) {
    return NextResponse.json({ message: error?.message ?? "Unauthorized." }, { status: 401 });
  }

  const role = await loadAccountRole(data.user);

  return NextResponse.json({
    email: data.user.email ?? "",
    name: getAccountName(data.user),
    role,
  });
}

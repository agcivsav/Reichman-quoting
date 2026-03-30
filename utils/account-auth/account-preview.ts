"use client";

import type { AccountRole } from "./account-role";

export type AccountPreview = {
  email: string;
  name: string;
  role: AccountRole;
};

const accountPreviewKey = "reichman-account-preview";
const accountRoleHintsKey = "reichman-account-role-hints";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readAccountRoleHints() {
  if (typeof window === "undefined") {
    return {} as Record<string, AccountRole>;
  }

  const storedValue = window.localStorage.getItem(accountRoleHintsKey);

  if (!storedValue) {
    return {} as Record<string, AccountRole>;
  }

  try {
    return JSON.parse(storedValue) as Record<string, AccountRole>;
  } catch {
    window.localStorage.removeItem(accountRoleHintsKey);
    return {} as Record<string, AccountRole>;
  }
}

function writeAccountRoleHint(email: string, role: AccountRole) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return;
  }

  const nextHints = {
    ...readAccountRoleHints(),
    [normalizedEmail]: role,
  };

  window.localStorage.setItem(accountRoleHintsKey, JSON.stringify(nextHints));
}

export function readAccountPreview() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.sessionStorage.getItem(accountPreviewKey);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as AccountPreview;
  } catch {
    window.sessionStorage.removeItem(accountPreviewKey);
    return null;
  }
}

export function readAccountRoleHint(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  return readAccountRoleHints()[normalizedEmail] ?? null;
}

export function writeAccountPreview(preview: AccountPreview) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(accountPreviewKey, JSON.stringify(preview));
  writeAccountRoleHint(preview.email, preview.role);
}

export function clearAccountPreview() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(accountPreviewKey);
}

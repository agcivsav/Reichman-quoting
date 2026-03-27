"use client";

type AccountPreview = {
  email: string;
  name: string;
};

const accountPreviewKey = "reichman-account-preview";

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

export function writeAccountPreview(preview: AccountPreview) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(accountPreviewKey, JSON.stringify(preview));
}

export function clearAccountPreview() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(accountPreviewKey);
}

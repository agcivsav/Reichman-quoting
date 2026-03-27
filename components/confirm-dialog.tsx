"use client";

import type { ReactNode } from "react";

type ConfirmDialogProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  description: ReactNode;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
};

export function ConfirmDialog({
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  description,
  isOpen,
  onCancel,
  onConfirm,
  title,
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(20,50,37,0.28)] px-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,250,242,0.98),rgba(249,243,232,0.98))] p-6 shadow-[0_28px_80px_rgba(20,50,37,0.18)] sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
          Confirm Action
        </p>
        <h2 className="mt-3 font-display text-3xl text-brand-strong">{title}</h2>
        <div className="mt-4 text-sm leading-7 text-muted">{description}</div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-brand-strong hover:border-brand/25"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fffaf2",
          border: "1px solid rgba(32, 49, 40, 0.14)",
          color: "#203128",
        },
      }}
    />
  );
}

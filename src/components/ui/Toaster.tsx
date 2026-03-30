"use client";

import { Toaster } from "sonner";

export function DashboardToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#079455",
          color: "#ffffff",
          border: "none",
          padding: "14px 16px",
          borderRadius: "10px",
        },
        className: "shadow-lg font-medium",
      }}
    />
  );
}

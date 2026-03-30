import type { Metadata } from "next";
import DashboardHome from "./dashboard-home";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Administrative dashboard for Reichman Sales & Service.",
};

export default function DashboardPage() {
  return <DashboardHome />;
}

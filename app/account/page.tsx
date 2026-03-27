import type { Metadata } from "next";
import AccountHome from "./account-home";

export const metadata: Metadata = {
  title: "Account",
  description: "Your Reichman Sales & Service account home.",
};

export default function AccountPage() {
  return <AccountHome />;
}

import type { Metadata } from "next";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a Reichman Sales & Service account with the same registration fields as the current signup form.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}

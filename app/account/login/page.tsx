import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Reichman Sales & Service account.",
};

export default function LoginPage() {
  return <LoginForm />;
}

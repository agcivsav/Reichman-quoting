import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://reichmansales.com"),
  title: {
    default: "Reichman Sales & Service",
    template: "%s | Reichman Sales & Service",
  },
  description:
    "Digital account access, quoting, and customer onboarding for Reichman Sales & Service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}

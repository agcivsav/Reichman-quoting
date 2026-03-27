import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dealer Portal",
  description:
    "A polished customer portal foundation for Reichman Sales & Service.",
};

const quickLinks = [
  {
    title: "Create an account",
    description:
      "Start with a premium registration flow designed for dealers, growers, and financing-ready customers.",
    href: "/account/sign-up",
  },
  {
    title: "Talk with the team",
    description:
      "Need immediate help with products, financing, or portal access? Reach the Reichman team directly.",
    href: "tel:8154522665",
  },
];

const highlights = [
  "Earthy premium palette that can scale into the full site redesign",
  "Clear content hierarchy for quoting, account access, and sales support",
  "Modular card system that can be reused on product, account, and service pages",
];

export default function Home() {
  return (
    <main className="page-shell grain-overlay flex flex-1 items-center">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand">
              Reichman Sales &amp; Service
            </p>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Portal design foundation for customer onboarding, quoting, and
              account management.
            </p>
          </div>
          <Link
            href="/account/sign-up"
            className="rounded-full border border-brand/15 bg-white/70 px-5 py-3 text-sm font-semibold text-brand shadow-[0_12px_30px_rgba(20,50,37,0.08)] backdrop-blur hover:-translate-y-0.5 hover:bg-white"
          >
            View Sign-Up Page
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-white/65 bg-[linear-gradient(135deg,rgba(31,75,58,0.96),rgba(20,50,37,0.92))] p-8 text-white shadow-[var(--shadow)] sm:p-10 lg:p-12">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Future-facing visual system
            </span>
            <h1 className="mt-8 max-w-2xl font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              A more confident, premium direction for the Reichman customer
              experience.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              The new interface balances trust, agricultural grit, and polished
              service. It is designed to feel client-ready now while giving us a
              strong visual system we can extend into the rest of the site.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/12 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                  Designed for
                </p>
                <p className="mt-3 text-xl font-semibold">Growers and dealers</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/12 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                  Tone
                </p>
                <p className="mt-3 text-xl font-semibold">Warm, strong, clear</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/12 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                  Reusable
                </p>
                <p className="mt-3 text-xl font-semibold">Cards, inputs, CTAs</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-white/78 p-8 shadow-[0_24px_60px_rgba(20,50,37,0.08)] backdrop-blur sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-brand">
              What this gives us
            </p>
            <div className="mt-6 space-y-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.35rem] border border-border bg-surface px-5 py-4 text-sm leading-7 text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              {quickLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  className="block rounded-[1.5rem] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(20,50,37,0.05)] hover:-translate-y-0.5 hover:border-brand/25"
                >
                  <p className="text-lg font-semibold text-brand-strong">
                    {link.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {link.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

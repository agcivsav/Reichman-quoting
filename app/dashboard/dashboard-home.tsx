"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { clearAccountPreview } from "@/utils/account-auth/account-preview";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRequiredAccountSession } from "@/utils/account-auth/use-required-account-session";

const adminAllowedRoles = ["admin"] as const;

type QuoteStatus =
  | "Accepted"
  | "Declined"
  | "Open"
  | "New"
  | "Draft"
  | "Quoting"
  | "Agreed";

type QuoteRow = {
  amount: string;
  id: string;
  lastModified: string;
  owner: string;
  status: QuoteStatus;
  title: string;
};

type MessageRow = {
  assignedTo: string;
  lastModified: string;
  latestMessage: string;
  quoteId: string;
  quoteStatus: QuoteStatus;
  sentDate: string;
  senderName: string;
};

const pendingQuotes: QuoteRow[] = [
  {
    amount: "$18,420",
    id: "Q-20481",
    lastModified: "Mar 30, 2026, 4:46 PM",
    owner: "Megan",
    status: "New",
    title: "Prairie Ridge Co-op (Jordan Kim)",
  },
  {
    amount: "$9,860",
    id: "Q-20476",
    lastModified: "Mar 30, 2026, 4:32 PM",
    owner: "Tyler",
    status: "Open",
    title: "Holt Family Farms (Sara Doyle)",
  },
  {
    amount: "$26,135",
    id: "Q-20471",
    lastModified: "Mar 30, 2026, 4:13 PM",
    owner: "Amanda",
    status: "Quoting",
    title: "Keystone Ag Supply (Ben Foster)",
  },
  {
    amount: "$12,540",
    id: "Q-20464",
    lastModified: "Mar 30, 2026, 3:54 PM",
    owner: "Chris",
    status: "Draft",
    title: "Miller Grain Services (Luke Barnett)",
  },
  {
    amount: "$34,900",
    id: "Q-20458",
    lastModified: "Mar 30, 2026, 3:08 PM",
    owner: "Megan",
    status: "Agreed",
    title: "Harvest Bridge LLC (Alyssa Warren)",
  },
  {
    amount: "$7,290",
    id: "Q-20441",
    lastModified: "Mar 30, 2026, 2:22 PM",
    owner: "Tyler",
    status: "Accepted",
    title: "North Fork Orchards (Carmen Ellis)",
  },
  {
    amount: "$15,770",
    id: "Q-20438",
    lastModified: "Mar 30, 2026, 1:47 PM",
    owner: "Amanda",
    status: "Declined",
    title: "Anderson Grain (Mark Peters)",
  },
  {
    amount: "$11,240",
    id: "Q-20431",
    lastModified: "Mar 30, 2026, 11:18 AM",
    owner: "Chris",
    status: "Open",
    title: "Blue Stem Farms (Emma Hill)",
  },
  {
    amount: "$13,880",
    id: "Q-20428",
    lastModified: "Mar 30, 2026, 10:41 AM",
    owner: "Megan",
    status: "Open",
    title: "Ware Farms (Larry Ware)",
  },
];

const unreadMessages: MessageRow[] = [
  {
    assignedTo: "Megan",
    lastModified: "6 min ago",
    latestMessage: "Can you confirm the final pricing before we release this to the customer?",
    quoteId: "Q-20481",
    quoteStatus: "New",
    senderName: "Jordan Kim",
    sentDate: "Mar 30, 2026",
  },
  {
    assignedTo: "Megan",
    lastModified: "19 min ago",
    latestMessage: "We can close this today if the revised freight terms go out before lunch.",
    quoteId: "Q-20458",
    quoteStatus: "Agreed",
    senderName: "Alyssa Warren",
    sentDate: "Mar 30, 2026",
  },
  {
    assignedTo: "Chris",
    lastModified: "37 min ago",
    latestMessage: "License attachment is uploaded now, so please reopen the quote for processing.",
    quoteId: "Q-20464",
    quoteStatus: "Draft",
    senderName: "Luke Barnett",
    sentDate: "Mar 30, 2026",
  },
  {
    assignedTo: "Tyler",
    lastModified: "58 min ago",
    latestMessage: "Please call back before 2:30 PM with the alternate product mix.",
    quoteId: "Q-20441",
    quoteStatus: "Accepted",
    senderName: "Carmen Ellis",
    sentDate: "Mar 30, 2026",
  },
  {
    assignedTo: "Amanda",
    lastModified: "1 hr ago",
    latestMessage: "We need pricing guidance before sending this quote out to the branch team.",
    quoteId: "Q-20471",
    quoteStatus: "Quoting",
    senderName: "Ben Foster",
    sentDate: "Mar 30, 2026",
  },
  {
    assignedTo: "Tyler",
    lastModified: "2 hrs ago",
    latestMessage: "Everything looks right on our side and we are ready to release the quote.",
    quoteId: "Q-20476",
    quoteStatus: "Open",
    senderName: "Sara Doyle",
    sentDate: "Mar 30, 2026",
  },
  {
    assignedTo: "Amanda",
    lastModified: "3 hrs ago",
    latestMessage: "Customer passed for now but wants to revisit the quote in two weeks.",
    quoteId: "Q-20438",
    quoteStatus: "Declined",
    senderName: "Mark Peters",
    sentDate: "Mar 30, 2026",
  },
  {
    assignedTo: "Chris",
    lastModified: "Today",
    latestMessage: "The customer wants a cleaner PDF version before sharing internally.",
    quoteId: "Q-20431",
    quoteStatus: "Open",
    senderName: "Emma Hill",
    sentDate: "Mar 30, 2026",
  },
  {
    assignedTo: "Megan",
    lastModified: "Today",
    latestMessage: "Please resend the updated freight version for signature this afternoon.",
    quoteId: "Q-20428",
    quoteStatus: "Open",
    senderName: "Larry Ware",
    sentDate: "Mar 30, 2026",
  },
];

function getStatusStyles(status: QuoteStatus) {
  switch (status) {
    case "Accepted":
      return {
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
      };
    case "Declined":
      return {
        badge: "border-rose-200 bg-rose-50 text-rose-700",
        dot: "bg-rose-500",
      };
    case "Open":
      return {
        badge: "border-sky-200 bg-sky-50 text-sky-700",
        dot: "bg-sky-500",
      };
    case "New":
      return {
        badge: "border-cyan-200 bg-cyan-50 text-cyan-700",
        dot: "bg-cyan-500",
      };
    case "Draft":
      return {
        badge: "border-slate-200 bg-slate-50 text-slate-700",
        dot: "bg-slate-500",
      };
    case "Quoting":
      return {
        badge: "border-amber-200 bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
      };
    case "Agreed":
      return {
        badge: "border-lime-200 bg-lime-50 text-lime-700",
        dot: "bg-lime-500",
      };
  }
}

function DashboardPanel({
  children,
  count,
  title,
}: {
  children: React.ReactNode;
  count: number;
  title: string;
}) {
  return (
    <section className="overflow-hidden rounded-[0.9rem] border border-[#d8d4cc] bg-white shadow-[0_16px_35px_rgba(20,50,37,0.06)]">
      <div className="flex items-center justify-between border-b border-[#e7e1d6] px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-brand-strong">{title}</h2>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
            {count}
          </span>
        </div>
        <div className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-muted sm:block">
          Updated
        </div>
      </div>
      {children}
    </section>
  );
}

export default function DashboardHome() {
  const router = useRouter();
  const { account, errorMessage, isCheckingSession } = useRequiredAccountSession({
    allowedRoles: adminAllowedRoles,
  });
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const confirmSignOut = async () => {
    setIsLoggingOut(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signOut({ scope: "local" });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      setIsLoggingOut(false);
      toast.error(error instanceof Error ? error.message : "Unable to log out.");
      return;
    }

    clearAccountPreview();
    setIsLogoutDialogOpen(false);
    setIsLoggingOut(false);
    toast.success("Logged out successfully.");
    router.replace("/account/login");
    router.refresh();
  };

  if (isCheckingSession) {
    return (
      <main className="page-shell grain-overlay">
        <section className="mx-auto w-full max-w-[1400px] px-4 pt-4 pb-10 sm:px-6 lg:px-8 lg:pt-6">
          <div className="rounded-[1rem] border border-white/70 bg-white/84 px-6 py-10 text-sm text-muted shadow-[0_28px_80px_rgba(20,50,37,0.08)] backdrop-blur">
            Loading your dashboard...
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="page-shell grain-overlay">
        <section className="mx-auto w-full max-w-[1400px] px-4 pt-4 pb-10 sm:px-6 lg:px-8 lg:pt-6">
          <div className="rounded-[1rem] border border-red-200 bg-red-50 px-6 py-10 text-sm text-red-700 shadow-[0_28px_80px_rgba(20,50,37,0.08)]">
            {errorMessage}
          </div>
        </section>
      </main>
    );
  }

  if (!account) {
    return null;
  }

  return (
    <main className="page-shell grain-overlay">
      <ConfirmDialog
        cancelLabel="Stay signed in"
        confirmLabel="Log out"
        confirmPendingLabel="Logging out..."
        description="You will be signed out of the Reichman Sales & Service admin dashboard and returned to the login page."
        isOpen={isLogoutDialogOpen}
        isPending={isLoggingOut}
        onCancel={() => setIsLogoutDialogOpen(false)}
        onConfirm={confirmSignOut}
        title="Log out?"
      />

      <section className="mx-auto w-full max-w-[1400px] px-4 pt-4 pb-10 sm:px-6 lg:px-8 lg:pt-6">
        <div className="overflow-hidden rounded-[1rem] border border-[#d9d3c7] bg-[rgba(255,250,242,0.9)] shadow-[0_24px_60px_rgba(20,50,37,0.08)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-brand px-4 py-3 text-white sm:px-5">
            <div className="flex items-center gap-4">
              <div className="rounded-sm bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                Reichman
              </div>
              <div className="hidden items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 md:flex">
                <span className="text-white">Dashboard</span>
                <span>Quotes</span>
                <span>Messages</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-white">{account.name || "Admin"}</p>
                <p className="text-[11px] text-white/70">{account.email}</p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-semibold text-white hover:bg-white/14"
              >
                Home
              </Link>
              <button
                type="button"
                onClick={() => setIsLogoutDialogOpen(true)}
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand-strong hover:bg-white/92"
              >
                Log out
              </button>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-5 lg:px-6 lg:py-6">
            <div className="flex flex-col gap-4 border-b border-[#e5dfd2] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-display text-4xl text-brand-strong">Dashboard</h1>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Quote activity and unread quote conversations for the admin team.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:w-[320px]">
                <div className="rounded-[0.9rem] border border-[#e4ddd0] bg-white px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                    Pending Quotes
                  </p>
                  <p className="mt-2 text-xl font-semibold text-brand-strong">
                    {pendingQuotes.length}
                  </p>
                </div>
                <div className="rounded-[0.9rem] border border-[#e4ddd0] bg-white px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                    Unread Messages
                  </p>
                  <p className="mt-2 text-xl font-semibold text-brand-strong">
                    {unreadMessages.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
              <DashboardPanel count={pendingQuotes.length} title="Pending Quotes">
                <div className="hidden grid-cols-[minmax(0,1fr)_110px] border-b border-[#efe9de] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:grid">
                  <span>Quote</span>
                  <span className="text-right">Amount</span>
                </div>
                <div>
                  {pendingQuotes.map((quote, index) => {
                    const statusStyles = getStatusStyles(quote.status);

                    return (
                      <article
                        key={quote.id}
                        className={`grid gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_110px] sm:items-start ${
                          index === 0 ? "" : "border-t border-[#f1ece2]"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className={`h-2.5 w-2.5 flex-none rounded-full ${statusStyles.dot}`} />
                            <p className="truncate text-sm font-semibold text-[#2d5f89]">
                              {quote.title}
                            </p>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusStyles.badge}`}
                            >
                              {quote.status}
                            </span>
                            <span className="text-[11px] text-muted">
                              Last modified {quote.lastModified}
                            </span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-semibold text-brand-strong">{quote.amount}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </DashboardPanel>

              <DashboardPanel count={unreadMessages.length} title="Unread Messages">
                <div className="hidden grid-cols-[minmax(0,1fr)_92px] border-b border-[#efe9de] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:grid">
                  <span>Message</span>
                  <span className="text-right">Status</span>
                </div>
                <div>
                  {unreadMessages.map((message, index) => {
                    const statusStyles = getStatusStyles(message.quoteStatus);

                    return (
                      <article
                        key={`${message.quoteId}-${message.senderName}`}
                        className={`grid gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_92px] sm:items-start ${
                          index === 0 ? "" : "border-t border-[#f1ece2]"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className={`h-2.5 w-2.5 flex-none rounded-full ${statusStyles.dot}`} />
                            <p className="truncate text-sm font-semibold text-[#2d5f89]">
                              {message.senderName}
                            </p>
                          </div>
                          <p className="mt-1 truncate text-[11px] text-muted">
                            {message.latestMessage}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
                            <span>{message.quoteId}</span>
                            <span>{message.assignedTo}</span>
                            <span>Sent date {message.sentDate}</span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusStyles.badge}`}
                          >
                            {message.quoteStatus}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </DashboardPanel>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

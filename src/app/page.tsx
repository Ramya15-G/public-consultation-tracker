"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ConsultationStatus = "Open" | "Closing soon" | "Closed";

type Consultation = {
  id: string;
  title: string;
  department: string;
  topic: string;
  deadline: string;
  status: ConsultationStatus;
  isDemo: true;
};

const DEMO_CONSULTATIONS: Consultation[] = [
  {
    id: "demo-1",
    title: "Draft Rules on Plastic Waste Management (Amendment)",
    department: "Ministry of Environment, Forest and Climate Change",
    topic: "Environment",
    deadline: "2026-11-15",
    status: "Open",
    isDemo: true,
  },
  {
    id: "demo-2",
    title: "Telemedicine Practice Guidelines — Public Feedback",
    department: "Ministry of Health and Family Welfare",
    topic: "Health",
    deadline: "2026-10-25",
    status: "Closing soon",
    isDemo: true,
  },
  {
    id: "demo-3",
    title: "National Electric Mobility Standards for Public Charging",
    department: "Ministry of Power",
    topic: "Transport & energy",
    deadline: "2026-09-30",
    status: "Closed",
    isDemo: true,
  },
];

const ALL_TOPICS = [
  "All topics",
  ...Array.from(new Set(DEMO_CONSULTATIONS.map((c) => c.topic))).sort(),
];

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysRemaining(deadlineIso: string): number {
  const today = startOfDay(new Date());
  const deadline = startOfDay(new Date(deadlineIso + "T00:00:00"));
  const diffMs = deadline.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function deadlineLabel(deadlineIso: string): string {
  const days = daysRemaining(deadlineIso);
  if (days < 0) {
    const closedDays = Math.abs(days);
    return closedDays === 1 ? "Closed 1 day ago" : `Closed ${closedDays} days ago`;
  }
  if (days === 0) return "Closes today";
  if (days === 1) return "1 day remaining";
  return `${days} days remaining`;
}

function statusStyles(status: ConsultationStatus): string {
  switch (status) {
    case "Open":
      return "bg-emerald-100 text-emerald-900 ring-emerald-600/20";
    case "Closing soon":
      return "bg-amber-100 text-amber-950 ring-amber-600/25";
    case "Closed":
      return "bg-slate-200 text-slate-800 ring-slate-500/20";
  }
}

function countdownTone(days: number): string {
  if (days < 0) return "text-slate-500";
  if (days <= 7) return "text-amber-800";
  return "text-teal-800";
}

function DeadlineCountdown({ deadline }: { deadline: string }) {
  const [display, setDisplay] = useState<{ label: string; tone: string }>({
    label: "Calculating…",
    tone: "text-slate-600",
  });

  useEffect(() => {
    const days = daysRemaining(deadline);
    setDisplay({
      label: deadlineLabel(deadline),
      tone: countdownTone(days),
    });
  }, [deadline]);

  return (
    <dd className={`font-semibold ${display.tone}`} suppressHydrationWarning>
      {display.label}
    </dd>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("All topics");

  const filteredConsultations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return DEMO_CONSULTATIONS.filter((c) => {
      const matchesTopic =
        topicFilter === "All topics" || c.topic === topicFilter;
      if (!matchesTopic) return false;
      if (!query) return true;
      const haystack = `${c.title} ${c.department} ${c.topic}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery, topicFilter]);

  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <nav
          className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6"
          aria-label="Main"
        >
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-teal-900"
          >
            Public Consultation Tracker
          </Link>
          <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
            {[
              { href: "/", label: "Home" },
              { href: "#consultations", label: "Consultations" },
              { href: "#about", label: "About" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-teal-50 to-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <p className="mb-3 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-900">
              Civic participation made clearer
            </p>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl sm:leading-tight">
              Discover draft government rules, understand them, and have your
              say
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700">
              Public Consultation Tracker helps citizens find open government
              consultations, read plain-language AI summaries of draft rules
              (coming soon), and submit comments after review and approval
              (coming soon). Everything on this page uses local demo data for
              the hackathon prototype.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#consultations"
                className="inline-flex items-center justify-center rounded-lg bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
              >
                Browse consultations
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
              >
                How it works
              </Link>
            </div>
          </div>
        </section>

        <section
          id="consultations"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16"
          aria-labelledby="consultations-heading"
        >
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="consultations-heading"
                className="text-2xl font-bold text-slate-900"
              >
                Open consultations
              </h2>
              <p className="mt-1 text-slate-600">
                Search and filter demo listings below. No account required on
                this prototype.
              </p>
            </div>
            <p className="text-sm font-medium text-slate-500">
              Showing {filteredConsultations.length} of{" "}
              {DEMO_CONSULTATIONS.length} demo items
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label
                htmlFor="search"
                className="mb-1.5 block text-sm font-medium text-slate-800"
              >
                Search
              </label>
              <input
                id="search"
                type="search"
                placeholder="Search by title, department, or topic…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              />
            </div>
            <div className="sm:min-w-[220px]">
              <label
                htmlFor="topic"
                className="mb-1.5 block text-sm font-medium text-slate-800"
              >
                Topic
              </label>
              <select
                id="topic"
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              >
                {ALL_TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredConsultations.length === 0 ? (
            <div
              className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"
              role="status"
            >
              <p className="font-medium text-slate-900">No consultations match</p>
              <p className="mt-1 text-sm text-slate-600">
                Try a different search term or choose &ldquo;All topics&rdquo;.
              </p>
            </div>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredConsultations.map((consultation) => (
                <li key={consultation.id}>
                  <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-indigo-900">
                        Demo data
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyles(consultation.status)}`}
                      >
                        {consultation.status}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold leading-snug text-slate-900">
                      {consultation.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {consultation.department}
                    </p>
                    <dl className="mt-4 flex flex-1 flex-col gap-2 text-sm">
                      <div className="flex justify-between gap-2">
                        <dt className="text-slate-500">Topic</dt>
                        <dd className="font-medium text-slate-800">
                          {consultation.topic}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-slate-500">Deadline</dt>
                        <dd className="font-medium text-slate-800">
                          {new Date(
                            consultation.deadline + "T00:00:00",
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2 border-t border-slate-100 pt-2">
                        <dt className="text-slate-500">Time left</dt>
                        <DeadlineCountdown deadline={consultation.deadline} />
                      </div>
                    </dl>
                    <button
                      type="button"
                      disabled
                      className="mt-5 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-500"
                      title="Comment submission will be added in a later version"
                    >
                      View &amp; comment (coming soon)
                    </button>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          id="about"
          className="scroll-mt-24 border-t border-slate-200 bg-white"
          aria-labelledby="about-heading"
        >
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <h2
              id="about-heading"
              className="text-2xl font-bold text-slate-900"
            >
              About this project
            </h2>
            <p className="mt-3 max-w-3xl text-slate-700 leading-relaxed">
              Governments publish draft rules and invite public comments for a
              limited time. Those notices can be hard to find and even harder to
              read. This hackathon prototype shows a dashboard where you can
              discover consultations, see key details at a glance, and— in a
              full version—use AI summaries and a moderated comment flow before
              submission.
            </p>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Discover",
                  body: "Search and filter consultations by topic and department.",
                },
                {
                  step: "2",
                  title: "Understand",
                  body: "AI summaries will explain draft rules in simple language.",
                },
                {
                  step: "3",
                  title: "Participate",
                  body: "Comments will go through approval before official submission.",
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-800 text-sm font-bold text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-3 font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-slate-600 sm:px-6">
          Public Consultation Tracker — hackathon demo. Data is stored locally
          in this page only.
        </div>
      </footer>
    </div>
  );
}

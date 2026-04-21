import Link from "next/link";
import { Badge } from "@/components/Badge";
import { FeedbackForm } from "@/components/FeedbackForm";

const ideaPrompts = [
  "Missing Latvia or Baltic event",
  "Driver profile correction",
  "New series to track",
  "Broken link or wrong date",
  "Feature idea for fans",
  "Data source partnership",
];

export default function FeedbackPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-[36px] border border-white/10 bg-[linear-gradient(145deg,rgba(251,146,60,0.18),rgba(12,16,22,0.94)_38%,rgba(56,189,248,0.1)_100%)] p-6 md:p-8">
        <div className="flex flex-wrap gap-2">
          <Badge tone="hot">Feedback</Badge>
          <Badge tone="lv">Event tips welcome</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
          Help make RaceHub sharper.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">
          Found a missing race, a Latvian driver update, a wrong date, or a feature idea? Send it straight into the RaceHub feedback inbox so it can be reviewed from the admin panel.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-2xl font-black tracking-tight text-white">Good feedback ideas</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {ideaPrompts.map((prompt) => (
                <span
                  key={prompt}
                  className="rounded-full border border-white/10 bg-[#0b1016] px-3 py-2 text-xs font-medium text-white/70"
                >
                  {prompt}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-white/62">
              The most useful event tips include title, date, city, country, series, official link, and whether Latvian drivers are involved.
            </p>
          </div>

          <Link
            href="/api/imports/status"
            className="block rounded-[28px] border border-white/10 bg-white/[0.045] p-6 transition hover:bg-white/[0.075]"
          >
            <div className="flex flex-wrap gap-2">
              <Badge tone="world">Automation</Badge>
              <Badge tone="neutral">JSON status</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-white">Check import status</h2>
            <p className="mt-3 text-sm leading-6 text-white/62">
              See which feeds are automated, available for live import, or curated manually.
            </p>
          </Link>
        </div>

        <FeedbackForm />
      </section>
    </main>
  );
}

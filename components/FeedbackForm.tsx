"use client";

import { useState } from "react";

type SubmitState = {
  type: "idle" | "success" | "error";
  message?: string;
};

export function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Event suggestion");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle" });

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          topic,
          message,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not send feedback.");
      }

      setMessage("");
      setSubmitState({
        type: "success",
        message: "Thanks. Your feedback was saved and is now visible in the admin panel.",
      });
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "Could not send feedback.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="rounded-[32px] border border-white/10 bg-white/[0.045] p-6"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/78">Your name</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
            placeholder="Optional"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/78">Email</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
            placeholder="Optional, if you want a reply"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
      </div>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-semibold text-white/78">Feedback type</span>
        <select
          className="w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
        >
          <option>Event suggestion</option>
          <option>Driver update</option>
          <option>Bug report</option>
          <option>Feature idea</option>
          <option>Partnership or data source</option>
        </select>
      </label>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-semibold text-white/78">Message</span>
        <textarea
          className="min-h-40 w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-orange-400/50"
          placeholder="Tell me what event is missing, what should be improved, or what feature would make RaceHub better."
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl border border-orange-400/30 bg-orange-500/16 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500/22 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send feedback"}
        </button>
        <span className="text-sm text-white/55">Saved privately for admins inside RaceHub.</span>
      </div>

      {submitState.message ? (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
            submitState.type === "success"
              ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
              : "border-red-400/25 bg-red-500/10 text-red-100"
          }`}
        >
          {submitState.message}
        </div>
      ) : null}
    </form>
  );
}

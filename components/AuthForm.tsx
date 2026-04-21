"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthMode = "login" | "register";

export function AuthForm({
  mode,
  nextPath = "/admin",
}: {
  mode: AuthMode;
  nextPath?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(isRegister ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          adminCode,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Authentication failed.");
      }

      router.push(nextPath);
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/10 bg-white/[0.045] p-6">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-orange-400/30 bg-orange-500/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-orange-100">
          {isRegister ? "Create account" : "Admin login"}
        </span>
      </div>

      <h1 className="mt-4 text-4xl font-black tracking-tight text-white">
        {isRegister ? "Register for RaceHub" : "Sign in to RaceHub"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-white/62">
        {isRegister
          ? "The first registered account becomes the admin. Later accounts are standard users unless they use a configured admin invite code."
          : "Sign in to manage feedback, users and admin tools."}
      </p>

      <div className="mt-6 grid gap-4">
        {isRegister ? (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-white/78">Name</span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
        ) : null}

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/78">Email</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/78">Password</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
            minLength={8}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {isRegister ? (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-white/78">Admin invite code</span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
              placeholder="Optional"
              value={adminCode}
              onChange={(event) => setAdminCode(event.target.value)}
            />
          </label>
        ) : null}
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl border border-orange-400/30 bg-orange-500/16 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500/22 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Working..." : isRegister ? "Create account" : "Sign in"}
        </button>
        <Link
          href={isRegister ? `/login?next=${encodeURIComponent(nextPath)}` : `/register?next=${encodeURIComponent(nextPath)}`}
          className="rounded-2xl border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-white/78 transition hover:bg-white/10"
        >
          {isRegister ? "Already have an account?" : "Need an account?"}
        </Link>
      </div>
    </form>
  );
}

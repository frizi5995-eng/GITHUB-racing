import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/AdminPanel";
import { Badge } from "@/components/Badge";
import { getCurrentUser, listFeedback, listUsers } from "@/lib/serverStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (user.role !== "admin") {
    return (
      <main className="mx-auto max-w-2xl rounded-[32px] border border-white/10 bg-white/[0.045] p-6">
        <Badge tone="neutral">User account</Badge>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">Admin access required</h1>
        <p className="mt-3 text-sm leading-6 text-white/62">
          You are signed in, but this area is limited to admin accounts. Ask an existing admin to promote your user in the admin panel.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-2xl border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-white/78 transition hover:bg-white/10"
          >
            Back home
          </Link>
          <Link
            href="/feedback"
            className="rounded-2xl border border-orange-400/30 bg-orange-500/16 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500/22"
          >
            Send feedback
          </Link>
        </div>
      </main>
    );
  }

  const [feedback, users] = await Promise.all([listFeedback(), listUsers()]);

  return <AdminPanel initialFeedback={feedback} initialUsers={users} currentUser={user} />;
}

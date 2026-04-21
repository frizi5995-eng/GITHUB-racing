import { NavClient } from "@/components/NavClient";
import { getCurrentUser } from "@/lib/serverStore";

export async function Nav() {
  const user = await getCurrentUser();

  return <NavClient user={user} />;
}

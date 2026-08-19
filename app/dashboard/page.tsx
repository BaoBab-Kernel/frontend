import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  if (!BACKEND_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured");
  }

  const [session, overview] = await Promise.all([
    getServerSession(authOptions),
    fetch(`${BACKEND_URL}/api/status`, {
      headers: {
        "x-api-key": API_KEY ?? ""
      },
      cache: "no-store"
    }).then(res => res.json())
  ]);

  return (
    <main className="container py-8">
      <div className="mb-8 flex flex-col gap-2">
        <p className="font-mono text-sm uppercase text-cyan-200">Railway backend</p>
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="text-muted-foreground">
          Connecté en REST au backend Railway. Session active: {session?.user?.email ?? "invite"}.
        </p>
      </div>
      <DashboardPanel overview={overview} />
    </main>
  );
}

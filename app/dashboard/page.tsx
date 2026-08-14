import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBackendOverview } from "@/lib/api-client";
import { DashboardPanel } from "@/components/dashboard-panel";

export default async function DashboardPage() {
  const [session, overview] = await Promise.all([
    getServerSession(authOptions),
    getBackendOverview()
  ]);

  return (
    <main className="container py-8">
      <div className="mb-8 flex flex-col gap-2">
        <p className="font-mono text-sm uppercase text-cyan-200">Railway backend</p>
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="text-muted-foreground">
          Connecte en REST au backend Railway. Session active: {session?.user?.email ?? "invite"}.
        </p>
      </div>
      <DashboardPanel overview={overview} />
    </main>
  );
}

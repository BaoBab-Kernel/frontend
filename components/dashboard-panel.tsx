import { Activity, Database, RadioTower } from "lucide-react";
import type { BackendOverview } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const toneClass = {
  cyan: "border-cyan-300/25 text-cyan-100",
  magenta: "border-fuchsia-300/25 text-fuchsia-100",
  neutral: "border-white/10 text-white"
};

export function DashboardPanel({ overview }: { overview: BackendOverview }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="grid gap-4 sm:grid-cols-3">
        {overview.metrics.map((metric) => (
          <Card key={metric.label} className={cn("bg-card/80", toneClass[metric.tone ?? "neutral"])}>
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-xs uppercase text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="truncate text-2xl font-semibold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </section>
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <RadioTower className="h-4 w-4 text-cyan-200" />
            Etat backend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border border-cyan-300/15 bg-black/30 p-3">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              Status
            </span>
            <span className="font-mono text-sm text-cyan-100">{overview.health.status ?? "unknown"}</span>
          </div>
          <div className="flex items-center justify-between rounded-md border border-fuchsia-300/15 bg-black/30 p-3">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Database className="h-4 w-4" />
              Source
            </span>
            <span className="font-mono text-sm text-fuchsia-100">REST</span>
          </div>
          <pre className="max-h-72 overflow-auto rounded-md border border-white/10 bg-black/40 p-3 font-mono text-xs text-muted-foreground">
            {JSON.stringify(overview.raw, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

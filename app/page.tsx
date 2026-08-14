import Link from "next/link";
import { Activity, Bot, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="container flex min-h-[calc(100vh-5rem)] items-center py-12">
      <section className="grid w-full gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
            <Activity className="h-4 w-4" />
            Propylee Control Surface
          </div>
          <h1 className="text-5xl font-semibold tracking-normal text-white md:text-7xl">
            Propylee
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Interface frontend separee pour superviser le backend Railway et piloter MCP-Server-Agent_ts en HTTP et WebSockets.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard">
                <Gauge className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/agent">
                <Bot className="mr-2 h-4 w-4" />
                UI Agent
              </Link>
            </Button>
          </div>
        </div>
        <div className="panel-border rounded-lg bg-card/70 p-5 shadow-glow backdrop-blur">
          <div className="font-mono text-xs uppercase text-cyan-200">runtime map</div>
          <div className="mt-5 space-y-4 font-mono text-sm">
            <div className="rounded-md border border-cyan-300/15 bg-black/30 p-4">
              <span className="text-cyan-200">frontend</span>
              <span className="text-muted-foreground"> / Next.js 14 App Router</span>
            </div>
            <div className="rounded-md border border-fuchsia-300/15 bg-black/30 p-4">
              <span className="text-fuchsia-200">backend</span>
              <span className="text-muted-foreground"> / Railway REST</span>
            </div>
            <div className="rounded-md border border-cyan-300/15 bg-black/30 p-4">
              <span className="text-cyan-200">agent</span>
              <span className="text-muted-foreground"> / MCP HTTP + WS</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

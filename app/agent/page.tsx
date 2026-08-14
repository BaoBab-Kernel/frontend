"use client";

import { AgentWorkspace } from "@/components/agent-workspace";

export default function AgentPage() {
  return (
    <main className="container py-8">
      <div className="mb-6 flex flex-col gap-2">
        <p className="font-mono text-sm uppercase text-fuchsia-200">MCP-Server-Agent_ts</p>
        <h1 className="text-3xl font-semibold text-white">UI Agent</h1>
        <p className="text-muted-foreground">
          Interface independante pour lister les outils MCP, executer des appels et suivre les logs WebSocket.
        </p>
      </div>
      <AgentWorkspace />
    </main>
  );
}

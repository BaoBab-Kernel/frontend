"use client";

import { useEffect, useMemo, useState } from "react";
import { Cable, Play, RefreshCw, Send, Wrench } from "lucide-react";
import { callMcpTool, createMcpSocket, listMcpTools, type McpMessage, type McpTool } from "@/lib/mcp-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JsonConsole } from "@/components/json-console";

const fallbackTools: McpTool[] = [
  {
    name: "agent.status",
    description: "Read agent server status",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "agent.run",
    description: "Run a direct agent instruction",
    inputSchema: {
      type: "object",
      properties: {
        instruction: { type: "string" }
      }
    }
  }
];

function schemaFields(tool?: McpTool) {
  const properties = tool?.inputSchema?.properties;
  if (!properties || typeof properties !== "object" || Array.isArray(properties)) {
    return [];
  }

  return Object.entries(properties as Record<string, { type?: string; description?: string }>).map(([name, schema]) => ({
    name,
    type: schema.type ?? "string",
    description: schema.description
  }));
}

export function AgentWorkspace() {
  const [tools, setTools] = useState<McpTool[]>(fallbackTools);
  const [selectedToolName, setSelectedToolName] = useState(fallbackTools[0].name);
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [manualJson, setManualJson] = useState("{}");
  const [consoleValue, setConsoleValue] = useState<unknown>({ ready: true });
  const [logs, setLogs] = useState<McpMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedTool = useMemo(
    () => tools.find((tool) => tool.name === selectedToolName) ?? tools[0],
    [selectedToolName, tools]
  );
  const fields = schemaFields(selectedTool);

  async function refreshTools() {
    setIsLoading(true);
    try {
      const nextTools = await listMcpTools();
      if (nextTools.length > 0) {
        setTools(nextTools);
        setSelectedToolName(nextTools[0].name);
      }
      setConsoleValue({ tools: nextTools });
    } catch (error) {
      setConsoleValue({ error: error instanceof Error ? error.message : "Unable to list MCP tools" });
    } finally {
      setIsLoading(false);
    }
  }

  async function runSelectedTool() {
    setIsLoading(true);
    try {
      const structuredInput = fields.reduce<Record<string, unknown>>((acc, field) => {
        const value = formState[field.name];
        if (value !== undefined && value !== "") {
          acc[field.name] = field.type === "number" ? Number(value) : value;
        }
        return acc;
      }, {});
      const input = fields.length > 0 ? structuredInput : JSON.parse(manualJson || "{}");
      const result = await callMcpTool(selectedTool.name, input);
      setConsoleValue(result);
    } catch (error) {
      setConsoleValue({ error: error instanceof Error ? error.message : "MCP tool call failed" });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshTools();
  }, []);

  useEffect(() => {
    const socket = createMcpSocket((message) => {
      setLogs((current) => [message, ...current].slice(0, 80));
    });

    return () => socket?.close();
  }, []);

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_1fr_360px]">
      <Card className="bg-card/80">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="h-4 w-4 text-cyan-200" />
            Outils MCP
          </CardTitle>
          <Button size="icon" variant="ghost" onClick={refreshTools} disabled={isLoading} aria-label="Rafraichir">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="grid gap-2">
          {tools.map((tool) => (
            <button
              key={tool.name}
              type="button"
              onClick={() => setSelectedToolName(tool.name)}
              className={`rounded-md border p-3 text-left transition ${
                selectedToolName === tool.name
                  ? "border-cyan-300/40 bg-cyan-300/10 text-white"
                  : "border-white/10 bg-black/20 text-muted-foreground hover:border-cyan-300/25"
              }`}
            >
              <div className="font-mono text-sm">{tool.name}</div>
              {tool.description ? <div className="mt-1 line-clamp-2 text-xs">{tool.description}</div> : null}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Send className="h-4 w-4 text-fuchsia-200" />
            Appel outil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tool-name">Outil</Label>
            <Input id="tool-name" value={selectedTool?.name ?? ""} readOnly className="mt-2 font-mono" />
          </div>

          {fields.length > 0 ? (
            <div className="grid gap-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <Label htmlFor={field.name}>{field.name}</Label>
                  <Input
                    id={field.name}
                    type={field.type === "number" ? "number" : "text"}
                    placeholder={field.description ?? field.type}
                    value={formState[field.name] ?? ""}
                    onChange={(event) => setFormState((current) => ({ ...current, [field.name]: event.target.value }))}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <Label htmlFor="manual-json">JSON input</Label>
              <Textarea
                id="manual-json"
                value={manualJson}
                onChange={(event) => setManualJson(event.target.value)}
                className="mt-2 min-h-36 font-mono"
              />
            </div>
          )}

          <Button onClick={runSelectedTool} disabled={isLoading || !selectedTool}>
            <Play className="mr-2 h-4 w-4" />
            Executer
          </Button>

          <JsonConsole value={consoleValue} />
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Cable className="h-4 w-4 text-cyan-200" />
            Logs temps reel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[620px] space-y-3 overflow-auto rounded-md border border-white/10 bg-black/40 p-3">
            {logs.length === 0 ? (
              <p className="font-mono text-xs text-muted-foreground">En attente de messages WebSocket.</p>
            ) : (
              logs.map((log, index) => (
                <div key={`${log.type}-${index}`} className="rounded border border-cyan-300/10 bg-cyan-300/5 p-2">
                  <div className="mb-1 font-mono text-xs text-cyan-100">{log.type}</div>
                  <pre className="overflow-auto font-mono text-xs text-muted-foreground">
                    {JSON.stringify(log.payload ?? log, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

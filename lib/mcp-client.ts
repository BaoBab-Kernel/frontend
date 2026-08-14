export type McpTool = {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
};

export type McpMessage = {
  type: string;
  payload?: unknown;
  id?: string;
  timestamp?: string;
};

export type McpCallResult = {
  content?: unknown;
  result?: unknown;
  error?: unknown;
};

const PUBLIC_MCP_HTTP_URL = process.env.NEXT_PUBLIC_MCP_HTTP_URL;
const PUBLIC_MCP_WS_URL = process.env.NEXT_PUBLIC_MCP_WS_URL;

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function mcpHttpRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = PUBLIC_MCP_HTTP_URL || "/api/mcp";
  const url = PUBLIC_MCP_HTTP_URL ? joinUrl(baseUrl, path) : `/api/mcp?path=${encodeURIComponent(path)}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`MCP request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function listMcpTools(): Promise<McpTool[]> {
  const response = await mcpHttpRequest<{ tools?: McpTool[] } | McpTool[]>("/tools");
  return Array.isArray(response) ? response : response.tools ?? [];
}

export async function callMcpTool(name: string, input: Record<string, unknown>): Promise<McpCallResult> {
  return mcpHttpRequest<McpCallResult>("/tools/call", {
    method: "POST",
    body: JSON.stringify({ name, input })
  });
}

export function createMcpSocket(onMessage: (message: McpMessage) => void) {
  if (typeof window === "undefined") {
    return null;
  }

  const socketUrl = PUBLIC_MCP_WS_URL;
  if (!socketUrl) {
    onMessage({
      type: "system",
      payload: "NEXT_PUBLIC_MCP_WS_URL is not configured",
      timestamp: new Date().toISOString()
    });
    return null;
  }

  const socket = new WebSocket(socketUrl);

  socket.addEventListener("open", () => {
    onMessage({ type: "socket:open", timestamp: new Date().toISOString() });
  });

  socket.addEventListener("message", (event) => {
    try {
      onMessage(JSON.parse(event.data) as McpMessage);
    } catch {
      onMessage({ type: "socket:message", payload: event.data, timestamp: new Date().toISOString() });
    }
  });

  socket.addEventListener("close", () => {
    onMessage({ type: "socket:close", timestamp: new Date().toISOString() });
  });

  socket.addEventListener("error", () => {
    onMessage({ type: "socket:error", timestamp: new Date().toISOString() });
  });

  return socket;
}

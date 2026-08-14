export type BackendHealth = {
  status?: string;
  service?: string;
  version?: string;
  timestamp?: string;
};

export type BackendMetric = {
  label: string;
  value: string | number;
  tone?: "cyan" | "magenta" | "neutral";
};

export type BackendOverview = {
  health: BackendHealth;
  metrics: BackendMetric[];
  raw?: unknown;
};

const PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_RAILWAY_BACKEND_URL;
const SERVER_BACKEND_URL = process.env.RAILWAY_BACKEND_URL;

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function backendRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const directBaseUrl =
    typeof window === "undefined" ? SERVER_BACKEND_URL || PUBLIC_BACKEND_URL : PUBLIC_BACKEND_URL;

  if (directBaseUrl) {
    return requestJson<T>(joinUrl(directBaseUrl, path), init);
  }

  return requestJson<T>(`/api/backend?path=${encodeURIComponent(path)}`, init);
}

export async function getBackendOverview(): Promise<BackendOverview> {
  try {
    const health = await backendRequest<BackendHealth>("/health");
    return {
      health,
      metrics: [
        { label: "REST", value: health.status ?? "online", tone: "cyan" },
        { label: "Service", value: health.service ?? "Railway", tone: "neutral" },
        { label: "Version", value: health.version ?? "unknown", tone: "magenta" }
      ],
      raw: health
    };
  } catch (error) {
    return {
      health: { status: "unreachable" },
      metrics: [
        { label: "REST", value: "offline", tone: "magenta" },
        { label: "Service", value: "Railway", tone: "neutral" },
        { label: "Version", value: "unknown", tone: "neutral" }
      ],
      raw: error instanceof Error ? error.message : error
    };
  }
}

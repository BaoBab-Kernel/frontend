// lib/api-client.ts

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

/**
 * Appelle toujours la route Next.js /api/backend
 * pour éviter d'exposer la clé API et garantir
 * que Railway reçoit bien x-api-key côté serveur.
 */
async function backendProxy<T>(path: string): Promise<T> {
  const res = await fetch(`/api/backend?path=${encodeURIComponent(path)}`, {
    method: "GET",
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error(`Backend request failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Récupère l'état du backend Railway via la route proxy.
 */
export async function getBackendOverview(): Promise<BackendOverview> {
  try {
    const health = await backendProxy<BackendHealth>("/health");

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

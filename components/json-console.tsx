import { cn } from "@/lib/utils";

export function JsonConsole({
  value,
  className
}: {
  value: unknown;
  className?: string;
}) {
  return (
    <pre className={cn("min-h-64 overflow-auto rounded-md border border-white/10 bg-black/50 p-4 font-mono text-xs leading-6 text-cyan-50", className)}>
      {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
    </pre>
  );
}

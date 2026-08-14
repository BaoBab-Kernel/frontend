"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Bot, LayoutDashboard, LogIn, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agent", label: "Agent", icon: Bot }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen tech-grid">
      <header className="sticky top-0 z-40 border-b border-cyan-300/10 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-cyan-300/30 bg-cyan-300/10">
              <Terminal className="h-4 w-4 text-cyan-200" />
            </span>
            <span>Propylee</span>
          </Link>
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Button key={item.href} asChild variant={active ? "secondary" : "ghost"} size="sm">
                  <Link href={item.href} className={cn(active && "text-white")}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
            <Button asChild size="sm">
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

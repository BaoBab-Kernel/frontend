"use client";

import { signIn } from "next-auth/react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="container grid min-h-[calc(100vh-5rem)] place-items-center py-12">
      <section className="panel-border w-full max-w-md rounded-lg bg-card/80 p-6 shadow-magenta backdrop-blur">
        <p className="font-mono text-sm uppercase text-cyan-200">auth</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Connexion Propylee</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          OAuth GitHub ou Google via NextAuth.
        </p>
        <div className="mt-6 grid gap-3">
          <Button onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
            <Github className="mr-2 h-4 w-4" />
            Continuer avec GitHub
          </Button>
          <Button variant="secondary" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
            Continuer avec Google
          </Button>
        </div>
      </section>
    </main>
  );
}

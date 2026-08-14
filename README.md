# Propylee Frontend

Frontend Next.js 14 App Router pour Propylee.

## Stack

- Next.js 14 + TypeScript strict
- TailwindCSS + shadcn/ui local components
- next-themes en theme sombre force
- NextAuth OAuth GitHub + Google
- REST vers backend Railway
- MCP direct HTTP + WebSockets vers MCP-Server-Agent_ts

## Scripts

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Variables Vercel

```bash
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_RAILWAY_BACKEND_URL=
RAILWAY_BACKEND_URL=
NEXT_PUBLIC_MCP_HTTP_URL=
NEXT_PUBLIC_MCP_WS_URL=
MCP_HTTP_URL=
```

`NEXT_PUBLIC_*` est expose au navigateur. Utiliser les variables serveur sans prefixe pour les appels proxy internes.

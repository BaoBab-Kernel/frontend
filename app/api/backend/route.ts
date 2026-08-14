import { NextResponse } from "next/server";

const BACKEND_URL = process.env.RAILWAY_BACKEND_URL || process.env.NEXT_PUBLIC_RAILWAY_BACKEND_URL;

function buildTargetUrl(request: Request) {
  if (!BACKEND_URL) {
    throw new Error("RAILWAY_BACKEND_URL is not configured");
  }

  const requestUrl = new URL(request.url);
  const path = requestUrl.searchParams.get("path") ?? "/";
  const target = new URL(path.replace(/^\//, ""), `${BACKEND_URL.replace(/\/$/, "")}/`);
  requestUrl.searchParams.forEach((value, key) => {
    if (key !== "path") {
      target.searchParams.set(key, value);
    }
  });
  return target;
}

async function proxy(request: Request) {
  try {
    const target = buildTargetUrl(request);
    const response = await fetch(target, {
      method: request.method,
      headers: {
        "content-type": request.headers.get("content-type") ?? "application/json"
      },
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
      cache: "no-store"
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Backend proxy failed" },
      { status: 502 }
    );
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };

// Deno tests for sync-ical authorization guard.
// Runs the handler in-process by importing it (via dynamic module eval).
// We only exercise the auth/rejection path — no network access is needed.

import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SECRET = "test-secret-abc";
Deno.env.set("SYNC_SECRET", SECRET);
Deno.env.set("SUPABASE_URL", "http://localhost");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "svc");
Deno.env.set("ICAL_BOOKING_URL", "http://localhost/ical");

// Capture the handler registered via Deno.serve
let handler: (req: Request) => Promise<Response> = () => {
  throw new Error("handler not registered");
};
const origServe = Deno.serve;
// deno-lint-ignore no-explicit-any
(Deno as any).serve = (h: any) => {
  handler = h;
  return { finished: Promise.resolve(), shutdown: () => {}, ref: () => {}, unref: () => {} } as any;
};
await import("./index.ts");
// deno-lint-ignore no-explicit-any
(Deno as any).serve = origServe;

function makeReq(init: RequestInit & { headers?: Record<string, string> } = {}) {
  return new Request("http://localhost/sync-ical", {
    method: init.method ?? "POST",
    headers: init.headers ?? {},
  });
}

Deno.test("rejects GET with 405", async () => {
  const res = await handler(makeReq({ method: "GET" }));
  await res.text();
  assertEquals(res.status, 405);
});

Deno.test("rejects missing x-sync-secret with 401", async () => {
  const res = await handler(makeReq({ headers: { "x-sync-timestamp": String(Date.now()) } }));
  await res.text();
  assertEquals(res.status, 401);
});

Deno.test("rejects wrong x-sync-secret with 401", async () => {
  const res = await handler(
    makeReq({
      headers: { "x-sync-secret": "wrong", "x-sync-timestamp": String(Date.now()) },
    }),
  );
  await res.text();
  assertEquals(res.status, 401);
});

Deno.test("rejects missing timestamp with 401", async () => {
  const res = await handler(makeReq({ headers: { "x-sync-secret": SECRET } }));
  await res.text();
  assertEquals(res.status, 401);
});

Deno.test("rejects stale timestamp with 401", async () => {
  const stale = String(Date.now() - 10 * 60 * 1000); // 10 min old
  const res = await handler(
    makeReq({ headers: { "x-sync-secret": SECRET, "x-sync-timestamp": stale } }),
  );
  await res.text();
  assertEquals(res.status, 401);
});

Deno.test("OPTIONS preflight allowed", async () => {
  const res = await handler(makeReq({ method: "OPTIONS" }));
  await res.text();
  assertEquals(res.status, 200);
});

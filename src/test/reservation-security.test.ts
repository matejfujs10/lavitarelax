import { describe, it, expect, vi, beforeEach } from "vitest";

const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: (...args: any[]) => sendMock(...args) },
  })),
}));

// Re-import handler fresh each test so in-memory rate-limit maps reset.
async function loadHandler() {
  vi.resetModules();
  const mod = await import("../../api/reservation");
  return mod.default;
}

function mockRes() {
  const res: any = {};
  res.status = vi.fn().mockImplementation((c: number) => {
    res._status = c;
    return res;
  });
  res.json = vi.fn().mockImplementation((b: any) => {
    res._body = b;
    return res;
  });
  return res;
}

function makeReq(body: any, ip = "1.2.3.4") {
  return {
    method: "POST",
    body,
    headers: { "x-forwarded-for": ip },
    socket: { remoteAddress: ip },
  } as any;
}

const validBody = {
  name: "Ana Novak",
  email: "ana@example.com",
  checkIn: "2026-07-10",
  checkOut: "2026-07-12",
  guests: "2",
  language: "sl",
};

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "x" }, error: null });
  process.env.RESEND_API_KEY = "re_test";
});

describe("/api/reservation – varnostne kontrole", () => {
  it("honeypot polje 'website' vrne 200 brez pošiljanja emailov", async () => {
    const handler = await loadHandler();
    const res = mockRes();
    await handler(makeReq({ ...validBody, website: "http://spam.example" }), res);
    expect(res._status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("honeypot polje 'company' vrne 200 brez pošiljanja emailov", async () => {
    const handler = await loadHandler();
    const res = mockRes();
    await handler(makeReq({ ...validBody, company: "spam-co", email: "b@ex.com" }), res);
    expect(res._status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("po 5 zaporednih klicih z istega IP vrne 429", async () => {
    const handler = await loadHandler();
    for (let i = 0; i < 5; i++) {
      const res = mockRes();
      await handler(makeReq({ ...validBody, email: `u${i}@ex.com` }, "9.9.9.9"), res);
      expect(res._status).toBe(200);
    }
    const res = mockRes();
    await handler(makeReq({ ...validBody, email: "u6@ex.com" }, "9.9.9.9"), res);
    expect(res._status).toBe(429);
  });

  it("po 3 zaporednih klicih z isto email vrne 429", async () => {
    const handler = await loadHandler();
    // Different IPs so IP limit doesn't trigger first
    for (let i = 0; i < 3; i++) {
      const res = mockRes();
      await handler(makeReq({ ...validBody, email: "same@ex.com" }, `10.0.0.${i}`), res);
      expect(res._status).toBe(200);
    }
    const res = mockRes();
    await handler(makeReq({ ...validBody, email: "same@ex.com" }, "10.0.0.99"), res);
    expect(res._status).toBe(429);
  });

  it("neveljaven email vrne 400", async () => {
    const handler = await loadHandler();
    const res = mockRes();
    await handler(makeReq({ ...validBody, email: "not-an-email" }), res);
    expect(res._status).toBe(400);
  });

  it("checkOut pred checkIn vrne 400", async () => {
    const handler = await loadHandler();
    const res = mockRes();
    await handler(
      makeReq({ ...validBody, checkIn: "2026-07-20", checkOut: "2026-07-10" }),
      res,
    );
    expect(res._status).toBe(400);
  });

  it("napačen datum format vrne 400", async () => {
    const handler = await loadHandler();
    const res = mockRes();
    await handler(makeReq({ ...validBody, checkIn: "10.07.2026" }), res);
    expect(res._status).toBe(400);
  });
});

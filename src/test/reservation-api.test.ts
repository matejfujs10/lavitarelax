import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Resend
const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: (...args: any[]) => sendMock(...args) },
  })),
}));

// Fresh handler per test so in-memory rate-limit maps reset.
async function loadHandler() {
  vi.resetModules();
  const mod = await import("../../api/reservation");
  return mod.default;
}

function mockRes() {
  const res: any = {};
  res.status = vi.fn().mockImplementation((c: number) => { res._status = c; return res; });
  res.json = vi.fn().mockImplementation((b: any) => { res._body = b; return res; });
  return res;
}

const basePayload = {
  name: "Janez Novak",
  email: "guest@example.com",
  checkIn: "2026-05-10",
  checkOut: "2026-05-12",
  guests: "2",
  message: "Test",
  priceTotal: 154,
  priceNights: 2,
  pricePerNight: 95,
};

describe("/api/reservation – pošiljanje emailov", () => {
  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: "x" }, error: null });
    process.env.RESEND_API_KEY = "re_test";
  });

  it("pošlje vse podatke lastniku na rent@lavitaterme3000.com", async () => {
    const req: any = { method: "POST", body: { ...basePayload, language: "sl" } };
    const res = mockRes();
    await handler(req, res);

    expect(res._status).toBe(200);
    expect(res._body.ok).toBe(true);

    // Vsaj 2 klica: lastnik + gost
    expect(sendMock).toHaveBeenCalledTimes(2);

    const ownerCall = sendMock.mock.calls[0][0];
    expect(ownerCall.to).toEqual(["rent@lavitaterme3000.com"]);
    expect(ownerCall.from).toContain("rent@lavitaterme3000.com");
    expect(ownerCall.subject).toContain("Janez Novak");
    expect(ownerCall.html).toContain("guest@example.com");
    expect(ownerCall.html).toContain("154");
    expect(ownerCall.html).toContain("95");
    expect(ownerCall.html).toContain("2026-05-10");
  });

  it("pošlje personalizirano zahvalo gostu v SL", async () => {
    const req: any = { method: "POST", body: { ...basePayload, language: "sl" } };
    const res = mockRes();
    await handler(req, res);

    const guestCall = sendMock.mock.calls[1][0];
    expect(guestCall.to).toEqual(["guest@example.com"]);
    expect(guestCall.subject).toMatch(/Zahvala/i);
    expect(guestCall.html).toContain("Pozdravljeni gospa/gospod Janez Novak");
    expect(guestCall.html).toMatch(/zahvaljujemo se vam za rezervacijo/);
    expect(guestCall.html).toMatch(/najbolj priljubljenih kampov v Sloveniji/);
  });

  it("pošlje zahvalo v EN, ko je jezik 'en'", async () => {
    const req: any = { method: "POST", body: { ...basePayload, language: "en", name: "John Smith" } };
    const res = mockRes();
    await handler(req, res);
    const guestCall = sendMock.mock.calls[1][0];
    expect(guestCall.subject).toMatch(/Thank you/i);
    expect(guestCall.html).toContain("Dear John Smith");
  });

  it("pošlje zahvalo v DE, ko je jezik 'de'", async () => {
    const req: any = { method: "POST", body: { ...basePayload, language: "de", name: "Hans Müller" } };
    const res = mockRes();
    await handler(req, res);
    const guestCall = sendMock.mock.calls[1][0];
    expect(guestCall.subject).toMatch(/Vielen Dank/i);
    expect(guestCall.html).toContain("Sehr geehrte/r Frau/Herr Hans M");
  });

  it("pošlje zahvalo v HR, ko je jezik 'hr'", async () => {
    const req: any = { method: "POST", body: { ...basePayload, language: "hr", name: "Ivan Horvat" } };
    const res = mockRes();
    await handler(req, res);
    const guestCall = sendMock.mock.calls[1][0];
    expect(guestCall.subject).toMatch(/Hvala/i);
    expect(guestCall.html).toContain("Poštovani gospođo/gospodine Ivan Horvat");
  });

  it("vrne 400, če manjkajo obvezna polja", async () => {
    const req: any = { method: "POST", body: { name: "X" } };
    const res = mockRes();
    await handler(req, res);
    expect(res._status).toBe(400);
  });
});

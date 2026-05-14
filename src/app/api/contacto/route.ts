import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { logError } from "@/lib/logError";

/**
 * POST /api/contacto
 *
 * Form de contacto público. Recibe {name, email, message} y reenvía
 * vía Resend al inbox `info@inneraxisinstitute.com`. Rate-limit in-memory
 * por IP (mismo patrón que /api/recover-access). No persiste el
 * mensaje en DB — Resend ya tiene su propia copia en su dashboard.
 *
 * 200 siempre (excepto rate limit / body inválido) para no leakar
 * tiempos de respuesta de Resend.
 */

export const dynamic = "force-dynamic";

const TO_ADDRESS = "info@inneraxisinstitute.com";
const FROM_DEFAULT = "Contacto <hola@laralawn.com>";

const WINDOW_MS = 60 * 60 * 1000; // 1h
const MAX_PER_WINDOW = 5;
const attempts = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimitHit(ip: string): boolean {
  const now = Date.now();
  const list = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    attempts.set(ip, list);
    return true;
  }
  list.push(now);
  attempts.set(ip, list);
  return false;
}

function validEmail(s: unknown): s is string {
  return (
    typeof s === "string" &&
    s.length <= 320 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = clientIp(req);

  if (rateLimitHit(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const b = body as { name?: unknown; email?: unknown; message?: unknown };
  const name = typeof b.name === "string" ? b.name.trim().slice(0, 200) : "";
  const message =
    typeof b.message === "string" ? b.message.trim().slice(0, 4000) : "";

  if (!validEmail(b.email)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (!name || !message) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const email = b.email.trim().toLowerCase();
  const userAgent = req.headers.get("user-agent")?.slice(0, 300) ?? null;

  const apiKey = (process.env["RESEND_API_KEY"] ?? "").trim();
  if (!apiKey) {
    // Sin Resend no podemos enviar, pero devolvemos 200 para no leakar
    // configuración. Loggeamos el mensaje al menos para no perderlo.
    console.warn("[contacto] RESEND_API_KEY missing — message lost", {
      email,
      name,
      message: message.slice(0, 100),
    });
    return NextResponse.json(
      { ok: true },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }

  const resend = new Resend(apiKey);
  const from =
    (process.env["RESEND_FROM"] ?? "").trim() || FROM_DEFAULT;

  try {
    await resend.emails.send({
      from,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `[Contacto web] ${name}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 560px;">
          <h2 style="margin: 0 0 12px;">Nuevo mensaje desde /contacto</h2>
          <p style="margin: 0 0 4px;"><strong>Nombre:</strong> ${escapeHtml(name)}</p>
          <p style="margin: 0 0 4px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
          <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(message)}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
          <p style="color: #666; font-size: 12px;">User-Agent: ${escapeHtml(userAgent ?? "—")}</p>
        </div>
      `,
      text: `Nombre: ${name}\nEmail: ${email}\n\n${message}\n\n— User-Agent: ${userAgent ?? "—"}`,
    });
  } catch (err) {
    await logError({
      source: "contacto",
      error: err,
      path: "/api/contacto",
      userAgent,
      ip,
      meta: { email, name },
    });
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { ok: true },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}

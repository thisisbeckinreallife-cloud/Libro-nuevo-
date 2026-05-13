/**
 * Crea un Purchase de demo en la DB y envía el email post-compra
 * REAL. Útil para que el dueño viva la experiencia del comprador antes
 * de tener Stripe activado en live.
 *
 * Ejecutar con:
 *   railway run npx tsx scripts/seed-demo-purchase.ts
 *
 * Se conecta a la DB de producción y a Resend usando las env vars de
 * Railway. NO crea cargo en Stripe — es 100% local.
 *
 * Idempotente: si ya existe un Purchase con el mismo stripeSessionId
 * de demo, reutiliza el accessToken.
 */

import crypto from "node:crypto";
import { prisma } from "../src/lib/prisma";
import { sendPurchaseEmail } from "../src/lib/emails/purchase-email";

const DEMO_EMAIL = "munteaneric4@gmail.com";
const DEMO_NAME = "Eric";
const DEMO_SESSION_ID = "demo-session-" + crypto.randomBytes(6).toString("hex");

async function main() {
  console.log("\n═══ Seed demo purchase ═══\n");

  // Buscar Purchase existente para el email (paid) — reutilizar si existe.
  const existing = await prisma.purchase.findFirst({
    where: { email: DEMO_EMAIL, status: "paid" },
    orderBy: { paidAt: "desc" },
  });

  let purchase;
  if (existing) {
    console.log("→ Reutilizando Purchase existente:");
    console.log(`  id: ${existing.id}`);
    console.log(`  accessToken: ${existing.accessToken}`);
    purchase = existing;
  } else {
    const accessToken = crypto.randomUUID();
    purchase = await prisma.purchase.create({
      data: {
        email: DEMO_EMAIL,
        name: DEMO_NAME,
        stripeSessionId: DEMO_SESSION_ID,
        stripePaymentIntentId: null,
        amount: 1200,
        currency: "eur",
        status: "paid",
        accessToken,
        lang: "es",
        paidAt: new Date(),
        meta: { demo: true, source: "seed-demo-purchase" },
      },
    });
    console.log("→ Purchase creado:");
    console.log(`  id: ${purchase.id}`);
    console.log(`  accessToken: ${purchase.accessToken}`);
  }

  console.log("\n→ Enviando email post-compra real...");
  const ok = await sendPurchaseEmail({
    id: purchase.id,
    email: purchase.email,
    name: purchase.name,
    accessToken: purchase.accessToken,
    lang: purchase.lang,
  });

  if (ok) {
    console.log("  ✓ email enviado");
  } else {
    console.log("  ✗ email no enviado (revisa RESEND_API_KEY)");
  }

  const siteUrl =
    (process.env["NEXT_PUBLIC_SITE_URL"] ?? "").trim() ||
    "https://arkwright.laralawn.com";
  const url = `${siteUrl}/biblioteca?token=${encodeURIComponent(purchase.accessToken)}`;

  console.log("\n═══ Acceso a la biblioteca ═══");
  console.log(`  ${url}`);
  console.log();

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("✗ Falló:", err);
  await prisma.$disconnect();
  process.exit(1);
});

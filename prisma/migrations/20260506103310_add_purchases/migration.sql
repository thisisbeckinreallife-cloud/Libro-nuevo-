-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('pending', 'paid', 'refunded', 'failed');

-- CreateTable
CREATE TABLE "purchases" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "stripe_session_id" TEXT NOT NULL,
    "stripe_payment_intent_id" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "status" "PurchaseStatus" NOT NULL DEFAULT 'pending',
    "access_token" TEXT NOT NULL,
    "ebook_downloads" INTEGER NOT NULL DEFAULT 0,
    "audio_downloads" INTEGER NOT NULL DEFAULT 0,
    "lang" TEXT NOT NULL DEFAULT 'es',
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid_at" TIMESTAMP(3),
    "refunded_at" TIMESTAMP(3),

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "purchases_stripe_session_id_key" ON "purchases"("stripe_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_stripe_payment_intent_id_key" ON "purchases"("stripe_payment_intent_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_access_token_key" ON "purchases"("access_token");

-- CreateIndex
CREATE INDEX "purchases_email_idx" ON "purchases"("email");

-- CreateIndex
CREATE INDEX "purchases_status_created_at_idx" ON "purchases"("status", "created_at");

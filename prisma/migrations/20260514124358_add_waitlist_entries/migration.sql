-- CreateTable
CREATE TABLE "waitlist_entries" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'es',
    "source" TEXT,
    "ip_hash" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waitlist_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_entries_email_tier_key" ON "waitlist_entries"("email", "tier");

-- CreateIndex
CREATE INDEX "waitlist_entries_tier_created_at_idx" ON "waitlist_entries"("tier", "created_at");

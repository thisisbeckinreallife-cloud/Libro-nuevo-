-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "first_source" TEXT NOT NULL,
    "last_source" TEXT NOT NULL,
    "sources" TEXT NOT NULL DEFAULT '',
    "lang" TEXT NOT NULL DEFAULT 'es',
    "consent_marketing" BOOLEAN NOT NULL DEFAULT true,
    "meta" JSONB,
    "first_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contacts_email_key" ON "contacts"("email");

-- CreateIndex
CREATE INDEX "contacts_first_seen_at_idx" ON "contacts"("first_seen_at");

-- CreateIndex
CREATE INDEX "contacts_last_source_idx" ON "contacts"("last_source");

-- CreateIndex
CREATE INDEX "contacts_lang_idx" ON "contacts"("lang");

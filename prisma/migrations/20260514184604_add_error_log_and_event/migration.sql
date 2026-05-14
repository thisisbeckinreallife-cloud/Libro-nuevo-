-- CreateTable
CREATE TABLE "error_logs" (
    "id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "path" TEXT,
    "user_agent" TEXT,
    "ip_hash" TEXT,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "error_logs_created_at_idx" ON "error_logs"("created_at");

-- CreateIndex
CREATE INDEX "error_logs_source_created_at_idx" ON "error_logs"("source", "created_at");

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "path" TEXT,
    "session_id" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "referrer_host" TEXT,
    "ab_variant" TEXT,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_kind_created_at_idx" ON "events"("kind", "created_at");

-- CreateIndex
CREATE INDEX "events_session_id_idx" ON "events"("session_id");

-- CreateIndex
CREATE INDEX "events_created_at_idx" ON "events"("created_at");

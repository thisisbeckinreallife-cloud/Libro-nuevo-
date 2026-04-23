-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('submitted', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "review_submissions" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'submitted',
    "screenshot" BYTEA NOT NULL,
    "content_type" TEXT NOT NULL,
    "screenshot_hash" TEXT NOT NULL,
    "ip_hash" TEXT NOT NULL,
    "user_agent" TEXT,
    "claim_token" TEXT NOT NULL,
    "ebook_downloads" INTEGER NOT NULL DEFAULT 0,
    "audio_downloads" INTEGER NOT NULL DEFAULT 0,
    "claimed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "review_submissions_claim_token_key" ON "review_submissions"("claim_token");

-- CreateIndex
CREATE INDEX "review_submissions_created_at_idx" ON "review_submissions"("created_at");

-- CreateIndex
CREATE INDEX "review_submissions_ip_hash_created_at_idx" ON "review_submissions"("ip_hash", "created_at");

-- CreateIndex
CREATE INDEX "review_submissions_screenshot_hash_idx" ON "review_submissions"("screenshot_hash");

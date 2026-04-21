-- CreateEnum
CREATE TYPE "BonusTokenStatus" AS ENUM ('unissued', 'claimed', 'revoked');

-- CreateTable
CREATE TABLE "bonus_tokens" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "status" "BonusTokenStatus" NOT NULL DEFAULT 'unissued',
    "book_lot" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimed_at" TIMESTAMP(3),

    CONSTRAINT "bonus_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "counter_cache" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "claimed_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "counter_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bonus_tokens_token_key" ON "bonus_tokens"("token");

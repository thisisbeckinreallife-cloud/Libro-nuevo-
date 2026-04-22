-- CreateTable
CREATE TABLE "workbook_entries" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "section" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workbook_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workbook_entries_user_id_section_idx" ON "workbook_entries"("user_id", "section");

-- CreateIndex
CREATE UNIQUE INDEX "workbook_entries_user_id_section_field_id_key" ON "workbook_entries"("user_id", "section", "field_id");

-- AddForeignKey
ALTER TABLE "workbook_entries" ADD CONSTRAINT "workbook_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

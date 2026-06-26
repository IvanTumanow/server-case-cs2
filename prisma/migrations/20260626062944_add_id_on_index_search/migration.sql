-- DropIndex
DROP INDEX "users_email_idx";

-- CreateIndex
CREATE INDEX "users_email_id_idx" ON "users"("email", "id");

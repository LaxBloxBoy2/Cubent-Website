/*
  Warnings:

  - Added the required column `userId` to the `PendingLogin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendingLogin" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UsageAnalytics" ADD COLUMN     "cubentUnitsUsed" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UsageMetrics" ADD COLUMN     "cubentUnitsUsed" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cubentUnitsLimit" DOUBLE PRECISION NOT NULL DEFAULT 50,
ADD COLUMN     "cubentUnitsUsed" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "sessionToken" TEXT,
ADD COLUMN     "unitsResetDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "PendingLogin_token_idx" ON "PendingLogin"("token");

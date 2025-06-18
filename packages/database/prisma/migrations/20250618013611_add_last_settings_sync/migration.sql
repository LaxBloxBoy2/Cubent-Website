/*
  Warnings:

  - You are about to drop the column `lastSeen` on the `ExtensionSession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,sessionId]` on the table `ExtensionSession` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ExtensionSession_sessionId_key";

-- AlterTable
ALTER TABLE "ExtensionSession" DROP COLUMN "lastSeen",
ADD COLUMN     "extensionVersion" TEXT,
ADD COLUMN     "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "platform" TEXT,
ADD COLUMN     "requestsMade" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "vscodeVersion" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "extensionEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastActiveAt" TIMESTAMP(3),
ADD COLUMN     "lastSettingsSync" TIMESTAMP(3),
ALTER COLUMN "subscriptionTier" SET DEFAULT 'FREE',
ALTER COLUMN "subscriptionStatus" SET DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "UsageAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "requestsMade" INTEGER NOT NULL DEFAULT 0,
    "costAccrued" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sessionId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "keyHash" TEXT NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'FREE',
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "extensionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsageAnalytics_userId_idx" ON "UsageAnalytics"("userId");

-- CreateIndex
CREATE INDEX "UsageAnalytics_modelId_idx" ON "UsageAnalytics"("modelId");

-- CreateIndex
CREATE INDEX "UsageAnalytics_createdAt_idx" ON "UsageAnalytics"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_keyHash_key" ON "ApiKey"("keyHash");

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");

-- CreateIndex
CREATE INDEX "ApiKey_isActive_idx" ON "ApiKey"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "UserProfile_userId_idx" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "ExtensionSession_isActive_idx" ON "ExtensionSession"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ExtensionSession_userId_sessionId_key" ON "ExtensionSession"("userId", "sessionId");

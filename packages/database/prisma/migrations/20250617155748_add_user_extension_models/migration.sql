-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "picture" TEXT,
    "extensionApiKey" TEXT,
    "lastExtensionSync" TIMESTAMP(3),
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "termsAcceptedAt" TIMESTAMP(3),
    "subscriptionTier" TEXT NOT NULL DEFAULT 'FREE_TRIAL',
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'TRIAL',
    "extensionSettings" JSONB,
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtensionSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExtensionSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageMetrics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "requestsMade" INTEGER NOT NULL DEFAULT 0,
    "costAccrued" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ExtensionSession_sessionId_key" ON "ExtensionSession"("sessionId");

-- CreateIndex
CREATE INDEX "ExtensionSession_userId_idx" ON "ExtensionSession"("userId");

-- CreateIndex
CREATE INDEX "UsageMetrics_userId_idx" ON "UsageMetrics"("userId");

-- CreateIndex
CREATE INDEX "UsageMetrics_date_idx" ON "UsageMetrics"("date");

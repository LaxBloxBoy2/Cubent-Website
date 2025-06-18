-- CreateTable
CREATE TABLE "PendingLogin" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingLogin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PendingLogin_deviceId_idx" ON "PendingLogin"("deviceId");

-- CreateIndex
CREATE INDEX "PendingLogin_state_idx" ON "PendingLogin"("state");

-- CreateIndex
CREATE INDEX "PendingLogin_expiresAt_idx" ON "PendingLogin"("expiresAt");

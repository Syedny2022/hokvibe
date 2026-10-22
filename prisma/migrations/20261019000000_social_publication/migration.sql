CREATE TABLE "SocialPublication" (
  "id" TEXT NOT NULL,
  "requestKey" TEXT NOT NULL,
  "creationId" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "postUrl" TEXT,
  "error" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SocialPublication_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SocialPublication_requestKey_key" ON "SocialPublication"("requestKey");
CREATE INDEX "SocialPublication_creationId_platform_idx" ON "SocialPublication"("creationId", "platform");
ALTER TABLE "SocialPublication" ADD CONSTRAINT "SocialPublication_creationId_fkey"
  FOREIGN KEY ("creationId") REFERENCES "SocialPostCreation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

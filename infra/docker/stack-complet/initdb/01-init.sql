-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EnrichissementStatut" AS ENUM ('IDLE', 'IN_PROGRESS', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "CycleStatut" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'TERMINE', 'ECHEC');

-- CreateEnum
CREATE TYPE "MouvementStatut" AS ENUM ('NEW', 'VIEWED', 'SAVED', 'IGNORED');

-- CreateEnum
CREATE TYPE "Axe" AS ENUM ('RH', 'STRATEGIE', 'TECH', 'DIGITAL', 'REGLEMENTAIRE');

-- CreateEnum
CREATE TYPE "SignalIntensite" AS ENUM ('STRONG', 'MEDIUM', 'WEAK');

-- CreateEnum
CREATE TYPE "SignalHorizon" AS ENUM ('SHORT', 'MEDIUM', 'LONG');

-- CreateEnum
CREATE TYPE "DigestFrequency" AS ENUM ('DAILY', 'WEEKLY', 'NEVER');

-- CreateEnum
CREATE TYPE "StatutRapport" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'TERMINE', 'ECHEC');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilUtilisateur" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nomEntreprise" TEXT NOT NULL,
    "siteWeb" TEXT,
    "secteur" TEXT,
    "description" TEXT,
    "produits" TEXT[],
    "marches" TEXT[],
    "positionnement" TEXT,
    "axes" TEXT[],
    "onboardingCompleteLe" TIMESTAMP(3),
    "enrichissement" JSONB,
    "enrichissementLe" TIMESTAMP(3),
    "enrichissementVer" TEXT,
    "enrichissementStatut" "EnrichissementStatut" NOT NULL DEFAULT 'IDLE',
    "enrichissementErreur" TEXT,
    "enrichissementStartedAt" TIMESTAMP(3),
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "majLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfilUtilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concurrent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "siteWeb" TEXT,
    "notes" TEXT,
    "secteur" TEXT,
    "taille" TEXT,
    "ville" TEXT,
    "fondeeEn" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Concurrent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VeilleCycle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "statut" "CycleStatut" NOT NULL DEFAULT 'EN_ATTENTE',
    "etapeCourante" TEXT,
    "etapeNumero" INTEGER,
    "progressionPct" INTEGER NOT NULL DEFAULT 0,
    "erreur" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "VeilleCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mouvement" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "concurrentId" TEXT NOT NULL,
    "axe" "Axe" NOT NULL,
    "titre" TEXT NOT NULL,
    "extrait" TEXT NOT NULL,
    "craapScore" DOUBLE PRECISION NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "critique" BOOLEAN NOT NULL DEFAULT false,
    "statut" "MouvementStatut" NOT NULL DEFAULT 'NEW',
    "viewedAt" TIMESTAMP(3),
    "savedAt" TIMESTAMP(3),
    "ignoredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mouvement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MouvementSource" (
    "id" TEXT NOT NULL,
    "mouvementId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "titre" TEXT,
    "extrait" TEXT,
    "publieeLe" TIMESTAMP(3),
    "craapCurrency" INTEGER NOT NULL,
    "craapRelevance" INTEGER NOT NULL,
    "craapAuthority" INTEGER NOT NULL,
    "craapAccuracy" INTEGER NOT NULL,
    "craapPurpose" INTEGER NOT NULL,
    "craapTotal" DOUBLE PRECISION NOT NULL,
    "collecteeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MouvementSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwotSnapshot" (
    "id" TEXT NOT NULL,
    "concurrentId" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "opportunities" TEXT[],
    "threats" TEXT[],

    CONSTRAINT "SwotSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeakSignal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "intitule" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "intensite" "SignalIntensite" NOT NULL,
    "horizon" "SignalHorizon" NOT NULL,
    "concurrentNoms" TEXT[],
    "sourceCount" INTEGER NOT NULL DEFAULT 0,
    "axesImpliques" TEXT[],
    "detecteLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireLe" TIMESTAMP(3),

    CONSTRAINT "WeakSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "digestFrequency" "DigestFrequency" NOT NULL DEFAULT 'DAILY',
    "emailDigest" TEXT NOT NULL,
    "criticalAlertsOnly" BOOLEAN NOT NULL DEFAULT true,
    "configuredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rapport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "concurrentId" TEXT NOT NULL,
    "statut" "StatutRapport" NOT NULL DEFAULT 'EN_ATTENTE',
    "progressionPct" INTEGER NOT NULL DEFAULT 0,
    "etape" TEXT,
    "erreur" TEXT,
    "synthese" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "termineLe" TIMESTAMP(3),

    CONSTRAINT "Rapport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "rapportId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "titre" TEXT,
    "extrait" TEXT,
    "publieeLe" TIMESTAMP(3),
    "craapCurrency" INTEGER,
    "craapRelevance" INTEGER,
    "craapAuthority" INTEGER,
    "craapAccuracy" INTEGER,
    "craapPurpose" INTEGER,
    "craapTotal" INTEGER,
    "collecteeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Swot" (
    "id" TEXT NOT NULL,
    "rapportId" TEXT NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "opportunities" TEXT[],
    "threats" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Swot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pestel" (
    "id" TEXT NOT NULL,
    "rapportId" TEXT NOT NULL,
    "political" TEXT[],
    "economic" TEXT[],
    "social" TEXT[],
    "technological" TEXT[],
    "environmental" TEXT[],
    "legal" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pestel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalFaible" (
    "id" TEXT NOT NULL,
    "rapportId" TEXT NOT NULL,
    "intitule" TEXT NOT NULL,
    "description" TEXT,
    "scorePertinence" INTEGER,
    "detecteLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignalFaible_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilUtilisateur_userId_key" ON "ProfilUtilisateur"("userId");

-- CreateIndex
CREATE INDEX "Concurrent_userId_idx" ON "Concurrent"("userId");

-- CreateIndex
CREATE INDEX "VeilleCycle_userId_startedAt_idx" ON "VeilleCycle"("userId", "startedAt" DESC);

-- CreateIndex
CREATE INDEX "Mouvement_cycleId_axe_idx" ON "Mouvement"("cycleId", "axe");

-- CreateIndex
CREATE INDEX "Mouvement_concurrentId_createdAt_idx" ON "Mouvement"("concurrentId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "MouvementSource_mouvementId_idx" ON "MouvementSource"("mouvementId");

-- CreateIndex
CREATE INDEX "SwotSnapshot_concurrentId_snapshotDate_idx" ON "SwotSnapshot"("concurrentId", "snapshotDate" DESC);

-- CreateIndex
CREATE INDEX "WeakSignal_userId_detecteLe_idx" ON "WeakSignal"("userId", "detecteLe" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "Rapport_userId_createdAt_idx" ON "Rapport"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Rapport_concurrentId_createdAt_idx" ON "Rapport"("concurrentId", "createdAt");

-- CreateIndex
CREATE INDEX "Source_rapportId_idx" ON "Source"("rapportId");

-- CreateIndex
CREATE UNIQUE INDEX "Swot_rapportId_key" ON "Swot"("rapportId");

-- CreateIndex
CREATE UNIQUE INDEX "Pestel_rapportId_key" ON "Pestel"("rapportId");

-- CreateIndex
CREATE INDEX "SignalFaible_rapportId_idx" ON "SignalFaible"("rapportId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilUtilisateur" ADD CONSTRAINT "ProfilUtilisateur_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concurrent" ADD CONSTRAINT "Concurrent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VeilleCycle" ADD CONSTRAINT "VeilleCycle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mouvement" ADD CONSTRAINT "Mouvement_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "VeilleCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mouvement" ADD CONSTRAINT "Mouvement_concurrentId_fkey" FOREIGN KEY ("concurrentId") REFERENCES "Concurrent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MouvementSource" ADD CONSTRAINT "MouvementSource_mouvementId_fkey" FOREIGN KEY ("mouvementId") REFERENCES "Mouvement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwotSnapshot" ADD CONSTRAINT "SwotSnapshot_concurrentId_fkey" FOREIGN KEY ("concurrentId") REFERENCES "Concurrent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwotSnapshot" ADD CONSTRAINT "SwotSnapshot_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "VeilleCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeakSignal" ADD CONSTRAINT "WeakSignal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rapport" ADD CONSTRAINT "Rapport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rapport" ADD CONSTRAINT "Rapport_concurrentId_fkey" FOREIGN KEY ("concurrentId") REFERENCES "Concurrent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_rapportId_fkey" FOREIGN KEY ("rapportId") REFERENCES "Rapport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swot" ADD CONSTRAINT "Swot_rapportId_fkey" FOREIGN KEY ("rapportId") REFERENCES "Rapport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pestel" ADD CONSTRAINT "Pestel_rapportId_fkey" FOREIGN KEY ("rapportId") REFERENCES "Rapport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignalFaible" ADD CONSTRAINT "SignalFaible_rapportId_fkey" FOREIGN KEY ("rapportId") REFERENCES "Rapport"("id") ON DELETE CASCADE ON UPDATE CASCADE;


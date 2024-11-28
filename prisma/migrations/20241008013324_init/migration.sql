-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userPreferenceId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "role" JSONB,
    "skills" JSONB,
    "avatar" TEXT,
    "company" TEXT,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hackathon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rules" TEXT,
    "tagline" TEXT,
    "managerEmail" TEXT,
    "location" TEXT,
    "timeZone" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,
    "prizes" JSONB,
    "judges" TEXT,
    "requirements" TEXT,
    "about" TEXT,
    "partners" TEXT,
    "resources" TEXT,
    "launched" BOOLEAN NOT NULL DEFAULT false,
    "company" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Hackathon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "pitch" TEXT,
    "story" TEXT,
    "techStack" JSONB,
    "videoUrl" TEXT,
    "repositoryUrl" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "creatorId" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isViewed" BOOLEAN NOT NULL DEFAULT false,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "contentId" TEXT NOT NULL,
    "contentName" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "receiverEmail" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HackathonParticipant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectParticipant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_userPreferenceId_key" ON "User"("userPreferenceId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Hackathon_creatorId_idx" ON "Hackathon"("creatorId");

-- CreateIndex
CREATE INDEX "Project_creatorId_idx" ON "Project"("creatorId");

-- CreateIndex
CREATE INDEX "Project_hackathonId_idx" ON "Project"("hackathonId");

-- CreateIndex
CREATE INDEX "Notification_senderId_idx" ON "Notification"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "_HackathonParticipant_AB_unique" ON "_HackathonParticipant"("A", "B");

-- CreateIndex
CREATE INDEX "_HackathonParticipant_B_index" ON "_HackathonParticipant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectParticipant_AB_unique" ON "_ProjectParticipant"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectParticipant_B_index" ON "_ProjectParticipant"("B");

-- CreateTable
CREATE TABLE "Fishy" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "totalFish" INTEGER DEFAULT 0,
    "totalFishGifted" INTEGER NOT NULL DEFAULT 0,
    "timesFished" INTEGER,
    "biggestFish" INTEGER DEFAULT 0,
    "totalTrash" INTEGER NOT NULL DEFAULT 0,
    "totalCommon" INTEGER NOT NULL DEFAULT 0,
    "totalUncommon" INTEGER NOT NULL DEFAULT 0,
    "totalRare" INTEGER NOT NULL DEFAULT 0,
    "totalLegendary" INTEGER NOT NULL DEFAULT 0,
    "lastFish" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "authentication" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blacklist" (
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Fishy.userId_unique" ON "Fishy"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Auth.guildId_unique" ON "Auth"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Blacklist.userId_unique" ON "Blacklist"("userId");

-- CreateTable
CREATE TABLE "HomeButton" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "targetType" TEXT NOT NULL,
    "chapterId" INTEGER,
    "route" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HomeButton_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "CourseChapter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "HomeButton_chapterId_idx" ON "HomeButton"("chapterId");

-- Backfill: seed the existing "Programmable Logic Controller" home button so upgraded installs keep it
INSERT INTO "HomeButton" ("label", "orderNumber", "targetType", "chapterId", "route", "isActive", "createdAt", "updatedAt")
VALUES ('PROGRAMMABLE LOGIC CONTROLLER', 1, 'ROUTE', NULL, '/student/plc-intro', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

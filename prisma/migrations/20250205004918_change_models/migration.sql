/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Uploads` table. All the data in the column will be lost.
  - You are about to drop the column `fileURL` on the `Uploads` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Uploads` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Uploads` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Uploads` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Uploads` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Uploads" DROP COLUMN "createdAt",
DROP COLUMN "fileURL",
DROP COLUMN "size",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "content" JSONB,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Uploads_id_seq";

-- CreateTable
CREATE TABLE "Files" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "size" INTEGER NOT NULL,
    "fileURL" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "foldersId" INTEGER,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Folders" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "parentFolder" INTEGER,

    CONSTRAINT "Folders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Uploads_id_key" ON "Uploads"("id");

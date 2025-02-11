/*
  Warnings:

  - Added the required column `size` to the `Uploads` table without a default value. This is not possible if the table is not empty.
  - Made the column `fileURL` on table `Uploads` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Uploads" ADD COLUMN     "size" INTEGER NOT NULL,
ALTER COLUMN "fileURL" SET NOT NULL;

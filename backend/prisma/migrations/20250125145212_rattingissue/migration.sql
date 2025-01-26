/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Rating` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

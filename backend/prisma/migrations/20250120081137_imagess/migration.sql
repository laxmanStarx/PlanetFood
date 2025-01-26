/*
  Warnings:

  - Made the column `image` on table `Menu` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "image" SET NOT NULL;

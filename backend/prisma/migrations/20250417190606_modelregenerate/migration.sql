/*
  Warnings:

  - Changed the type of `products` on the `Recommendation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Recommendation" DROP COLUMN "products",
ADD COLUMN     "products" JSONB NOT NULL;

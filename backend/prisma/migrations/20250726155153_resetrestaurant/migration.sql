/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "restaurantId";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "restaurantId";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "restaurantId";

/*
  Warnings:

  - You are about to drop the column `toOutput` on the `Connection` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fromNodeId,toNodeId,fromOutput,toInput]` on the table `Connection` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NodeType" ADD VALUE 'MANUAL_TRIGGER';
ALTER TYPE "NodeType" ADD VALUE 'HTTP_REQUEST';

-- DropIndex
DROP INDEX "public"."Connection_fromNodeId_toNodeId_fromOutput_toOutput_key";

-- AlterTable
ALTER TABLE "Connection" DROP COLUMN "toOutput",
ADD COLUMN     "toInput" TEXT NOT NULL DEFAULT 'main';

-- CreateIndex
CREATE UNIQUE INDEX "Connection_fromNodeId_toNodeId_fromOutput_toInput_key" ON "Connection"("fromNodeId", "toNodeId", "fromOutput", "toInput");

/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "appRole" TEXT DEFAULT 'STUDENT',
ALTER COLUMN "updatedAt" DROP DEFAULT,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT;

-- DropEnum
DROP TYPE "public"."Role";

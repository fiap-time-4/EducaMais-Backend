/*
  Warnings:

  - You are about to drop the column `autor` on the `posts` table. All the data in the column will be lost.
  - Added the required column `autorId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."posts" DROP COLUMN "autor",
ADD COLUMN     "autorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

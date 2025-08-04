/*
  Warnings:

  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."session" DROP CONSTRAINT "session_user_id_fkey";

-- DropTable
DROP TABLE "public"."session";

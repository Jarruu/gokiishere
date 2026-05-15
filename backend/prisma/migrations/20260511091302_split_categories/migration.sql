/*
  Warnings:

  - The values [WEB_APP_DEV] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('WEB', 'APP', 'MACHINE_LEARNING', 'VERILOG_FSM', 'ARDUINO_IOT', 'ALGORITHM_FLOWCHART', 'OTHERS');
ALTER TABLE "Project" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
COMMIT;

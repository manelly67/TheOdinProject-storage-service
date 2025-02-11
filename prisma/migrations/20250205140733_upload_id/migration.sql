-- DropIndex
DROP INDEX "Uploads_id_key";

-- AlterTable
CREATE SEQUENCE uploads_id_seq;
ALTER TABLE "Uploads" ALTER COLUMN "id" SET DEFAULT nextval('uploads_id_seq');
ALTER SEQUENCE uploads_id_seq OWNED BY "Uploads"."id";

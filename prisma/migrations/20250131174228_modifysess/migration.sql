-- AlterTable
CREATE SEQUENCE session_id_seq;
ALTER TABLE "Session" ALTER COLUMN "id" SET DEFAULT nextval('session_id_seq');
ALTER SEQUENCE session_id_seq OWNED BY "Session"."id";

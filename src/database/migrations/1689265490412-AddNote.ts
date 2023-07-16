import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNote1689265490412 implements MigrationInterface {
  name = 'AddNote1689265490412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE "public"."note_status_enum" AS ENUM(\'active\', \'inactive\', \'expired\')');
    await queryRunner.query('CREATE TABLE "note" ("id" SERIAL NOT NULL, "title" character varying(250) NOT NULL, "description" character varying(5000), "status" "public"."note_status_enum" NOT NULL, "text" character varying(50000) NOT NULL, "expirationDate" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "note"');
    await queryRunner.query('DROP TYPE "public"."note_status_enum"');
  }
}

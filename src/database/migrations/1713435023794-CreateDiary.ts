import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDiary1713435023794 implements MigrationInterface {
  name = 'CreateDiary1713435023794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "diary" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "imageLinks" text array NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_7422c55a0908c4271ff1918437d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "diary" ADD CONSTRAINT "FK_bda48d3f2d272ca20f3aa612e5c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "diary" DROP CONSTRAINT "FK_bda48d3f2d272ca20f3aa612e5c"`,
    );
    await queryRunner.query(`DROP TABLE "diary"`);
  }
}

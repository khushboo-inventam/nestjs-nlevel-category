import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class UserSession1695986151835 implements MigrationInterface {
    private table = new Table({
        name: 'user_sessions',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            isNullable: false,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'integer',
          },
          {
            name: 'access_token',
            type: 'varchar',
          },
          {
            name: 'refresh_token',
            type: 'varchar',
          },
          {
            name: 'user_agent',
            type: 'varchar',
          },
          {
            name: 'is_expired',
            type: 'boolean',
            default: true,
          },
          {
            name: 'is_deleted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'varchar',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'varchar',
            isNullable: true,
          },
        ],
      });
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.table);
    }

}

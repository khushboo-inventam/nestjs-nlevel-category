import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class User1695986071058 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'users',
              columns: [
                {
                  name: 'user_id',
                  type: 'integer',
                  isPrimary: true,
                  isNullable: false,
                  isGenerated: true,
                  generationStrategy: 'increment',
                },
                {
                  name: 'email',
                  type: 'varchar',
                  length: '255',
                  isNullable: false,
                },
                {
                  name: 'password',
                  type: 'varchar',
                  length: '255',
                  isNullable: false,
                },
                {
                  name: 'full_name',
                  type: 'varchar',
                  length: '255',
                  isNullable: true,
                },
                {
                  name: 'mobile_no',
                  type: 'varchar',
                  length: '255',
                  isNullable: true,
                },
                {
                  name: 'forgot_password_token',
                  type: 'varchar',
                  length: '255',
                  isNullable: true,
                },
                {
                  name: 'password_token_time',
                  type: 'varchar',
                  length: '255',
                  isNullable: true,
                },
                {
                  name: 'email_verified',
                  type: 'boolean',
                  isNullable: true,
                },
                {
                  name: 'email_verification_token',
                  type: 'varchar',
                  length: '255',
                  isNullable: true,
                },
                {
                  name: 'email_token_time',
                  type: 'varchar',
                  length: '255',
                  isNullable: true,
                },
                {
                  name: 'is_deleted',
                  type: 'boolean',
                  default: false,
                },
                {
                  name: 'created_at',
                  type: 'varchar',
                  length: '255',
                  isNullable: true,
                },
                {
                  name: 'updated_at',
                  type: 'varchar',
                  length: '255',
                  isNullable: true,
                },
                {
                  name: 'deleted_at',
                  type: 'varchar',
                  length: '255',
                  isNullable: true,
                },
                {
                  name: 'user_agent',
                  type: 'varchar',
                  length: '255',
                  isNullable: true,
                },
              ],
            }),
            true,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users', true);
    }

}

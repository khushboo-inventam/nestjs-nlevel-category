import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class History1687169159537 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "history",
                columns: [
                    {
                        name: "id",
                        type: "integer",
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "user_id",
                        type: "integer",
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: "module",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "action",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "before",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "after",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "action_at",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "updated_at",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "deleted_at",
                        type: "varchar",
                        isNullable: true,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("history", true);
    }

}

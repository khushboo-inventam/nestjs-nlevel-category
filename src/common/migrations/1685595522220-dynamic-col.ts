import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class DynamicCol1685595522220 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "dynamic_column",
                columns: [
                    {
                        name: "dynamic_id",
                        type: "integer",
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "type",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                     

                    {
                        name: "is_deleted",
                        type: "boolean",
                        default: false,
                        isNullable: true,
                    },
                    {
                        name: "created_by",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "updated_by",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "deleted_by",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },

                    {
                        name: "created_at",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },

                    {
                        name: "updated_at",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },

                    {
                        name: "deleted_at",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("dynamic_column", true);
    }

}

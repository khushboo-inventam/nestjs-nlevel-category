import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Price1692946455339 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "price",
                columns: [
                    {
                        name: "price_id",
                        type: "integer",
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "stripe_price_id",
                        type: "varchar",
                        default: 255,
                        isNullable: true,
                    },
                    {
                        name: "plan_id",
                        type: "integer",
                        isNullable: false,
                    },
                    {
                        name: "stripe_plan_id",
                        type: "varchar",
                        default: 255,
                        isNullable: true,
                    },
                    {
                        name: "currency",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "unit_amount",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "interval",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "interval_count",
                        type: "integer",
                        isNullable: false,
                    },
                    {
                        name: "active",
                        type: "boolean",
                        default: true,
                        isNullable: true,
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

        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("price", true);
    }

}

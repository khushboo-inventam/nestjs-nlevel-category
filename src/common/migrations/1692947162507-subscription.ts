import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Subscription1692947162507 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "subscription",
                columns: [
                    {
                        name: "subscription_id",
                        type: "integer",
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: "increment"

                    },
                    {
                        name: "stripe_subscription_id",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "plan_id",
                        type: "integer",
                        isNullable: false,
                    },
                    {
                        name: "price_id",
                        type: "integer",
                        isNullable: false,
                    },

                    {
                        name: "user_id",
                        type: "integer",
                        isNullable: false,
                    },

                    {
                        name: "billing_cycle_anchor",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "cancel_at",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "cancel_at_period_end",
                        type: "boolean",
                        default: false,
                        isNullable: true,
                    },
                    {
                        name: "canceled_at",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "created",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "currency",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "current_period_end",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "current_period_start",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "customer",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "default_payment_method",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "description",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "discount",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },

                    {
                        name: "ended_at",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "metadata",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },

                    {
                        name: "schedule",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "start_date",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "255",
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
            }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("subscription", true);
    }

}

import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class PaymentMethods1694497103189 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "payment_methods",
                columns: [
                    {
                        name: "payment_method_id",
                        type: "integer",
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "stripe_payment_method_id",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "user_id",
                        type: "integer",
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "phone",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },

                    {
                        name: "card_brand",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "exp_month",
                        type: "integer",
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: "exp_year",
                        type: "integer",
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: "funding",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "last4",
                        type: "integer",
                        default: 0,
                        isNullable: false,
                    },

                    {
                        name: "type",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "city",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "state",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "country",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },

                    {
                        name: "postal_code",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },

                    {
                        name: "line1",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "line2",
                        type: "varchar",
                        length: "255",
                        isNullable: true
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
        await queryRunner.dropTable("payment_methods", true);
    }

}

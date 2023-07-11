import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm"

export class ItemDetails1685509350372 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "item_details",
                columns: [
                    {
                        name: "item_detail_id",
                        type: "integer",
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: "increment"

                    },
                    {
                        name: "value",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "item_id",
                        type: "integer",
                        isNullable: false,
                    },
                    {
                        name: "dynamic_id",
                        type: "integer",
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
            }));

        // await queryRunner.addColumn(
        //     "item_details",
        //     new TableColumn({
        //         name: "item_id",
        //         type: "integer",
        //     }),
        // ),

        //     await queryRunner.createForeignKey(
        //         "item_details",
        //         new TableForeignKey({
        //             columnNames: ["item_id"],
        //             referencedColumnNames: ["item_id"],
        //             referencedTableName: "item",
        //         })
        //     )


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("item_details", true);
    }

}

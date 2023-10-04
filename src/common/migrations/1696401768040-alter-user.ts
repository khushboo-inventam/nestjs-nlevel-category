import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterUser1696401768040 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('users', [
            new TableColumn({
              name: 'is_professional',
              type: 'boolean',
              default: false,
            }),
            new TableColumn({
              name: 'company_name',
              type: 'varchar',
              isNullable: true,
            }),
            new TableColumn({
              name: 'company_email',
              type: 'varchar',
              isNullable: true,
            }),
            new TableColumn({
              name: 'company_mobile_no',
              type: 'varchar',
              isNullable: true,
            }),
            new TableColumn({
              name: 'company_website',
              type: 'varchar',
              isNullable: true,
            }),
            new TableColumn({
              name: 'company_address',
              type: 'varchar',
              isNullable: true,
            }),
            new TableColumn({
              name: 'facebook_link',
              type: 'varchar',
              isNullable: true,
            }),
            new TableColumn({
              name: 'instagram_link',
              type: 'varchar',
              isNullable: true,
            }),
            new TableColumn({
              name: 'other_social_link',
              type: 'varchar',
              isNullable: true,
            }),
          ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('users', [
            'is_professional',
            'company_name',
            'company_email',
            'company_mobile_no',
            'company_website',
            'company_address',
            'facebook_link',
            'instagram_link',
            'other_social_link',
          ]);
    }

}

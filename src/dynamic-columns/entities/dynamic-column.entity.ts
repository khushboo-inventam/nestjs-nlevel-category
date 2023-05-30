import { ItemDetail } from "src/item-details/entities/item-detail.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "dynamic_column" })
export class DynamicColumn {
    @PrimaryGeneratedColumn()
    dynamic_id: number;

    @Column({ nullable: false })
    name: string;

    @Column()
    type: string;

    @Column({ default: false })
    is_deleted: boolean;

    @Column({ nullable: true, type: "uuid" })
    created_by: string;

    @Column({ nullable: true, type: "uuid" })
    updated_by: string;

    @Column({ nullable: true, type: "uuid" })
    deleted_by: string;

    @Column({ nullable: true })
    created_at: string;

    @Column({ nullable: true })
    updated_at: string;

    @Column({ nullable: true })
    deleted_at: string;

    // @OneToMany(() => ItemDetail, (ItemDetail) => ItemDetail.dynamic_col_id)
    // item_dynamic: ItemDetail[]
}

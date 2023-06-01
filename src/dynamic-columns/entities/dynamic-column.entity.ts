import { ItemDetail } from "src/item-details/entities/item-detail.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "dynamic_column" })
export class DynamicColumn {
    @PrimaryGeneratedColumn('increment')
    dynamic_id: number;

    @Column({ nullable: false })
    name: string;

    @Column()
    type: string;

    @Column({ default: false })
    is_deleted: boolean;

    @Column({ nullable: true})
    created_by: string;

    @Column({ nullable: true})
    updated_by: string;

    @Column({ nullable: true})
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

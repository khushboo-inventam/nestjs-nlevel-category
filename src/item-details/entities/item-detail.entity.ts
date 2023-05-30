import { DynamicColumn } from "../../dynamic-columns/entities/dynamic-column.entity";
import { Item } from "../../item/entities/item.entity";
import { Column, Entity, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "item_details" })
export class ItemDetail {
    @PrimaryGeneratedColumn()
    item_detail_id: number;

    @Column({ nullable: false })
    value: string;

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

    // @ManyToOne(() => DynamicColumn, (dynamicColumn) => dynamicColumn.dynamic_id)
    // @JoinTable()
    // dynamic_col_id: DynamicColumn;

    @ManyToOne(() => Item, (items) => items.item_id)
    @JoinTable({ name: 'item_id' })
    item : Item;

}



import { ItemDetail } from "src/item-details/entities/item-detail.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "item" })
export class Item {
    @PrimaryGeneratedColumn('increment')
    item_id: number;

    @Column({ nullable: false, unique: true })
    item_code: string;

    @Column({ nullable: false })
    name: string;

    @Column()
    image: string;

    @Column()
    item_description: string;

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

    // @OneToMany(() => ItemDetail, (ItemDetail) => ItemDetail.itemId)
    // item_details: ItemDetail[]
}

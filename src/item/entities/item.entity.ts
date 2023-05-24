import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "item" })
export class Item {
    @PrimaryGeneratedColumn()
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


}
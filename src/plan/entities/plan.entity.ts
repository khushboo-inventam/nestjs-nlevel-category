import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "plan" })
export class Plan {

    @PrimaryGeneratedColumn('increment')
    plan_id: number;

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: false })
    type: string;

    @Column()
    description: string;

    @Column()
    images: string;

     
    @Column({type:'jsonb'})
    metadata: string;

    @Column({ default: true })
    active: boolean;

    @Column()
    stripe_plan_id: string;

    @Column()
    stripe_default_price: string;

    @Column({ default: false })
    is_deleted: boolean;

    @Column({ nullable: true })
    created_by: string;

    @Column({ nullable: true })
    updated_by: string;

    @Column({ nullable: true })
    deleted_by: string;

    @Column({ nullable: true })
    created_at: string;

    @Column({ nullable: true })
    updated_at: string;

    @Column({ nullable: true })
    deleted_at: string;

}

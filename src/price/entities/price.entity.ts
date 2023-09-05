import internal from "stream";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "price" })
export class Price {

    @PrimaryGeneratedColumn('increment')
    price_id: number;

    @Column()
    plan_id: number;
 
    @Column()
    currency: string;

    @Column()
    unit_amount: string;

    @Column()
    description: string;

    @Column()
    meta_data: string;

    @Column({ default: true })
    active: boolean;

    // @Column()
    // payment_gateway_plan_id: string;
  
    @Column()
    payment_gateway_price_id: string;

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

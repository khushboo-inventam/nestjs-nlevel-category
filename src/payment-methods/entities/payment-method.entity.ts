import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "payment_methods" })
export class PaymentMethod {
    @PrimaryGeneratedColumn('increment')
    payment_method_id: number;

    @Column()
    stripe_payment_method_id: string;

    @Column({ nullable: false })
    type: string;

    @Column({ nullable: false })
    user_id: number;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    card_brand: string;

    @Column({ nullable: false })
    exp_month: number;

    @Column({ nullable: false })
    exp_year: number;

    @Column()
    funding: string;

    @Column({ nullable: false })
    last4: number;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    country: string;

    @Column()
    postal_code: string;

    @Column()
    line1: string;

    @Column()
    line2: string;

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

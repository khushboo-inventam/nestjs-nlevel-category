
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "subscription" })
export class Subscription {
    @PrimaryGeneratedColumn('increment')
    subscription_id: number;

    @Column()
    stripe_subscription_id: string;

    @Column()
    plan_id: number;

    @Column()
    price_id: number;

    @Column()
    user_id: number;

    @Column()
    billing_cycle_anchor: number;

    @Column()
    cancel_at: number;

    @Column({ default: false })
    cancel_at_period_end: boolean;

    @Column()
    canceled_at: number;

    @Column()
    created: number;

    @Column()
    currency: string;

    @Column()
    current_period_end: number;

    @Column()
    current_period_start: number;

    @Column()
    customer: string;

    @Column()
    default_payment_method: string;

    @Column()
    description: string;

    @Column()
    discount: string;

    @Column()
    ended_at: number;

    @Column()
    metadata: string;

    @Column()
    schedule: string;

    @Column()
    start_date: number;

    @Column()
    status: string;


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

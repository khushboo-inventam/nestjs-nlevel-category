export interface IGetStripeSubcription {
    billing_cycle_anchor: number;

    cancel_at: number;

    canceled_at: number;

    cancel_at_period_end: boolean;

    created: number;

    currency: string;

    current_period_end: number;

    current_period_start: number;

    customer: string;

    default_payment_method: string;

    description: string;

    // discount: string;

    ended_at: number;

    // metadata: string;

    schedule?: string;

    start_date: number;

    status: string;

} 
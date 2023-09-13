export interface IPaymentMethod {
    payment_method_id:  number ;
    id: string;
    stripe_payment_method_id: string;
    type: string;
    user_id: number;
    email: string;
    name: string;
    phone: string;
    card_brand: string;
    exp_month: number;
    exp_year: number;
    funding: string;
    last4: number;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    line1: string;
    line2: string;
  }
  
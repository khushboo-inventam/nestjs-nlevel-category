import Stripe from 'stripe';

export const STRIPE_TOKEN = 'STRIPE_TOKEN';
export interface StripeOptions {
  apiKey: string;
  config: Stripe.StripeConfig;
}

import { Provider } from '@nestjs/common';

import Stripe from 'stripe';

import { StripeOptions, STRIPE_TOKEN } from './stripe-options.interface';

export const createStripeProvider = (options: StripeOptions | any): Provider<Stripe> => {
  return {
    provide: STRIPE_TOKEN,
    useValue: new Stripe(options.apiKey, options.config),
  };
};

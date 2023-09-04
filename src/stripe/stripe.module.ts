import { DynamicModule, Module } from '@nestjs/common';
import { createStripeProvider } from './createStripeProviders';

@Module({})
export class StripeModule {
  static forRootAsync(options): DynamicModule {
    const provider = createStripeProvider(options);
    return {
      global: true,
      module: StripeModule,
      providers: [provider],
      exports: [provider],
    };
  }
}

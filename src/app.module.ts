import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CategoryModule } from "./category/category.module";
import { AllExceptionsFilter } from "./common/all-exceptions.filter";
import { APP_FILTER } from "@nestjs/core";
import { ItemModule } from './item/item.module';
import { DynamicColumnsModule } from './dynamic-columns/dynamic-columns.module';
import { ItemDetailsModule } from './item-details/item-details.module';
import DatabaseModule from "./common/database.module";
import { HistoryModule } from "./history/history.module";
import { PlanModule } from './plan/plan.module';
import { PriceModule } from './price/price.module';
import { StripeModule } from "./stripe/stripe.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: "postgres",
          host: "127.0.0.1",
          port: 5432,
          username: "postgres",
          password: "root",
          database: "microservice",
          synchronize: false,
          autoLoadEntities: true,
          //  entities: ['src/**/entities/*.ts'],
          migrations: ['dist/common/migrations/*.ts'],
          cli: {
            migrationDir: 'src/common/migrations/*.ts'
          }
          , logging: true
        };

      },

      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),

    StripeModule.forRootAsync({
      apiKey: 'sk_test_51Ljx7VSAmJCW9SjgwVaXt4ZONKiXKU5psO2EkRi9uVy4w1SefwSDKlOFlXtynqweoF4g7U9DWsnxKX0sIL4Mz9oL00hRK09mjk',
      config: { apiVersion: '2022-11-15' },
      // webhookConfig: {
      //   stripeWebhookSecret: configServiceObj.get<string>('stripe.stripe_webhook_key'),
      // },
    }),
    //      TypeOrmModule.forFeature([CategorySchema]),
    // DatabaseModule  ,
    CategoryModule,
    ItemModule,
    DynamicColumnsModule,
    ItemDetailsModule,
    HistoryModule,
    PlanModule,
    PriceModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
  ],
})
export class AppModule { }

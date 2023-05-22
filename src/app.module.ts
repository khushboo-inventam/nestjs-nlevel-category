import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CategoryModule } from "./category/category.module";
import { AllExceptionsFilter } from "./common/all-exceptions.filter";
import { APP_FILTER } from "@nestjs/core";
import { CategorySchema } from "./category/entities/category.entity.schema";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: "postgres",
          host: "localhost",
          port: 5432,
          username: "postgres",
          password: "postgres",
          database: "cat_micro",
          synchronize: true,
          autoLoadEntities: true,
          //  entities: ['src/**/entities/*.ts'],
          // migrations: ['src/database/migrations/*.js'],
        };
      },

      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        console.log("dataSource", dataSource);
        return dataSource;
      },
    }),
//      TypeOrmModule.forFeature([CategorySchema]),
    CategoryModule,
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
export class AppModule {}

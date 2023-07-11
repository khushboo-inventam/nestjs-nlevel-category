
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
 
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // type: 'postgres',
        // host: configService.get('POSTGRES_HOST'),
        // port: configService.get('POSTGRES_PORT'),
        // username: configService.get('POSTGRES_USER'),
        // password: configService.get('POSTGRES_PASSWORD'),
        // database: configService.get('POSTGRES_DB'),
        // entities: [],
        // autoLoadEntities: true,
        type: "postgres",
        host: "127.0.0.1",
        port: 5432,
        username: "postgres",
        password: "root",
        database: "microservice",
        synchronize: false,
          autoLoadEntities: false,
        //  entities: ['src/**/entities/*.ts'],
       migrations: ['dist/common/migrations/*.ts'],

      }),
    }),
  ],
})
class DatabaseModule {}
 
export default DatabaseModule;
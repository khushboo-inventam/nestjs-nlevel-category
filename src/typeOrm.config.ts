
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
    //   type: 'postgres',
    //   host: configService.get('POSTGRES_HOST'),
    //   port: configService.get('POSTGRES_PORT'),
    //   username: configService.get('POSTGRES_USER'),
    //   password: configService.get('POSTGRES_PASSWORD'),
    //   database: configService.get('POSTGRES_DB'),
    //   entities: [],


    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "microservice",
    synchronize: false,
    //   autoLoadEntities: true,
    //  entities: ['src/**/entities/*.ts'],
    migrations: ['src/common/migrations/*.ts'],
});
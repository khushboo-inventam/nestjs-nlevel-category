import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import appConfig from './config/app.config';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

import * as basicAuth from 'express-basic-auth';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';



dotenv.config({ path: path.resolve(__dirname, `../.env`) });


async function bootstrap() {
  const configService = new ConfigService({ app: appConfig() });
  console.log('configService', configService);
  const port = configService.get<number>('app.port') || 3000;
  const host = configService.get<string>('app.host') || 'localhost';
  console.log('port', configService.get<number>('app.port'));
  console.log('host', configService.get<string>('app.host'));

  const devTransports = [
    new winston.transports.Console({
      level: 'warn',
    }),
    new winston.transports.Console({
      level: 'error',
    }),
    new winston.transports.File({
      level: 'debug',
      // Create the log directory if it does not exist
      filename: `logs/unavailable-tracks-${new Date().toLocaleDateString('es-CL')}`,
    }),
  ];
  const prodTransports = [
    new winston.transports.Console({
      level: 'warn',
    }),
    new winston.transports.Console({
      level: 'error',
    }),
    new winston.transports.File({
      level: 'debug',
      // Create the log directory if it does not exist
      filename: `logs/unavailable-tracks-${new Date().toLocaleDateString('es-CL')}`,
    }),
  ];
  const app = await NestFactory.create(AppModule); 
  app.connectMicroservice<MicroserviceOptions>({
          transport: Transport.TCP,
          options: { retryAttempts: 5, retryDelay: 3000 },
        });
        await app.startAllMicroservices();
//   const app = await NestFactory.create(AppModule, {
//     logger: WinstonModule.createLogger({
//       transports: process.env.NODE_ENV === 'production' ? prodTransports : devTransports,
//     }),
//   });

  const config = new DocumentBuilder()
    .setTitle('Category - Microservice')
    .setDescription('Category microservices API description')
    .setVersion('1.0')
    .addTag('Microservice')
    .addApiKey(
      {
        type: 'apiKey', // this should be apiKey
        name: 'authorization', // this is the name of the key you expect in header
        in: 'header',
      },
      'access_token', // this is the name to show and used in swagger
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(
          ['/api', '/docs-json'],
          basicAuth({
            challenge: true,
            users: {
              [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
            },
          }),
        );
  await app.listen(port, host);
}
bootstrap();

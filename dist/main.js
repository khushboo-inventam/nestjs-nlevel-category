"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_config_1 = require("./config/app.config");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const path = require("path");
const basicAuth = require("express-basic-auth");
const microservices_1 = require("@nestjs/microservices");
const winston = require("winston");
dotenv.config({ path: path.resolve(__dirname, `../.env`) });
async function bootstrap() {
    const configService = new config_1.ConfigService({ app: (0, app_config_1.default)() });
    console.log('configService', configService);
    const port = configService.get('app.port') || 3000;
    const host = configService.get('app.host') || 'localhost';
    console.log('port', configService.get('app.port'));
    console.log('host', configService.get('app.host'));
    const devTransports = [
        new winston.transports.Console({
            level: 'warn',
        }),
        new winston.transports.Console({
            level: 'error',
        }),
        new winston.transports.File({
            level: 'debug',
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
            filename: `logs/unavailable-tracks-${new Date().toLocaleDateString('es-CL')}`,
        }),
    ];
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.connectMicroservice({
        transport: microservices_1.Transport.TCP,
        options: { retryAttempts: 5, retryDelay: 3000 },
    });
    await app.startAllMicroservices();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Category - Microservice')
        .setDescription('Category microservices API description')
        .setVersion('1.0')
        .addTag('Microservice')
        .addApiKey({
        type: 'apiKey',
        name: 'authorization',
        in: 'header',
    }, 'access_token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.use(['/api', '/docs-json'], basicAuth({
        challenge: true,
        users: {
            [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
    }));
    await app.listen(port, host);
}
bootstrap();
//# sourceMappingURL=main.js.map
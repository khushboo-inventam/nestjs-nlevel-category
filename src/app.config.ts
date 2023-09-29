import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  dbConnection: {
    type: process.env.DB_TYPE || 'postgres',
    url: process.env.DB_CONNECTION_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'test',
    expiration: process.env.JWT_EXPIRES_IN || '1d',
    refresh_token_expiration: process.env.JWT_REFRESH_EXPIRES_IN || '1w',
  },
}));

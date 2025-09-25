import { INestApplication } from '@nestjs/common';
import { logDebug } from '../logger/logger';

export const setupCors = (app: INestApplication) => {
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['https://yourdomain.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
  logDebug('CORS configured', 'ServerInfrastructure');
};
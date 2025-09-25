import { INestApplication } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { logDebug } from '@logger/logger';

export const setupBodyParser = (app: INestApplication) => {
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));
  logDebug('Body parser configured', 'ServerInfrastructure');
};
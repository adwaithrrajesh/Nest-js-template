import { INestApplication } from '@nestjs/common';
import hpp from 'hpp';
import { logDebug } from '../logger/logger';

export const setupHPP = (app: INestApplication) => {
  app.use(hpp());
  logDebug('HPP middleware configured', 'ServerInfrastructure');
};
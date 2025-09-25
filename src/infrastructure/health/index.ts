import { INestApplication } from '@nestjs/common';
import { setupServerHealthCheck } from './server.health';
import { setupDatabaseHealthCheck } from './database.health';
import { logDebug } from '@logger/logger';

export const setupHealthChecks = (app: INestApplication) => {
  setupServerHealthCheck(app);
  setupDatabaseHealthCheck(app);
  logDebug('Health check endpoints configured', 'ServerInfrastructure');
};

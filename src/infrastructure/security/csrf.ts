import { INestApplication } from '@nestjs/common';
import csurf from 'csurf';
import { logDebug } from '../logger/logger';

export const setupCSRFProtection = (app: INestApplication) => {
  // app.use(csurf({ cookie: true }));
  logDebug('CSRF protection configured', 'ServerInfrastructure');
};
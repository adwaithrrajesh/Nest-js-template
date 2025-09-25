import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { logDebug } from '../logger/logger';

export const setupHelmet = (app: INestApplication) => {
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: 'no-referrer' },
      frameguard: { action: 'deny' },
      hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
      noSniff: true,
    }),
  );
  logDebug('Helmet middleware configured', 'ServerInfrastructure');
};
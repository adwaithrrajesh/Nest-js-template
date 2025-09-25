import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { logDebug } from '@logger/logger';

export const setupCookieParser = (app: INestApplication) => {
  app.use(
    cookieParser(process.env.COOKIE_SECRET || 'default_secret', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    }),
  );
  logDebug('Cookie parser configured', 'ServerInfrastructure');
};

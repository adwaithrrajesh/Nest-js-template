import { INestApplication, ValidationPipe } from '@nestjs/common';
import { logDebug } from '@logger/logger';

export const setupValidation = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  logDebug('Global validation pipes configured', 'ServerInfrastructure');
};
import { INestApplication, ValidationPipe, BadRequestException } from '@nestjs/common';
import { logDebug } from '@logger/logger';

export const setupValidation = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((err) => Object.values(err.constraints ?? {}))
          .flat()
          .join(', ');

        return new BadRequestException(messages);
      },
    }),
  );
  logDebug('Global validation pipes configured', 'ServerInfrastructure');
};

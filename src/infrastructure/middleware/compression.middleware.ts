import { INestApplication } from '@nestjs/common';
import compression from 'compression';
import { logDebug } from '@logger/logger';


export const setupCompression = (app: INestApplication) => {
  app.use(compression());
  logDebug('Compression middleware configured', 'ServerInfrastructure');
};
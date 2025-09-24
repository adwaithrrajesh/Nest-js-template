import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServerInfrastructure } from './infrastructure/serverInfrastructure';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = new ServerInfrastructure(app);
  server.setup(); 
  await server.start(); 
}

bootstrap();
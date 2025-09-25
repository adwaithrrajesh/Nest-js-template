import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ServerInfrastructure } from './infrastructure/server/serverInfrastructure';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const server = new ServerInfrastructure(app);
    server.setup();
    await server.start();
}

bootstrap();

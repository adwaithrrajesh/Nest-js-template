import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { rateLimiter } from './security/ratelimiter';
import { logInfo, logDebug } from './logger/logger'; 
import { env } from 'src/infrastructure/configs/env.config';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { setupServerHealthCheck } from './health/server.health';
import { setupDatabaseHealthCheck } from './health/database.health';

export class ServerInfrastructure {
  constructor(private readonly app: INestApplication) {}

  public setup(): void {
    logInfo('🛠️  Setting up server infrastructure...', 'ServerInfrastructure');
    this.setupCors();
    this.setupHelmet();
    this.setupCompression();
    this.setupBodyParser();
    this.setupRateLimiter();
    this.setupHttpParameterPollution();
    this.setupCookieParser();
    this.setupGlobalValidation();
    this.responseInterceptor();

    setupServerHealthCheck(this.app);
    setupDatabaseHealthCheck(this.app);
    logInfo('✅ Server infrastructure setup complete', 'ServerInfrastructure');
  }

  private setupCors(): void {
    this.app.enableCors({
      origin: process.env.CORS_ORIGIN?.split(',') || ['https://yourdomain.com'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
    logDebug('CORS configured', 'ServerInfrastructure');
  }

  private responseInterceptor():void{
      this.app.useGlobalInterceptors(new ResponseInterceptor());
  }

  private setupHelmet(): void {
    this.app.use(
      helmet({
        contentSecurityPolicy: process.env.NODE_ENV === 'production',
        crossOriginEmbedderPolicy: false,
      }),
    );
    logDebug('Helmet middleware configured', 'ServerInfrastructure');
  }

  private setupCompression(): void {
    this.app.use(compression());
    logDebug('Compression middleware configured', 'ServerInfrastructure');
  }

  private setupBodyParser(): void {
    this.app.use(json({ limit: '1mb' }));
    this.app.use(urlencoded({ extended: true, limit: '1mb' }));
    logDebug('Body parser configured', 'ServerInfrastructure');
  }

  private setupRateLimiter(): void {
    this.app.use(rateLimiter);
    logDebug('Rate limiter configured', 'ServerInfrastructure');
  }

  private setupHttpParameterPollution(): void {
    this.app.use(hpp());
    logDebug('HPP middleware configured', 'ServerInfrastructure');
  }

  private setupCookieParser(): void {
    this.app.use(cookieParser(process.env.COOKIE_SECRET || 'default_secret'));
    logDebug('Cookie parser configured', 'ServerInfrastructure');
  }

  private setupGlobalValidation(): void {
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    logDebug('Global validation pipes configured', 'ServerInfrastructure');
  }

  public async start(): Promise<void> {
    const port = env.PORT
    await this.app.listen(port as number);
    logInfo(`🚀 Server running on port ${port}`, 'ServerInfrastructure');
  }

}
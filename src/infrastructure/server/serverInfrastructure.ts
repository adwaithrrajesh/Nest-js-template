import { INestApplication } from '@nestjs/common';
import { env } from '@configs/env.config';
import { logInfo } from '@logger/logger';
import { setupCors } from '@security/cors';
import { setupHelmet } from '@security/helmet';
import { setupCSRFProtection } from '@security/csrf';
import { setupXSS } from '@security/xss';
import { setupRateLimiter } from '@infrastructure/security/ratelimiter';
import { setupHPP } from '@security/hpp';
import { setupBodyParser } from '@middleware/body-parser.middleware';
import { setupCookieParser } from '@middleware/cookie-parser.middleware';
import { setupCompression } from '@middleware/compression.middleware';
import { setupValidation } from '@middleware/validation.middleware';
import { setupHealthChecks } from '@infrastructure/health';
import { ResponseInterceptor } from 'common/interceptors/response.interceptor';

export class ServerInfrastructure {
  constructor(private readonly app: INestApplication) {}

  public setup(): void {
    logInfo('🛠️ Setting up server infrastructure...', 'ServerInfrastructure');

    setupCors(this.app);
    setupHelmet(this.app);
    setupCompression(this.app);
    setupBodyParser(this.app);
    setupRateLimiter(this.app);
    setupHPP(this.app);
    setupCookieParser(this.app);
    setupCSRFProtection(this.app);
    setupXSS(this.app);
    setupValidation(this.app);
    setupHealthChecks(this.app);


    this.app.setGlobalPrefix('/api');
    this.app.useGlobalInterceptors(new ResponseInterceptor());

    logInfo('✅ Server infrastructure setup complete', 'ServerInfrastructure');
  }

  public async start(): Promise<void> {
    await this.app.listen(env.PORT as number);
    logInfo(`🚀 Server running on port ${env.PORT}`, 'ServerInfrastructure');
  }
}

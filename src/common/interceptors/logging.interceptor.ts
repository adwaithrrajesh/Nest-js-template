import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - now;
          const statusCode = response.statusCode;

          if (statusCode >= 200 && statusCode < 300) {
            this.logger.info(`${method} ${url} ${statusCode} ${responseTime}ms ✅`);
          } else if (statusCode >= 300 && statusCode < 400) {
            this.logger.info(`${method} ${url} ${statusCode} ${responseTime}ms ↪️`);
          } else if (statusCode >= 400 && statusCode < 500) {
            this.logger.warn(`${method} ${url} ${statusCode} ${responseTime}ms ⚠️`);
          }
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          const statusCode = error?.status || 500;

          if (statusCode >= 500) {
            this.logger.error(
              `${method} ${url} ${statusCode} ${responseTime}ms ❌ ${error.message}`,
              { stack: error.stack },
            );
          } else {
            this.logger.warn(
              `${method} ${url} ${statusCode} ${responseTime}ms  ${error.message}`,
            );
          }
        },
      }),
    );
  }
}

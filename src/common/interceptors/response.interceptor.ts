import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, { success: boolean; message: string; data: T }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ success: boolean; message: string; data: T }> {
    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          message: data?.message || 'Request successful',
          data: data?.data || data,
        };
      }),
    );
  }
}

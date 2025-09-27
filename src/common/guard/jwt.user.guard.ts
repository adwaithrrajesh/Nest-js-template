// common/guard/jwt.user.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { env } from '@configs/env.config';

export const TOKEN_TYPE_KEY = 'tokenType'; // key to identify token type

@Injectable()
export class JwtUserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // Determine token type (default to 'access')
    const tokenType = this.reflector.getAllAndOverride<'access' | 'refresh'>(TOKEN_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? 'access';

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Choose secret key based on token type
    const secret = tokenType === 'access' ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET;

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret:secret as string });
      request['user'] = payload;

      // Optional check to ensure token type matches metadata
      if (payload.type !== tokenType) {
        throw new UnauthorizedException(`Invalid token type. Expected ${tokenType}`);
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException(`Invalid or expired ${tokenType} token`);
    }
  }
}
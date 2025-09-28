// common/guard/jwt.user.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { env } from '@configs/env.config';

export const TOKEN_TYPE_KEY = 'tokenType';

@Injectable()
export class JwtUserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // Determine whether this endpoint expects an access token or refresh token
    const tokenType = this.reflector.getAllAndOverride<'access' | 'refresh'>(TOKEN_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? 'access';

    let token: string | undefined;

    // ------------------------------
    // Access Token → from Authorization header
    // ------------------------------
    if (tokenType === 'access') {
      const authHeader = request.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('No access token provided');
      }

      token = authHeader.split(' ')[1];
    }

    // ------------------------------
    // Refresh Token → from cookies
    // ------------------------------
    if (tokenType === 'refresh') {
      token = request.cookies?.refresh_token;

      if (!token) {
        throw new UnauthorizedException('No refresh token provided in cookies');
      }
    }

    // Choose the correct secret key
    const secret = tokenType === 'access' ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET;

    try {
      // Verify the token
      const payload = await this.jwtService.verifyAsync(token as string, { secret: secret as string });

      // Attach payload to request for controller use
      request['user'] = payload;

      // Ensure the token type matches what we expect
      if (payload.type !== tokenType) {
        throw new UnauthorizedException(`Invalid token type. Expected ${tokenType}`);
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException(`Invalid or expired ${tokenType} token`);
    }
  }
}
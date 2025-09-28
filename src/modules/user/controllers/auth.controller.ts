import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { Public } from 'common/decorators/public.decorator';
import { TokenType } from 'common/decorators/token.decorator';
import { GetUser } from 'common/decorators/user.decorator';
import { env } from '@configs/env.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Helper: Set secure refresh token cookie */
  private setRefreshCookie(res: any, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: 'strict',
      path: '/api/auth/refresh',
    });
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res) {
    const { accessToken, refreshToken } = await this.authService.register(dto);
    this.setRefreshCookie(res, refreshToken);
    return { data: { accessToken }, message: 'Registered successfully' };
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res) {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    this.setRefreshCookie(res, refreshToken);
    return { data: { accessToken }, message: 'Login successful' };
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @TokenType('refresh')
  async refreshToken(@GetUser() user: any, @Res({ passthrough: true }) res) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(user);
    this.setRefreshCookie(res, refreshToken);
    return { data: { accessToken }, message: 'Token renewed successfully' };
  }
}
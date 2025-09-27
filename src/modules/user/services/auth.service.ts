// auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { env } from '@configs/env.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository
  ) {}

  // Helper to generate both tokens
  private generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(
      { ...payload, type: 'access' },
      { secret: env.JWT_ACCESS_SECRET as string, expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { secret: env.JWT_REFRESH_SECRET as string, expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  // Register user and issue tokens
  public async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create(email, hashedPassword);

    const payload = { sub: user.id, email: user.email };
    return this.generateTokens(payload);
  }

  // Login user and issue tokens
  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return this.generateTokens(payload);
  }


  public async refreshTokens(decoded: any) {
    try {
      const user = await this.userRepository.findById(decoded.sub);
      if (!user) throw new NotFoundException('User not found');
      return this.generateTokens({ sub: user.id, email: user.email });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
// auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from '../dto/auth.dto'
import { UserRepository } from '@modules/user/repositories/user.repository';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository
  ) {}

 // Register user and issue tokens
  public async register(registerDto: RegisterDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = registerDto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create(email, hashedPassword);

    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // stateless refresh

    return { accessToken, refreshToken };
  }

  // Generate new tokens from a valid refresh token
  public async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET });

      // // Optionally, you can check if user still exists
      // const user = await this.userRepository.findById(payload.sub);
      // if (!user) throw new UnauthorizedException('User not found');

      // const newPayload = { sub: user.id, email: user.email };
      const newPayload = {test:'test'}
      const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
      const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  public async login(loginDto: LoginDto): Promise<{ token: string;}> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return { token: this.jwtService.sign(payload)};
  }
}

// auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserRepository } from '@modules/user/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository
  ) {}

  public async register(registerDto: RegisterDto): Promise<{ token: string; message: string }> {
    const { email, password } = registerDto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create(email, hashedPassword);

    const payload = { sub: user.id, email: user.email };
    return { token: this.jwtService.sign(payload) ,message:'Registered successfully'};
  }

  public async login(loginDto: LoginDto): Promise<{ token: string; message: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return { token: this.jwtService.sign(payload) , message:'login successful'};
  }
}

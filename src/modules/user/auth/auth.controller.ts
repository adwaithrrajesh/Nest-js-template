import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

/**
 * Controller for handling authentication-related HTTP requests
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<{ data: any; message:string }> {
    const token = await  this.authService.register(registerDto);
    return{data:token, message:"Registered successfully"}
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ data: any; message: string }> {
    const token =  this.authService.login(loginDto);
    return {data:token,message:"Login successfully"}
  }
}

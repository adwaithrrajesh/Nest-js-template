import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { Public } from 'common/decorators/public.decorator';

/**
 * Controller for handling authentication-related HTTP requests
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<{ data: any; message:string }> {
    const token = await this.authService.register(registerDto);
    return{data:token, message:"Registered successfully"}
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ data: any; message: string }> {
    const token =  await this.authService.login(loginDto);
    console.log(token)
    return {data:token,message:"Login successfully"}
  }
}

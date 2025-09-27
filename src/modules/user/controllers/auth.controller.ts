import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException, Get, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { Public } from 'common/decorators/public.decorator';
import { TokenType } from 'common/decorators/token.decorator';
import { GetUser } from 'common/decorators/user.decorator';

/**
 * Controller for handling authentication-related HTTP requests
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() registerDto: RegisterDto): Promise<{ data: any; message:string }> {
    const token = await this.authService.register(registerDto);
    return{data:token, message:"Registered successfully"}
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto, @GetUser() user:any): Promise<{ data: any; message: string }> {
    console.log(user)
    const token =  await this.authService.login(loginDto);
    return {data:token,message:"Login successfully"}
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @TokenType('refresh') 
  public async refreshToken(@GetUser() user: any): Promise<any> {
    const token = await this.authService.refreshTokens(user);
    return {data:token, message:"Token renewed successfully"}
  }
  
}

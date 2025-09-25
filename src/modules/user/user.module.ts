import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from '@infrastructure/prisma/prisma.service';
import { PrismaModule } from '@infrastructure/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { env } from '@configs/env.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtUserGuard } from 'common/guard/jwt.user.guard';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: env.JWT_SECRET as string,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    UserRepository,
    PrismaService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtUserGuard, 
    },
  ],
  controllers: [AuthController],
  exports: [UserRepository],
})
export class UserModule {}

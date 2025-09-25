import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from '@infrastructure/prisma/prisma.service';


@Module({
  providers: [UserRepository, PrismaService],
  exports: [UserRepository], 
})
export class UserModule {}

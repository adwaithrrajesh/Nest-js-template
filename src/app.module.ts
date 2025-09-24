import { Module } from '@nestjs/common';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [AuthModule]
})
export class AppModule {}
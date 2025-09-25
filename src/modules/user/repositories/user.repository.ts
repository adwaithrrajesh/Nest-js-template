import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findByEmail(email: string):Promise<any>{
    return this.prisma.user.findUnique({ where: { email } });
  }

  public async create(email: string, password: string): Promise<any> {
    return this.prisma.user.create({ data: { email, password } });
  }
}

import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { email: string; password: string }) {
    return this.prisma.user.create({
      data,
      select: {
        user_id: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  public async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}

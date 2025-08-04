import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async test() {
    const result = await this.prisma.user.findMany();

    return result;
  }
}

import { Injectable, ConflictException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRepository } from './user.repository';
import { BaseResponseDTO } from '../../common/dto/response.dto';
import { CreateUserResponse } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    data: CreateUserDto,
  ): Promise<BaseResponseDTO<CreateUserResponse>> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.createUser({
      email: data.email,
      password: hashedPassword,
    });

    return new BaseResponseDTO({
      data: user,
      message: 'User created successfully',
    });
  }
}

import { Test } from '@nestjs/testing';
import { UserService } from '../user.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserRepository } from '../user.repository';
import { ConflictException } from '@nestjs/common';

const mockPrisma = {
  user: { findUnique: jest.fn() },
};

const mockUserRepo = {
  createUser: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: UserRepository, useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create and return the user on create', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockUserRepo.createUser.mockResolvedValue({
      user_id: 1,
      email: 'new@email.com',
    });

    const result = await service.create({
      email: 'new@email.com',
      password: 'anyPassword',
    });

    expect(result.data?.user_id).toBe(1);
  });

  it('should return error duplicated email on create', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      email: 'existente@email.com',
    });

    await expect(
      service.create({ email: 'existente@email.com', password: 'anyPassword' }),
    ).rejects.toThrow(ConflictException);
  });
});

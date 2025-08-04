import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserRepository } from '../../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUserRepo = {
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(() => 'mock-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return error if invalid credentials', async () => {
      mockUserRepo.getUserByEmail.mockResolvedValue(null);
      await expect(
        service.validateUser({
          email: 'invalid@email.com',
          password: 'wrong',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user on validateUser', async () => {
      const mockUser = {
        email: 'valid@email.com',
        password: await bcrypt.hash('correctPassword', 10),
      };

      mockUserRepo.getUserByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser({
        email: 'valid@email.com',
        password: 'correctPassword',
      });

      expect(result.email).toBe('valid@email.com');
      expect(mockUserRepo.getUserByEmail).toHaveBeenCalledWith(
        'valid@email.com',
      );
    });
  });

  describe('login', () => {
    it('should return JWT token', () => {
      const result = service.login({ user_id: '1', email: 'test@email.com' });
      expect(result).toEqual({ access_token: 'mock-token' });
    });

    it('should return tokenized user_id and email on login', () => {
      service.login({ user_id: '123', email: 'test@email.com' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        user_id: '123',
        email: 'test@email.com',
      });
    });
  });

  describe('registerUser', () => {
    it('should return error if duplicated email', async () => {
      mockUserRepo.getUserByEmail.mockResolvedValue({
        email: 'exists@email.com',
      });
      await expect(
        service.registerUser({
          email: 'exists@email.com',
          password: 'any',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user on registerUser', async () => {
      mockUserRepo.getUserByEmail.mockResolvedValue(null);
      mockUserRepo.createUser.mockResolvedValue({
        user_id: 'new-id',
        email: 'new@email.com',
      });

      const result = await service.registerUser({
        email: 'new@email.com',
        password: 'anyGoodPassword',
      });

      expect(result.email).toBe('new@email.com');
      expect(mockUserRepo.createUser).toHaveBeenCalled();
    });
  });
});

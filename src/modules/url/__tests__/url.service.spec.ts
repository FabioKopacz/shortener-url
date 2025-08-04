import { Test } from '@nestjs/testing';
import { UrlService } from '../url.service';
import { UrlRepository } from '../url.repository';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

// Mocks
const mockUrlRepository = {
  incrementAccessCount: jest.fn(),
  getOriginalUrl: jest.fn(),
  getUrlsByUser: jest.fn(),
  shortenUrl: jest.fn(),
  findUrlById: jest.fn(),
  updateUrl: jest.fn(),
  deleteUrl: jest.fn(),
};

const mockConfigService = {
  getOrThrow: jest.fn().mockReturnValue('https://localhost:3000'),
};

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: UrlRepository, useValue: mockUrlRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    jest.clearAllMocks();
  });

  describe('incrementAccessCount', () => {
    it('should throw if short_code is empty', async () => {
      await expect(
        service.incrementAccessCount({ short_code: '' }),
      ).rejects.toThrow('Short code is required');
    });

    it('should call repository with valid short_code', async () => {
      await service.incrementAccessCount({ short_code: 'abc123' });
      expect(mockUrlRepository.incrementAccessCount).toHaveBeenCalledWith({
        short_code: 'abc123',
      });
    });
  });

  describe('getOriginalUrl', () => {
    it('should throw BadRequest if short_code is empty', async () => {
      await expect(service.getOriginalUrl('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return original URL', async () => {
      mockUrlRepository.getOriginalUrl.mockResolvedValue(
        'https://original.com',
      );
      const result = await service.getOriginalUrl('abc123');
      expect(result).toBe('https://original.com');
    });
  });

  describe('getUrlsByUser', () => {
    it('should format URLs correctly', async () => {
      mockUrlRepository.getUrlsByUser.mockResolvedValue([
        {
          url_id: '1',
          original: 'https://original.com',
          short_code: 'abc123',
          click_count: 5,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      const result = await service.getUrlsByUser({ user_id: 'user1' });
      expect(result[0].short_url).toBe('https://localhost:3000/abc123');
    });
  });

  describe('shortenUrl', () => {
    it('should generate short URL', async () => {
      mockUrlRepository.shortenUrl.mockResolvedValue({
        short_code: 'abc123',
      });

      const result = await service.shortenUrl({
        original_url: 'https://long.com',
        user_id: 'user1',
      });

      expect(result.shortUrl).toBe('https://localhost:3000/abc123');
    });
  });

  describe('updateUrl', () => {
    it('should throw if URL not found', async () => {
      mockUrlRepository.findUrlById.mockResolvedValue(null);
      await expect(
        service.updateUrl({ url_id: '404', original_url: 'https://test.com' }),
      ).rejects.toThrow('URL with ID 404 does not exist');
    });
  });

  describe('deleteUrl', () => {
    it('should throw if URL not found', async () => {
      mockUrlRepository.findUrlById.mockResolvedValue(null);
      await expect(service.deleteUrl({ url_id: '404' })).rejects.toThrow(
        'URL with ID 404 does not exist',
      );
    });
  });
});

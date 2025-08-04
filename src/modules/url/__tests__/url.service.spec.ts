import { Test } from '@nestjs/testing';
import { UrlService } from '../url.service';
import { UrlRepository } from '../url.repository';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, HttpStatus } from '@nestjs/common';

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
      expect(result.data).toBe('https://original.com');
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
      expect(result.data?.[0]?.short_url).toBe('https://localhost:3000/abc123');
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

      expect(result.data).toBe('https://localhost:3000/abc123');
    });
  });

  describe('updateUrl', () => {
    const mockUrl = {
      url_id: '1',
      original: 'https://original.com',
      short_code: 'abc123',
      user_id: 'user1',
      click_count: 5,
      created_at: new Date(),
      updated_at: new Date(),
    };

    beforeEach(() => {
      mockUrlRepository.findUrlById.mockResolvedValue(mockUrl);
      mockUrlRepository.updateUrl.mockResolvedValue(mockUrl);
    });

    it('should throw if URL not found', async () => {
      mockUrlRepository.findUrlById.mockResolvedValue(null);
      await expect(
        service.updateUrl({
          url_id: '404',
          original_url: 'https://test.com',
          user_id: 'user1',
        }),
      ).rejects.toThrow('URL with ID 404 does not exist');
    });

    it('should throw BadRequest if user is not the owner', async () => {
      await expect(
        service.updateUrl({
          url_id: '1',
          original_url: 'https://test.com',
          user_id: 'user2',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update URL if user is the owner', async () => {
      const result = await service.updateUrl({
        url_id: '1',
        original_url: 'https://new-url.com',
        user_id: 'user1',
      });

      expect(result.data?.url_id).toBe('1');
      expect(result.message).toBe('URL updated successfully');
      expect(mockUrlRepository.updateUrl).toHaveBeenCalled();
    });
  });

  describe('deleteUrl', () => {
    const mockUrl = {
      url_id: '1',
      original: 'https://original.com',
      short_code: 'abc123',
      user_id: 'user1',
      click_count: 5,
      created_at: new Date(),
      updated_at: new Date(),
    };

    beforeEach(() => {
      mockUrlRepository.findUrlById.mockResolvedValue(mockUrl);
    });

    it('should throw if URL not found', async () => {
      mockUrlRepository.findUrlById.mockResolvedValue(null);
      await expect(service.deleteUrl({ url_id: '404' })).rejects.toThrow(
        'URL with ID 404 does not exist',
      );
    });

    it('should throw BadRequest if user is not the owner', async () => {
      await expect(
        service.deleteUrl({
          url_id: '1',
          user_id: 'user2',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should delete URL if user is the owner', async () => {
      const result = await service.deleteUrl({
        url_id: '1',
        user_id: 'user1',
      });

      expect(result.message).toBe('URL deleted successfully');
      expect(result.code).toBe(HttpStatus.NO_CONTENT);
      expect(mockUrlRepository.deleteUrl).toHaveBeenCalledWith('1');
    });
  });
});

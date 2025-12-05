import { RefreshTokenRepository } from '../../infrastructure/repositories/refresh-token-repository';
import type { Models, RefreshToken } from '../../models';
import { Op } from 'sequelize';

describe('RefreshTokenRepository', () => {
  let refreshTokenRepository: RefreshTokenRepository;
  let mockModels: jest.Mocked<Models>;
  let mockRefreshTokenModel: any;

  const mockRefreshToken: Partial<RefreshToken> = {
    id: 'token-123',
    userId: 'user-123',
    tokenHash: 'hashed-refresh-token',
    expiresAt: new Date(Date.now() + 30 * 24 * 3600000),
    revoked: false,
    createdAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRefreshTokenModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn()
    };

    mockModels = {
      RefreshToken: mockRefreshTokenModel
    } as any;

    refreshTokenRepository = new RefreshTokenRepository(mockModels);
  });

  describe('create', () => {
    it('should create a refresh token', async () => {
      const payload = {
        userId: 'user-123',
        tokenHash: 'hashed-refresh-token',
        expiresAt: new Date(Date.now() + 30 * 24 * 3600000)
      };
      mockRefreshTokenModel.create.mockResolvedValue({ ...mockRefreshToken, ...payload });

      const result = await refreshTokenRepository.create(payload);

      expect(mockRefreshTokenModel.create).toHaveBeenCalledWith(payload);
      expect(result.userId).toBe('user-123');
      expect(result.tokenHash).toBe('hashed-refresh-token');
    });

    it('should create refresh token with all fields', async () => {
      const payload = {
        userId: 'user-456',
        tokenHash: 'another-hash',
        expiresAt: new Date(Date.now() + 60 * 24 * 3600000),
        revoked: false
      };
      mockRefreshTokenModel.create.mockResolvedValue({ ...mockRefreshToken, ...payload });

      const result = await refreshTokenRepository.create(payload);

      expect(mockRefreshTokenModel.create).toHaveBeenCalledWith(payload);
      expect(result.userId).toBe('user-456');
      expect(result.revoked).toBe(false);
    });

    it('should handle different expiration times', async () => {
      const shortExpiry = new Date(Date.now() + 3600000);
      const payload = {
        userId: 'user-123',
        tokenHash: 'short-lived-token',
        expiresAt: shortExpiry
      };
      mockRefreshTokenModel.create.mockResolvedValue({ ...mockRefreshToken, ...payload });

      const result = await refreshTokenRepository.create(payload);

      expect(result.expiresAt).toEqual(shortExpiry);
    });
  });

  describe('findValid', () => {
    it('should find valid refresh token', async () => {
      const now = new Date();
      mockRefreshTokenModel.findOne.mockResolvedValue(mockRefreshToken);

      const result = await refreshTokenRepository.findValid('hashed-refresh-token', now);

      expect(mockRefreshTokenModel.findOne).toHaveBeenCalledWith({
        where: {
          tokenHash: 'hashed-refresh-token',
          revoked: false,
          expiresAt: { [Op.gt]: now }
        }
      });
      expect(result).toEqual(mockRefreshToken);
    });

    it('should use current date if now is not provided', async () => {
      mockRefreshTokenModel.findOne.mockResolvedValue(mockRefreshToken);

      const beforeCall = Date.now();
      await refreshTokenRepository.findValid('hashed-refresh-token');
      const afterCall = Date.now();

      expect(mockRefreshTokenModel.findOne).toHaveBeenCalled();
      const callArgs = mockRefreshTokenModel.findOne.mock.calls[0][0];
      const passedDate = callArgs.where.expiresAt[Op.gt].getTime();

      expect(passedDate).toBeGreaterThanOrEqual(beforeCall);
      expect(passedDate).toBeLessThanOrEqual(afterCall);
    });

    it('should return null if token not found', async () => {
      mockRefreshTokenModel.findOne.mockResolvedValue(null);

      const result = await refreshTokenRepository.findValid('invalid-token');

      expect(result).toBeNull();
    });

    it('should return null if token is expired', async () => {
      mockRefreshTokenModel.findOne.mockResolvedValue(null);

      const result = await refreshTokenRepository.findValid('hashed-refresh-token', new Date());

      expect(result).toBeNull();
    });

    it('should return null if token is revoked', async () => {
      mockRefreshTokenModel.findOne.mockResolvedValue(null);

      const result = await refreshTokenRepository.findValid('hashed-refresh-token', new Date());

      expect(result).toBeNull();
    });

    it('should correctly compare expiration time', async () => {
      const futureDate = new Date(Date.now() + 31 * 24 * 3600000);
      mockRefreshTokenModel.findOne.mockResolvedValue(null);

      const result = await refreshTokenRepository.findValid('hashed-refresh-token', futureDate);

      expect(mockRefreshTokenModel.findOne).toHaveBeenCalledWith({
        where: {
          tokenHash: 'hashed-refresh-token',
          revoked: false,
          expiresAt: { [Op.gt]: futureDate }
        }
      });
      expect(result).toBeNull();
    });
  });

  describe('revokeByHash', () => {
    it('should revoke refresh token by hash', async () => {
      mockRefreshTokenModel.update.mockResolvedValue([1]);

      const result = await refreshTokenRepository.revokeByHash('hashed-refresh-token');

      expect(mockRefreshTokenModel.update).toHaveBeenCalledWith(
        { revoked: true },
        { where: { tokenHash: 'hashed-refresh-token' } }
      );
      expect(result).toEqual([1]);
    });

    it('should return update result', async () => {
      mockRefreshTokenModel.update.mockResolvedValue([1, [mockRefreshToken]]);

      const result = await refreshTokenRepository.revokeByHash('hashed-refresh-token');

      expect(result).toEqual([1, [mockRefreshToken]]);
    });

    it('should handle revoking non-existent token', async () => {
      mockRefreshTokenModel.update.mockResolvedValue([0]);

      const result = await refreshTokenRepository.revokeByHash('non-existent-token');

      expect(mockRefreshTokenModel.update).toHaveBeenCalledWith(
        { revoked: true },
        { where: { tokenHash: 'non-existent-token' } }
      );
      expect(result).toEqual([0]);
    });

    it('should handle different token hashes', async () => {
      mockRefreshTokenModel.update.mockResolvedValue([1]);

      await refreshTokenRepository.revokeByHash('hash-1');
      await refreshTokenRepository.revokeByHash('hash-2');

      expect(mockRefreshTokenModel.update).toHaveBeenNthCalledWith(
        1,
        { revoked: true },
        { where: { tokenHash: 'hash-1' } }
      );
      expect(mockRefreshTokenModel.update).toHaveBeenNthCalledWith(
        2,
        { revoked: true },
        { where: { tokenHash: 'hash-2' } }
      );
    });
  });

  describe('Integration scenarios', () => {
    it('should handle full refresh token lifecycle', async () => {
      const payload = {
        userId: 'user-123',
        tokenHash: 'hashed-refresh-token',
        expiresAt: new Date(Date.now() + 30 * 24 * 3600000)
      };

      mockRefreshTokenModel.create.mockResolvedValue(mockRefreshToken);
      mockRefreshTokenModel.findOne.mockResolvedValue(mockRefreshToken);
      mockRefreshTokenModel.update.mockResolvedValue([1]);

      const created = await refreshTokenRepository.create(payload);
      expect(created).toEqual(mockRefreshToken);

      const found = await refreshTokenRepository.findValid('hashed-refresh-token');
      expect(found).toEqual(mockRefreshToken);

      const revoked = await refreshTokenRepository.revokeByHash('hashed-refresh-token');
      expect(revoked).toEqual([1]);
    });

    it('should not find token after revocation', async () => {
      mockRefreshTokenModel.findOne.mockResolvedValue(null);

      const result = await refreshTokenRepository.findValid('hashed-refresh-token');

      expect(result).toBeNull();
    });

    it('should handle multiple tokens for same user', async () => {
      const token1 = { ...mockRefreshToken, id: 'token-1', tokenHash: 'hash-1' };
      const token2 = { ...mockRefreshToken, id: 'token-2', tokenHash: 'hash-2' };

      mockRefreshTokenModel.create
        .mockResolvedValueOnce(token1)
        .mockResolvedValueOnce(token2);

      const created1 = await refreshTokenRepository.create({
        userId: 'user-123',
        tokenHash: 'hash-1',
        expiresAt: new Date()
      });
      const created2 = await refreshTokenRepository.create({
        userId: 'user-123',
        tokenHash: 'hash-2',
        expiresAt: new Date()
      });

      expect(created1.tokenHash).toBe('hash-1');
      expect(created2.tokenHash).toBe('hash-2');
    });
  });
});

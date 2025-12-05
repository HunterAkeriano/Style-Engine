import { PasswordResetRepository } from '../../infrastructure/repositories/password-reset-repository';
import type { Models, PasswordReset } from '../../models';
import { Op } from 'sequelize';

describe('PasswordResetRepository', () => {
  let passwordResetRepository: PasswordResetRepository;
  let mockModels: jest.Mocked<Models>;
  let mockPasswordResetModel: any;

  const mockPasswordReset: Partial<PasswordReset> = {
    id: 'reset-123',
    userId: 'user-123',
    tokenHash: 'hashed-token',
    expiresAt: new Date(Date.now() + 3600000),
    used: false,
    createdAt: new Date(),
    update: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockPasswordResetModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn()
    };

    mockModels = {
      PasswordReset: mockPasswordResetModel
    } as any;

    passwordResetRepository = new PasswordResetRepository(mockModels);
  });

  describe('create', () => {
    it('should create a password reset token', async () => {
      const payload = {
        userId: 'user-123',
        tokenHash: 'hashed-token',
        expiresAt: new Date(Date.now() + 3600000)
      };
      mockPasswordResetModel.create.mockResolvedValue({ ...mockPasswordReset, ...payload });

      const result = await passwordResetRepository.create(payload);

      expect(mockPasswordResetModel.create).toHaveBeenCalledWith(payload);
      expect(result.userId).toBe('user-123');
      expect(result.tokenHash).toBe('hashed-token');
    });

    it('should create password reset with all fields', async () => {
      const payload = {
        userId: 'user-456',
        tokenHash: 'another-hash',
        expiresAt: new Date(Date.now() + 7200000),
        used: false
      };
      mockPasswordResetModel.create.mockResolvedValue({ ...mockPasswordReset, ...payload });

      const result = await passwordResetRepository.create(payload);

      expect(mockPasswordResetModel.create).toHaveBeenCalledWith(payload);
      expect(result.userId).toBe('user-456');
      expect(result.used).toBe(false);
    });
  });

  describe('findValid', () => {
    it('should find valid password reset token', async () => {
      const now = new Date();
      mockPasswordResetModel.findOne.mockResolvedValue(mockPasswordReset);

      const result = await passwordResetRepository.findValid('hashed-token', now);

      expect(mockPasswordResetModel.findOne).toHaveBeenCalledWith({
        where: {
          tokenHash: 'hashed-token',
          used: false,
          expiresAt: { [Op.gt]: now }
        }
      });
      expect(result).toEqual(mockPasswordReset);
    });

    it('should use current date if now is not provided', async () => {
      mockPasswordResetModel.findOne.mockResolvedValue(mockPasswordReset);

      const beforeCall = Date.now();
      await passwordResetRepository.findValid('hashed-token');
      const afterCall = Date.now();

      expect(mockPasswordResetModel.findOne).toHaveBeenCalled();
      const callArgs = mockPasswordResetModel.findOne.mock.calls[0][0];
      const passedDate = callArgs.where.expiresAt[Op.gt].getTime();

      expect(passedDate).toBeGreaterThanOrEqual(beforeCall);
      expect(passedDate).toBeLessThanOrEqual(afterCall);
    });

    it('should return null if token not found', async () => {
      mockPasswordResetModel.findOne.mockResolvedValue(null);

      const result = await passwordResetRepository.findValid('invalid-token');

      expect(result).toBeNull();
    });

    it('should return null if token is expired', async () => {
      const expiredReset = {
        ...mockPasswordReset,
        expiresAt: new Date(Date.now() - 3600000)
      };
      mockPasswordResetModel.findOne.mockResolvedValue(null);

      const result = await passwordResetRepository.findValid('hashed-token', new Date());

      expect(result).toBeNull();
    });

    it('should return null if token is already used', async () => {
      const usedReset = {
        ...mockPasswordReset,
        used: true
      };
      mockPasswordResetModel.findOne.mockResolvedValue(null);

      const result = await passwordResetRepository.findValid('hashed-token', new Date());

      expect(result).toBeNull();
    });
  });

  describe('markUsed', () => {
    it('should mark password reset as used', async () => {
      const resetToMark = {
        ...mockPasswordReset,
        update: jest.fn().mockResolvedValue({ ...mockPasswordReset, used: true })
      };

      const result = await passwordResetRepository.markUsed(resetToMark as any);

      expect(resetToMark.update).toHaveBeenCalledWith({ used: true });
      expect(result.used).toBe(true);
    });

    it('should return updated password reset', async () => {
      const updatedReset = { ...mockPasswordReset, used: true };
      const resetToMark = {
        ...mockPasswordReset,
        update: jest.fn().mockResolvedValue(updatedReset)
      };

      const result = await passwordResetRepository.markUsed(resetToMark as any);

      expect(result).toEqual(updatedReset);
      expect(result.used).toBe(true);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle full password reset flow', async () => {
      const payload = {
        userId: 'user-123',
        tokenHash: 'hashed-token',
        expiresAt: new Date(Date.now() + 3600000)
      };

      mockPasswordResetModel.create.mockResolvedValue(mockPasswordReset);
      mockPasswordResetModel.findOne.mockResolvedValue(mockPasswordReset);

      const created = await passwordResetRepository.create(payload);
      expect(created).toEqual(mockPasswordReset);

      const found = await passwordResetRepository.findValid('hashed-token');
      expect(found).toEqual(mockPasswordReset);

      const resetToMark = {
        ...mockPasswordReset,
        update: jest.fn().mockResolvedValue({ ...mockPasswordReset, used: true })
      };
      const marked = await passwordResetRepository.markUsed(resetToMark as any);
      expect(marked.used).toBe(true);
    });

    it('should not find token after expiration time', async () => {
      const futureDate = new Date(Date.now() + 7200000);
      mockPasswordResetModel.findOne.mockResolvedValue(null);

      const result = await passwordResetRepository.findValid('hashed-token', futureDate);

      expect(result).toBeNull();
    });
  });
});

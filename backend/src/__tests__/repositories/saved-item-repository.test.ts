import { SavedItemRepository } from '../../infrastructure/repositories/saved-item-repository';
import { Op, col, fn, literal, where } from 'sequelize';

describe('SavedItemRepository', () => {
  let savedItemRepository: SavedItemRepository;
  let mockModels: any;
  let mockEnv: { SUPER_ADMIN_EMAIL: string };

  const mockUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    avatarUrl: null
  };

  const mockSavedGradient = {
    id: 'gradient-123',
    userId: 'user-123',
    data: { colors: ['#ff0000', '#00ff00'] },
    status: 'pending',
    isFeatured: false,
    createdAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockEnv = {
      SUPER_ADMIN_EMAIL: 'admin@example.com'
    };

    const createMockModel = () => ({
      count: jest.fn() as jest.MockedFunction<any>,
      findAll: jest.fn() as jest.MockedFunction<any>,
      create: jest.fn() as jest.MockedFunction<any>,
      findOne: jest.fn() as jest.MockedFunction<any>,
      destroy: jest.fn() as jest.MockedFunction<any>
    });

    mockModels = {
      SavedGradient: createMockModel(),
      SavedShadow: createMockModel(),
      SavedAnimation: createMockModel(),
      SavedClipPath: createMockModel(),
      SavedFavicon: createMockModel(),
      User: {} as any
    } as any;

    savedItemRepository = new SavedItemRepository(mockModels, mockEnv);
  });

  describe('countByUser', () => {
    it('should count all saved items for a user', async () => {
      mockModels.SavedGradient.count.mockResolvedValue(5);
      mockModels.SavedShadow.count.mockResolvedValue(3);
      mockModels.SavedAnimation.count.mockResolvedValue(2);
      mockModels.SavedClipPath.count.mockResolvedValue(1);
      mockModels.SavedFavicon.count.mockResolvedValue(4);

      const result = await savedItemRepository.countByUser('user-123');

      expect(mockModels.SavedGradient.count).toHaveBeenCalledWith({ where: { userId: 'user-123' } });
      expect(mockModels.SavedShadow.count).toHaveBeenCalledWith({ where: { userId: 'user-123' } });
      expect(mockModels.SavedAnimation.count).toHaveBeenCalledWith({ where: { userId: 'user-123' } });
      expect(mockModels.SavedClipPath.count).toHaveBeenCalledWith({ where: { userId: 'user-123' } });
      expect(mockModels.SavedFavicon.count).toHaveBeenCalledWith({ where: { userId: 'user-123' } });
      expect(result).toBe(15);
    });

    it('should return 0 if user has no saved items', async () => {
      mockModels.SavedGradient.count.mockResolvedValue(0);
      mockModels.SavedShadow.count.mockResolvedValue(0);
      mockModels.SavedAnimation.count.mockResolvedValue(0);
      mockModels.SavedClipPath.count.mockResolvedValue(0);
      mockModels.SavedFavicon.count.mockResolvedValue(0);

      const result = await savedItemRepository.countByUser('user-456');

      expect(result).toBe(0);
    });

    it('should handle different user IDs', async () => {
      mockModels.SavedGradient.count.mockResolvedValue(10);
      mockModels.SavedShadow.count.mockResolvedValue(0);
      mockModels.SavedAnimation.count.mockResolvedValue(0);
      mockModels.SavedClipPath.count.mockResolvedValue(0);
      mockModels.SavedFavicon.count.mockResolvedValue(0);

      const result = await savedItemRepository.countByUser('user-789');

      expect(result).toBe(10);
    });
  });

  describe('findAllByUser', () => {
    it('should find all gradients for a user', async () => {
      const mockGradients = [mockSavedGradient, { ...mockSavedGradient, id: 'gradient-456' }];
      mockModels.SavedGradient.findAll.mockResolvedValue(mockGradients);

      const result = await savedItemRepository.findAllByUser('gradient', 'user-123');

      expect(mockModels.SavedGradient.findAll).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        order: [['createdAt', 'DESC']]
      });
      expect(result).toEqual(mockGradients);
    });

    it('should find all shadows for a user', async () => {
      const mockShadows = [{ id: 'shadow-123', userId: 'user-123' }];
      mockModels.SavedShadow.findAll.mockResolvedValue(mockShadows);

      const result = await savedItemRepository.findAllByUser('shadow', 'user-123');

      expect(mockModels.SavedShadow.findAll).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        order: [['createdAt', 'DESC']]
      });
      expect(result).toEqual(mockShadows);
    });

    it('should find all animations for a user', async () => {
      const mockAnimations = [{ id: 'animation-123', userId: 'user-123' }];
      mockModels.SavedAnimation.findAll.mockResolvedValue(mockAnimations);

      const result = await savedItemRepository.findAllByUser('animation', 'user-123');

      expect(mockModels.SavedAnimation.findAll).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        order: [['createdAt', 'DESC']]
      });
      expect(result).toEqual(mockAnimations);
    });

    it('should find all clip-paths for a user', async () => {
      const mockClipPaths = [{ id: 'clip-123', userId: 'user-123' }];
      mockModels.SavedClipPath.findAll.mockResolvedValue(mockClipPaths);

      const result = await savedItemRepository.findAllByUser('clip-path', 'user-123');

      expect(mockModels.SavedClipPath.findAll).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        order: [['createdAt', 'DESC']]
      });
      expect(result).toEqual(mockClipPaths);
    });

    it('should find all favicons for a user', async () => {
      const mockFavicons = [{ id: 'favicon-123', userId: 'user-123' }];
      mockModels.SavedFavicon.findAll.mockResolvedValue(mockFavicons);

      const result = await savedItemRepository.findAllByUser('favicon', 'user-123');

      expect(mockModels.SavedFavicon.findAll).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        order: [['createdAt', 'DESC']]
      });
      expect(result).toEqual(mockFavicons);
    });

    it('should return empty array if user has no items', async () => {
      mockModels.SavedGradient.findAll.mockResolvedValue([]);

      const result = await savedItemRepository.findAllByUser('gradient', 'user-456');

      expect(result).toEqual([]);
    });
  });

  describe('findAllByStatus', () => {
    it('should find all items by status', async () => {
      const mockGradients = [mockSavedGradient];
      mockModels.SavedGradient.findAll.mockResolvedValue(mockGradients);

      const result = await savedItemRepository.findAllByStatus('gradient', 'pending');

      expect(mockModels.SavedGradient.findAll).toHaveBeenCalledWith({
        where: { status: 'pending' },
        order: [['createdAt', 'DESC']]
      });
      expect(result).toEqual(mockGradients);
    });

    it('should find approved items', async () => {
      const approvedGradient = { ...mockSavedGradient, status: 'approved' };
      mockModels.SavedGradient.findAll.mockResolvedValue([approvedGradient]);

      const result = await savedItemRepository.findAllByStatus('gradient', 'approved');

      expect(mockModels.SavedGradient.findAll).toHaveBeenCalledWith({
        where: { status: 'approved' },
        order: [['createdAt', 'DESC']]
      });
      expect(result[0].status).toBe('approved');
    });

    it('should find rejected items', async () => {
      const rejectedShadow = { id: 'shadow-123', status: 'rejected' };
      mockModels.SavedShadow.findAll.mockResolvedValue([rejectedShadow]);

      const result = await savedItemRepository.findAllByStatus('shadow', 'rejected');

      expect(result[0].status).toBe('rejected');
    });
  });

  describe('findPublic', () => {
    it('should find public gradients excluding super admin', async () => {
      const mockGradients = [
        { ...mockSavedGradient, status: 'approved', user: mockUser }
      ];
      mockModels.SavedGradient.findAll.mockResolvedValue(mockGradients);

      const result = await savedItemRepository.findPublic('gradient');

      expect(mockModels.SavedGradient.findAll).toHaveBeenCalledWith({
        where: {
          status: 'approved',
          [Op.and]: [
            {
              [Op.or]: [
                { '$user.email$': null },
                where(fn('LOWER', col('user.email')), { [Op.ne]: 'admin@example.com' })
              ]
            }
          ]
        },
        include: [
          {
            model: mockModels.User,
            as: 'user',
            attributes: ['name', 'email', 'avatarUrl'],
            required: false
          }
        ],
        order: [
          ['isFeatured', 'DESC'],
          [literal('"approved_at"'), 'DESC'],
          ['createdAt', 'DESC']
        ],
        limit: 50
      });
      expect(result).toEqual(mockGradients);
    });

    it('should find public clip-paths without user filter', async () => {
      const mockClipPaths = [
        { id: 'clip-123', status: 'approved', user: mockUser }
      ];
      mockModels.SavedClipPath.findAll.mockResolvedValue(mockClipPaths);

      const result = await savedItemRepository.findPublic('clip-path');

      expect(mockModels.SavedClipPath.findAll).toHaveBeenCalledWith({
        where: { status: 'approved' },
        include: [
          {
            model: mockModels.User,
            as: 'user',
            attributes: ['name', 'email', 'avatarUrl'],
            required: false
          }
        ],
        order: [
          ['isFeatured', 'DESC'],
          [literal('"approved_at"'), 'DESC'],
          ['createdAt', 'DESC']
        ],
        limit: 50
      });
      expect(result).toEqual(mockClipPaths);
    });

    it('should order by featured, approved_at, and createdAt', async () => {
      mockModels.SavedShadow.findAll.mockResolvedValue([]);

      await savedItemRepository.findPublic('shadow');

      const callArgs = mockModels.SavedShadow.findAll.mock.calls[0][0];
      expect(callArgs.order).toEqual([
        ['isFeatured', 'DESC'],
        [literal('"approved_at"'), 'DESC'],
        ['createdAt', 'DESC']
      ]);
    });

    it('should limit results to 50', async () => {
      mockModels.SavedAnimation.findAll.mockResolvedValue([]);

      await savedItemRepository.findPublic('animation');

      const callArgs = mockModels.SavedAnimation.findAll.mock.calls[0][0];
      expect(callArgs.limit).toBe(50);
    });

    it('should include user information', async () => {
      mockModels.SavedFavicon.findAll.mockResolvedValue([]);

      await savedItemRepository.findPublic('favicon');

      const callArgs = mockModels.SavedFavicon.findAll.mock.calls[0][0];
      expect(callArgs.include).toEqual([
        {
          model: mockModels.User,
          as: 'user',
          attributes: ['name', 'email', 'avatarUrl'],
          required: false
        }
      ]);
    });
  });

  describe('create', () => {
    it('should create a gradient', async () => {
      const payload = {
        userId: 'user-123',
        data: { colors: ['#ff0000', '#00ff00'] },
        status: 'pending'
      };
      mockModels.SavedGradient.create.mockResolvedValue({ ...mockSavedGradient, ...payload });

      const result = await savedItemRepository.create('gradient', payload);

      expect(mockModels.SavedGradient.create).toHaveBeenCalledWith(payload);
      expect(result.userId).toBe('user-123');
    });

    it('should create a shadow', async () => {
      const payload = { userId: 'user-123', data: { x: 10, y: 10 }, status: 'pending' };
      mockModels.SavedShadow.create.mockResolvedValue(payload);

      await savedItemRepository.create('shadow', payload);

      expect(mockModels.SavedShadow.create).toHaveBeenCalledWith(payload);
    });

    it('should create an animation', async () => {
      const payload = { userId: 'user-123', data: { duration: 1000 }, status: 'pending' };
      mockModels.SavedAnimation.create.mockResolvedValue(payload);

      await savedItemRepository.create('animation', payload);

      expect(mockModels.SavedAnimation.create).toHaveBeenCalledWith(payload);
    });

    it('should create a clip-path', async () => {
      const payload = { userId: 'user-123', data: { path: 'M0 0' }, status: 'pending' };
      mockModels.SavedClipPath.create.mockResolvedValue(payload);

      await savedItemRepository.create('clip-path', payload);

      expect(mockModels.SavedClipPath.create).toHaveBeenCalledWith(payload);
    });

    it('should create a favicon', async () => {
      const payload = { userId: 'user-123', data: { size: 32 }, status: 'pending' };
      mockModels.SavedFavicon.create.mockResolvedValue(payload);

      await savedItemRepository.create('favicon', payload);

      expect(mockModels.SavedFavicon.create).toHaveBeenCalledWith(payload);
    });
  });

  describe('findOne', () => {
    it('should find one gradient by criteria', async () => {
      mockModels.SavedGradient.findOne.mockResolvedValue(mockSavedGradient);

      const result = await savedItemRepository.findOne('gradient', { id: 'gradient-123' });

      expect(mockModels.SavedGradient.findOne).toHaveBeenCalledWith({
        where: { id: 'gradient-123' }
      });
      expect(result).toEqual(mockSavedGradient);
    });

    it('should find one item by multiple criteria', async () => {
      mockModels.SavedShadow.findOne.mockResolvedValue({ id: 'shadow-123', userId: 'user-123' });

      await savedItemRepository.findOne('shadow', {
        id: 'shadow-123',
        userId: 'user-123'
      });

      expect(mockModels.SavedShadow.findOne).toHaveBeenCalledWith({
        where: { id: 'shadow-123', userId: 'user-123' }
      });
    });

    it('should return null if item not found', async () => {
      mockModels.SavedGradient.findOne.mockResolvedValue(null);

      const result = await savedItemRepository.findOne('gradient', { id: 'non-existent' });

      expect(result).toBeNull();
    });
  });

  describe('destroy', () => {
    it('should destroy gradient by criteria', async () => {
      mockModels.SavedGradient.destroy.mockResolvedValue(1);

      const result = await savedItemRepository.destroy('gradient', { id: 'gradient-123' });

      expect(mockModels.SavedGradient.destroy).toHaveBeenCalledWith({
        where: { id: 'gradient-123' }
      });
      expect(result).toBe(1);
    });

    it('should destroy items by multiple criteria', async () => {
      mockModels.SavedShadow.destroy.mockResolvedValue(5);

      const result = await savedItemRepository.destroy('shadow', {
        userId: 'user-123',
        status: 'pending'
      });

      expect(mockModels.SavedShadow.destroy).toHaveBeenCalledWith({
        where: { userId: 'user-123', status: 'pending' }
      });
      expect(result).toBe(5);
    });

    it('should return 0 if no items destroyed', async () => {
      mockModels.SavedAnimation.destroy.mockResolvedValue(0);

      const result = await savedItemRepository.destroy('animation', { id: 'non-existent' });

      expect(result).toBe(0);
    });
  });
});

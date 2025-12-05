import { UserRepository } from '../../infrastructure/repositories/user-repository';
import type { Models, User } from '../../models';
import { Op } from 'sequelize';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockModels: jest.Mocked<Models>;
  let mockUserModel: any;

  const mockUser: Partial<User> = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: 'hashed-password',
    isAdmin: false,
    subscriptionTier: 'free',
    createdAt: new Date(),
    updatedAt: new Date(),
    update: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserModel = {
      findByPk: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      findAndCountAll: jest.fn()
    };

    mockModels = {
      User: mockUserModel
    } as any;

    userRepository = new UserRepository(mockModels);
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      mockUserModel.findByPk.mockResolvedValue(mockUser);

      const result = await userRepository.findById('user-123');

      expect(mockUserModel.findByPk).toHaveBeenCalledWith('user-123', { attributes: undefined });
      expect(result).toEqual(mockUser);
    });

    it('should find user by id with specific attributes', async () => {
      mockUserModel.findByPk.mockResolvedValue({ id: 'user-123', email: 'test@example.com' });

      const result = await userRepository.findById('user-123', ['id', 'email']);

      expect(mockUserModel.findByPk).toHaveBeenCalledWith('user-123', { attributes: ['id', 'email'] });
      expect(result).toEqual({ id: 'user-123', email: 'test@example.com' });
    });

    it('should return null if user not found', async () => {
      mockUserModel.findByPk.mockResolvedValue(null);

      const result = await userRepository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findByEmail('test@example.com');

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        attributes: undefined
      });
      expect(result).toEqual(mockUser);
    });

    it('should lowercase email before search', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await userRepository.findByEmail('TEST@EXAMPLE.COM');

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        attributes: undefined
      });
    });

    it('should find user by email with specific attributes', async () => {
      mockUserModel.findOne.mockResolvedValue({ id: 'user-123', email: 'test@example.com' });

      const result = await userRepository.findByEmail('test@example.com', ['id', 'email']);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        attributes: ['id', 'email']
      });
      expect(result).toEqual({ id: 'user-123', email: 'test@example.com' });
    });

    it('should return null if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await userRepository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'new@example.com',
        name: 'New User',
        passwordHash: 'hashed-password'
      };
      mockUserModel.create.mockResolvedValue({ ...mockUser, ...newUser });

      const result = await userRepository.create(newUser);

      expect(mockUserModel.create).toHaveBeenCalledWith(newUser);
      expect(result.email).toBe('new@example.com');
      expect(result.name).toBe('New User');
    });

    it('should create user with partial data', async () => {
      const minimalUser = {
        email: 'minimal@example.com',
        passwordHash: 'hash'
      };
      mockUserModel.create.mockResolvedValue({ ...mockUser, ...minimalUser });

      const result = await userRepository.create(minimalUser);

      expect(mockUserModel.create).toHaveBeenCalledWith(minimalUser);
      expect(result.email).toBe('minimal@example.com');
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const userToUpdate = { ...mockUser, update: jest.fn().mockResolvedValue({ ...mockUser, name: 'Updated Name' }) };
      const patch = { name: 'Updated Name' };

      const result = await userRepository.update(userToUpdate as any, patch);

      expect(userToUpdate.update).toHaveBeenCalledWith(patch);
      expect(result.name).toBe('Updated Name');
    });

    it('should update multiple fields', async () => {
      const userToUpdate = {
        ...mockUser,
        update: jest.fn().mockResolvedValue({ ...mockUser, name: 'New Name', isAdmin: true })
      };
      const patch = { name: 'New Name', isAdmin: true };

      const result = await userRepository.update(userToUpdate as any, patch);

      expect(userToUpdate.update).toHaveBeenCalledWith(patch);
      expect(result.name).toBe('New Name');
      expect(result.isAdmin).toBe(true);
    });
  });

  describe('countById', () => {
    it('should count users by id', async () => {
      mockUserModel.count.mockResolvedValue(1);

      const result = await userRepository.countById('user-123');

      expect(mockUserModel.count).toHaveBeenCalledWith({ where: { id: 'user-123' } });
      expect(result).toBe(1);
    });

    it('should return 0 if user not found', async () => {
      mockUserModel.count.mockResolvedValue(0);

      const result = await userRepository.countById('non-existent');

      expect(result).toBe(0);
    });
  });

  describe('findUsers', () => {
    it('should find users without search', async () => {
      const mockResult = {
        count: 2,
        rows: [mockUser, { ...mockUser, id: 'user-456' }]
      };
      mockUserModel.findAndCountAll.mockResolvedValue(mockResult);

      const result = await userRepository.findUsers({});

      expect(mockUserModel.findAndCountAll).toHaveBeenCalledWith({
        where: undefined,
        order: [['createdAt', 'DESC']],
        limit: undefined,
        offset: undefined,
        attributes: undefined
      });
      expect(result).toEqual(mockResult);
    });

    it('should find users with search query', async () => {
      const mockResult = {
        count: 1,
        rows: [mockUser]
      };
      mockUserModel.findAndCountAll.mockResolvedValue(mockResult);

      const result = await userRepository.findUsers({ search: 'test' });

      expect(mockUserModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { email: { [Op.iLike]: '%test%' } },
            { name: { [Op.iLike]: '%test%' } }
          ]
        },
        order: [['createdAt', 'DESC']],
        limit: undefined,
        offset: undefined,
        attributes: undefined
      });
      expect(result).toEqual(mockResult);
    });

    it('should find users with pagination', async () => {
      const mockResult = {
        count: 100,
        rows: [mockUser]
      };
      mockUserModel.findAndCountAll.mockResolvedValue(mockResult);

      const result = await userRepository.findUsers({ limit: 10, offset: 20 });

      expect(mockUserModel.findAndCountAll).toHaveBeenCalledWith({
        where: undefined,
        order: [['createdAt', 'DESC']],
        limit: 10,
        offset: 20,
        attributes: undefined
      });
      expect(result).toEqual(mockResult);
    });

    it('should find users with specific attributes', async () => {
      const mockResult = {
        count: 1,
        rows: [{ id: 'user-123', email: 'test@example.com' }]
      };
      mockUserModel.findAndCountAll.mockResolvedValue(mockResult);

      const result = await userRepository.findUsers({ attributes: ['id', 'email'] });

      expect(mockUserModel.findAndCountAll).toHaveBeenCalledWith({
        where: undefined,
        order: [['createdAt', 'DESC']],
        limit: undefined,
        offset: undefined,
        attributes: ['id', 'email']
      });
      expect(result).toEqual(mockResult);
    });

    it('should find users with all options combined', async () => {
      const mockResult = {
        count: 50,
        rows: [{ id: 'user-123', email: 'test@example.com' }]
      };
      mockUserModel.findAndCountAll.mockResolvedValue(mockResult);

      const result = await userRepository.findUsers({
        search: 'test',
        limit: 25,
        offset: 10,
        attributes: ['id', 'email']
      });

      expect(mockUserModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { email: { [Op.iLike]: '%test%' } },
            { name: { [Op.iLike]: '%test%' } }
          ]
        },
        order: [['createdAt', 'DESC']],
        limit: 25,
        offset: 10,
        attributes: ['id', 'email']
      });
      expect(result).toEqual(mockResult);
    });
  });
});

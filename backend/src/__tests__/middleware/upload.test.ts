// @ts-nocheck
import multer from 'multer';
import path from 'path';
import { Request } from 'express';

jest.mock('multer');

describe('Upload Middleware', () => {
  let mockDiskStorage: jest.Mock;
  let storageConfig: any;
  let fileFilterConfig: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDiskStorage = jest.fn((config) => {
      storageConfig = config;
      return 'mock-storage';
    });
    (multer.diskStorage as jest.Mock) = mockDiskStorage;
    (multer as any).mockImplementation = jest.fn((config) => {
      fileFilterConfig = config.fileFilter;
      return 'mock-upload';
    });

    delete require.cache[require.resolve('../../middleware/upload')];
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('storage configuration', () => {
    it('should configure disk storage', () => {
      require('../../middleware/upload');
      expect(mockDiskStorage).toHaveBeenCalled();
    });

    it('should set destination to uploads/avatars directory', () => {
      require('../../middleware/upload');
      const cb = jest.fn();
      storageConfig.destination({}, {}, cb);

      expect(cb).toHaveBeenCalledWith(null, expect.stringContaining('uploads/avatars'));
    });

    it('should generate unique filename with timestamp', () => {
      const mockDate = 1234567890;
      const mockRandom = 0.5;
      jest.spyOn(Date, 'now').mockReturnValue(mockDate);
      jest.spyOn(Math, 'random').mockReturnValue(mockRandom);

      require('../../middleware/upload');
      const cb = jest.fn();
      const file = { originalname: 'test.jpg' };

      storageConfig.filename({}, file, cb);

      const expectedSuffix = `${mockDate}-${Math.round(mockRandom * 1e9)}`;
      expect(cb).toHaveBeenCalledWith(null, `avatar-${expectedSuffix}.jpg`);

      jest.restoreAllMocks();
    });

    it('should preserve file extension in filename', () => {
      require('../../middleware/upload');
      const cb = jest.fn();

      const extensions = ['.jpg', '.png', '.gif', '.jpeg'];
      extensions.forEach((ext) => {
        cb.mockClear();
        const file = { originalname: `test${ext}` };
        storageConfig.filename({}, file, cb);

        const filename = cb.mock.calls[0][1];
        expect(filename).toMatch(new RegExp(`\\${ext}$`));
      });
    });

    it('should handle files without extension', () => {
      require('../../middleware/upload');
      const cb = jest.fn();
      const file = { originalname: 'test' };

      storageConfig.filename({}, file, cb);

      const filename = cb.mock.calls[0][1];
      expect(filename).toMatch(/^avatar-\d+-\d+$/);
    });

    it('should handle files with multiple dots in name', () => {
      require('../../middleware/upload');
      const cb = jest.fn();
      const file = { originalname: 'my.test.file.png' };

      storageConfig.filename({}, file, cb);

      const filename = cb.mock.calls[0][1];
      expect(filename).toMatch(/^avatar-\d+-\d+\.png$/);
    });
  });

  describe('fileFilter configuration', () => {
    beforeEach(() => {
      const multerMock = jest.fn((config) => {
        fileFilterConfig = config.fileFilter;
        return 'mock-upload';
      });
      (multer as any) = Object.assign(multerMock, { diskStorage: mockDiskStorage });
      require('../../middleware/upload');
    });

    it('should accept JPEG files', () => {
      const cb = jest.fn();
      const file = { mimetype: 'image/jpeg' } as Express.Multer.File;

      fileFilterConfig({} as Request, file, cb);

      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('should accept JPG files', () => {
      const cb = jest.fn();
      const file = { mimetype: 'image/jpg' } as Express.Multer.File;

      fileFilterConfig({} as Request, file, cb);

      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('should accept PNG files', () => {
      const cb = jest.fn();
      const file = { mimetype: 'image/png' } as Express.Multer.File;

      fileFilterConfig({} as Request, file, cb);

      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('should accept GIF files', () => {
      const cb = jest.fn();
      const file = { mimetype: 'image/gif' } as Express.Multer.File;

      fileFilterConfig({} as Request, file, cb);

      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('should reject PDF files', () => {
      const cb = jest.fn();
      const file = { mimetype: 'application/pdf' } as Express.Multer.File;

      fileFilterConfig({} as Request, file, cb);

      expect(cb).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid file type. Only JPEG, PNG and GIF are allowed.'
        })
      );
    });

    it('should reject SVG files', () => {
      const cb = jest.fn();
      const file = { mimetype: 'image/svg+xml' } as Express.Multer.File;

      fileFilterConfig({} as Request, file, cb);

      expect(cb).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid file type. Only JPEG, PNG and GIF are allowed.'
        })
      );
    });

    it('should reject text files', () => {
      const cb = jest.fn();
      const file = { mimetype: 'text/plain' } as Express.Multer.File;

      fileFilterConfig({} as Request, file, cb);

      expect(cb).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid file type. Only JPEG, PNG and GIF are allowed.'
        })
      );
    });

    it('should reject video files', () => {
      const cb = jest.fn();
      const file = { mimetype: 'video/mp4' } as Express.Multer.File;

      fileFilterConfig({} as Request, file, cb);

      expect(cb).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid file type. Only JPEG, PNG and GIF are allowed.'
        })
      );
    });

    it('should reject executable files', () => {
      const cb = jest.fn();
      const file = { mimetype: 'application/x-msdownload' } as Express.Multer.File;

      fileFilterConfig({} as Request, file, cb);

      expect(cb).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid file type. Only JPEG, PNG and GIF are allowed.'
        })
      );
    });

    it('should reject files with invalid mimetype', () => {
      const cb = jest.fn();
      const file = { mimetype: 'invalid/mimetype' } as Express.Multer.File;

      fileFilterConfig({} as Request, file, cb);

      expect(cb).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid file type. Only JPEG, PNG and GIF are allowed.'
        })
      );
    });
  });

  describe('multer configuration', () => {
    it('should configure multer with storage, fileFilter and limits', () => {
      const multerSpy = jest.fn(() => 'mock-upload');
      (multer as any) = Object.assign(multerSpy, { diskStorage: mockDiskStorage });

      require('../../middleware/upload');

      expect(multerSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          storage: 'mock-storage',
          fileFilter: expect.any(Function),
          limits: expect.objectContaining({
            fileSize: 2 * 1024 * 1024
          })
        })
      );
    });

    it('should set file size limit to 2MB', () => {
      const multerSpy = jest.fn(() => 'mock-upload');
      (multer as any) = Object.assign(multerSpy, { diskStorage: mockDiskStorage });

      require('../../middleware/upload');

      const config = multerSpy.mock.calls[0][0];
      expect(config.limits.fileSize).toBe(2097152);
    });
  });

  describe('filename uniqueness', () => {
    it('should generate different filenames for same original file', () => {
      require('../../middleware/upload');
      const cb1 = jest.fn();
      const cb2 = jest.fn();
      const file = { originalname: 'test.jpg' };

      storageConfig.filename({}, file, cb1);
      jest.advanceTimersByTime(1);
      storageConfig.filename({}, file, cb2);

      const filename1 = cb1.mock.calls[0][1];
      const filename2 = cb2.mock.calls[0][1];

      expect(filename1).not.toBe(filename2);
    });
  });

  describe('path handling', () => {
    it('should use path.join for destination', () => {
      const joinSpy = jest.spyOn(path, 'join');
      require('../../middleware/upload');
      const cb = jest.fn();

      storageConfig.destination({}, {}, cb);

      expect(joinSpy).toHaveBeenCalled();
      joinSpy.mockRestore();
    });

    it('should use path.extname for file extension', () => {
      const extnameSpy = jest.spyOn(path, 'extname');
      require('../../middleware/upload');
      const cb = jest.fn();
      const file = { originalname: 'test.jpg' };

      storageConfig.filename({}, file, cb);

      expect(extnameSpy).toHaveBeenCalledWith('test.jpg');
      extnameSpy.mockRestore();
    });
  });
});

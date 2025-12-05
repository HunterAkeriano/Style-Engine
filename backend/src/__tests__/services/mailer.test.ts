// @ts-nocheck
import fs from 'fs';
import nodemailer from 'nodemailer';
import { initMailer, sendMail } from '../../services/mailer';
import type { Env } from '../../config/env';

jest.mock('nodemailer');
jest.mock('fs');

describe('Mailer Service', () => {
  let mockEnv: Env;
  let mockTransporter: any;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    mockEnv = {
      DATABASE_URL: 'postgres://test',
      JWT_SECRET: 'test-secret-min-12',
      NODE_ENV: 'test',
      SUPER_ADMIN_EMAIL: 'admin@test.com',
      SUPER_ADMIN_PASSWORD: 'password123',
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: '587',
      SMTP_USER: 'user@example.com',
      SMTP_PASS: 'password',
      SMTP_FROM: 'noreply@example.com'
    };

    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({
        messageId: 'test-message-id'
      })
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
    (nodemailer.getTestMessageUrl as jest.Mock).mockReturnValue(null);

    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    fs.promises = {
      mkdir: jest.fn().mockResolvedValue(undefined),
      writeFile: jest.fn().mockResolvedValue(undefined)
    } as any;
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('initMailer', () => {
    it('should create transporter with full SMTP config', () => {
      const { initMailer } = require('../../services/mailer');
      const result = initMailer(mockEnv);

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'user@example.com',
          pass: 'password'
        }
      });
      expect(result).toBe(mockTransporter);
    });

    it('should use secure connection for port 465', () => {
      const { initMailer } = require('../../services/mailer');
      mockEnv.SMTP_PORT = '465';

      initMailer(mockEnv);

      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          port: 465,
          secure: true
        })
      );
    });

    it('should use non-secure connection for port 587', () => {
      const { initMailer } = require('../../services/mailer');
      mockEnv.SMTP_PORT = '587';

      initMailer(mockEnv);

      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          port: 587,
          secure: false
        })
      );
    });

    it('should return null and warn if SMTP_HOST is missing', () => {
      const { initMailer } = require('../../services/mailer');
      delete mockEnv.SMTP_HOST;

      const result = initMailer(mockEnv);

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('SMTP not fully configured')
      );
      expect(nodemailer.createTransport).not.toHaveBeenCalled();
    });

    it('should return null and warn if SMTP_PORT is missing', () => {
      const { initMailer } = require('../../services/mailer');
      delete mockEnv.SMTP_PORT;

      const result = initMailer(mockEnv);

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should return null and warn if SMTP_USER is missing', () => {
      const { initMailer } = require('../../services/mailer');
      delete mockEnv.SMTP_USER;

      const result = initMailer(mockEnv);

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should return null and warn if SMTP_PASS is missing', () => {
      const { initMailer } = require('../../services/mailer');
      delete mockEnv.SMTP_PASS;

      const result = initMailer(mockEnv);

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should return null and warn if SMTP_FROM is missing', () => {
      const { initMailer } = require('../../services/mailer');
      delete mockEnv.SMTP_FROM;

      const result = initMailer(mockEnv);

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe('sendMail', () => {
    it('should send email via transporter when configured', async () => {
      const { initMailer, sendMail } = require('../../services/mailer');
      initMailer(mockEnv);

      await sendMail(mockEnv, {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test body'
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'noreply@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test body',
        html: 'Test body'
      });
    });

    it('should use HTML when provided', async () => {
      const { initMailer, sendMail } = require('../../services/mailer');
      initMailer(mockEnv);

      await sendMail(mockEnv, {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Plain text',
        html: '<p>HTML content</p>'
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: '<p>HTML content</p>'
        })
      );
    });

    it('should log preview URL when available', async () => {
      const { initMailer, sendMail } = require('../../services/mailer');
      (nodemailer.getTestMessageUrl as jest.Mock).mockReturnValue('http://preview.url');
      initMailer(mockEnv);

      await sendMail(mockEnv, {
        to: 'recipient@example.com',
        subject: 'Test',
        text: 'Test'
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('Preview email at:', 'http://preview.url');
    });

    it('should log email to file when no transporter', async () => {
      const { sendMail } = require('../../services/mailer');

      await sendMail(undefined, {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test body'
      });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Email (log only):',
        expect.objectContaining({
          to: 'recipient@example.com',
          subject: 'Test Subject'
        })
      );
      expect(fs.promises.writeFile).toHaveBeenCalled();
    });

    it('should log email to file when SMTP_FROM is missing', async () => {
      const { sendMail } = require('../../services/mailer');
      const envWithoutFrom = { ...mockEnv };
      delete envWithoutFrom.SMTP_FROM;

      await sendMail(envWithoutFrom, {
        to: 'recipient@example.com',
        subject: 'Test',
        text: 'Test'
      });

      expect(fs.promises.writeFile).toHaveBeenCalled();
    });

    it('should fall back to file logging when sendMail fails', async () => {
      const { initMailer, sendMail } = require('../../services/mailer');
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP error'));
      initMailer(mockEnv);

      await sendMail(mockEnv, {
        to: 'recipient@example.com',
        subject: 'Test',
        text: 'Test'
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to send email'),
        expect.any(Error)
      );
      expect(fs.promises.writeFile).toHaveBeenCalled();
    });

    it('should create emails directory if it does not exist', async () => {
      const { sendMail } = require('../../services/mailer');

      await sendMail(undefined, {
        to: 'test@example.com',
        subject: 'Test',
        text: 'Test'
      });

      expect(fs.promises.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('emails'),
        { recursive: true }
      );
    });

    it('should write text email to file', async () => {
      const { sendMail } = require('../../services/mailer');

      await sendMail(undefined, {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Email body'
      });

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('.txt'),
        expect.stringContaining('To: test@example.com'),
        'utf8'
      );
    });

    it('should write HTML email to file when HTML provided', async () => {
      const { sendMail } = require('../../services/mailer');

      await sendMail(undefined, {
        to: 'test@example.com',
        subject: 'Test',
        text: 'Plain',
        html: '<p>HTML</p>'
      });

      const writeFileCalls = (fs.promises.writeFile as jest.Mock).mock.calls;
      const htmlCall = writeFileCalls.find(call => call[0].endsWith('.html'));
      expect(htmlCall).toBeDefined();
      expect(htmlCall[1]).toBe('<p>HTML</p>');
    });

    it('should sanitize email address in filename', async () => {
      const { sendMail } = require('../../services/mailer');

      await sendMail(undefined, {
        to: 'test+tag@example.com',
        subject: 'Test',
        text: 'Test'
      });

      const writeFileCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
      const filename = writeFileCall[0];
      expect(filename).toContain('test+tag@example.com');
    });

    it('should handle file write errors gracefully', async () => {
      const { sendMail } = require('../../services/mailer');
      (fs.promises.writeFile as jest.Mock).mockRejectedValue(new Error('Disk full'));

      await sendMail(undefined, {
        to: 'test@example.com',
        subject: 'Test',
        text: 'Test'
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to write email'),
        expect.any(Error)
      );
    });

    it('should handle mkdir errors gracefully', async () => {
      const { sendMail } = require('../../services/mailer');
      (fs.promises.mkdir as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      await sendMail(undefined, {
        to: 'test@example.com',
        subject: 'Test',
        text: 'Test'
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe('getTransport', () => {
    it('should return existing transporter if available', async () => {
      const { initMailer, sendMail } = require('../../services/mailer');
      initMailer(mockEnv);

      await sendMail(mockEnv, {
        to: 'test@example.com',
        subject: 'Test',
        text: 'Test'
      });

      expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
    });

    it('should create test account when no SMTP config', async () => {
      const { sendMail } = require('../../services/mailer');
      const mockTestAccount = {
        user: 'testuser',
        pass: 'testpass',
        smtp: {
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false
        }
      };
      (nodemailer.createTestAccount as jest.Mock).mockResolvedValue(mockTestAccount);

      await sendMail({} as Env, {
        to: 'test@example.com',
        subject: 'Test',
        text: 'Test'
      });

      expect(nodemailer.createTestAccount).toHaveBeenCalled();
    });

    it('should reuse test account promise', async () => {
      const { sendMail } = require('../../services/mailer');
      const mockTestAccount = {
        user: 'testuser',
        pass: 'testpass',
        smtp: {
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false
        }
      };
      (nodemailer.createTestAccount as jest.Mock).mockResolvedValue(mockTestAccount);

      await sendMail({} as Env, {
        to: 'test1@example.com',
        subject: 'Test',
        text: 'Test'
      });

      await sendMail({} as Env, {
        to: 'test2@example.com',
        subject: 'Test',
        text: 'Test'
      });

      expect(nodemailer.createTestAccount).toHaveBeenCalledTimes(1);
    });

    it('should handle test account creation failure', async () => {
      const { sendMail } = require('../../services/mailer');
      (nodemailer.createTestAccount as jest.Mock).mockRejectedValue(new Error('Network error'));

      await sendMail({} as Env, {
        to: 'test@example.com',
        subject: 'Test',
        text: 'Test'
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create test account'),
        expect.any(Error)
      );
      expect(fs.promises.writeFile).toHaveBeenCalled();
    });
  });
});

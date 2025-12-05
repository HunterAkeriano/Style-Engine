import { parseCookies, serializeCookie } from '../../utils/cookies';

describe('Cookies Utils', () => {
  describe('parseCookies', () => {
    it('should return empty object for undefined cookie header', () => {
      const result = parseCookies(undefined);
      expect(result).toEqual({});
    });

    it('should return empty object for empty string', () => {
      const result = parseCookies('');
      expect(result).toEqual({});
    });

    it('should parse single cookie', () => {
      const result = parseCookies('sessionId=abc123');
      expect(result).toEqual({ sessionId: 'abc123' });
    });

    it('should parse multiple cookies', () => {
      const result = parseCookies('sessionId=abc123; userId=user-456; theme=dark');
      expect(result).toEqual({
        sessionId: 'abc123',
        userId: 'user-456',
        theme: 'dark'
      });
    });

    it('should decode URI components', () => {
      const result = parseCookies('message=Hello%20World');
      expect(result).toEqual({ message: 'Hello World' });
    });

    it('should handle cookies with equals signs in value', () => {
      const result = parseCookies('data=key1=value1&key2=value2');
      expect(result).toEqual({ data: 'key1=value1&key2=value2' });
    });

    it('should trim whitespace around cookie parts', () => {
      const result = parseCookies('  sessionId=abc123  ;  userId=user-456  ');
      expect(result).toEqual({
        sessionId: 'abc123',
        userId: 'user-456'
      });
    });

    it('should ignore empty cookie parts', () => {
      const result = parseCookies('sessionId=abc123;;userId=user-456');
      expect(result).toEqual({
        sessionId: 'abc123',
        userId: 'user-456'
      });
    });

    it('should handle cookie without value', () => {
      const result = parseCookies('sessionId=');
      expect(result).toEqual({ sessionId: '' });
    });

    it('should handle cookies with special characters', () => {
      const result = parseCookies('data=%7B%22name%22%3A%22test%22%7D');
      expect(result).toEqual({ data: '{"name":"test"}' });
    });

    it('should handle duplicate cookie names (last one wins)', () => {
      const result = parseCookies('sessionId=first; sessionId=second');
      expect(result).toEqual({ sessionId: 'second' });
    });

    it('should handle cookies with spaces in values', () => {
      const result = parseCookies('message=hello%20world%20test');
      expect(result).toEqual({ message: 'hello world test' });
    });

    it('should handle cookies with numbers', () => {
      const result = parseCookies('count=42; version=1.5');
      expect(result).toEqual({ count: '42', version: '1.5' });
    });
  });

  describe('serializeCookie', () => {
    it('should serialize basic cookie', () => {
      const result = serializeCookie('sessionId', 'abc123');
      expect(result).toBe('sessionId=abc123; Path=/');
    });

    it('should encode cookie value', () => {
      const result = serializeCookie('message', 'Hello World');
      expect(result).toBe('message=Hello%20World; Path=/');
    });

    it('should add httpOnly flag', () => {
      const result = serializeCookie('sessionId', 'abc123', { httpOnly: true });
      expect(result).toContain('HttpOnly');
    });

    it('should add secure flag', () => {
      const result = serializeCookie('sessionId', 'abc123', { secure: true });
      expect(result).toContain('Secure');
    });

    it('should set custom path', () => {
      const result = serializeCookie('sessionId', 'abc123', { path: '/api' });
      expect(result).toBe('sessionId=abc123; Path=/api');
    });

    it('should default path to /', () => {
      const result = serializeCookie('sessionId', 'abc123', {});
      expect(result).toContain('Path=/');
    });

    it('should set maxAge', () => {
      const result = serializeCookie('sessionId', 'abc123', { maxAge: 3600 });
      expect(result).toContain('Max-Age=3600');
    });

    it('should set sameSite lax', () => {
      const result = serializeCookie('sessionId', 'abc123', { sameSite: 'lax' });
      expect(result).toContain('SameSite=lax');
    });

    it('should set sameSite strict', () => {
      const result = serializeCookie('sessionId', 'abc123', { sameSite: 'strict' });
      expect(result).toContain('SameSite=strict');
    });

    it('should set sameSite none', () => {
      const result = serializeCookie('sessionId', 'abc123', { sameSite: 'none' });
      expect(result).toContain('SameSite=none');
    });

    it('should combine all options', () => {
      const result = serializeCookie('sessionId', 'abc123', {
        httpOnly: true,
        secure: true,
        path: '/api',
        sameSite: 'strict',
        maxAge: 3600
      });

      expect(result).toBe('sessionId=abc123; Max-Age=3600; Path=/api; HttpOnly; Secure; SameSite=strict');
    });

    it('should handle empty value', () => {
      const result = serializeCookie('sessionId', '');
      expect(result).toBe('sessionId=; Path=/');
    });

    it('should handle special characters in value', () => {
      const result = serializeCookie('data', '{"name":"test"}');
      expect(result).toContain(encodeURIComponent('{"name":"test"}'));
    });

    it('should handle maxAge of 0', () => {
      const result = serializeCookie('sessionId', 'abc123', { maxAge: 0 });
      expect(result).toContain('Max-Age=0');
    });

    it('should not add maxAge if undefined', () => {
      const result = serializeCookie('sessionId', 'abc123', {});
      expect(result).not.toContain('Max-Age');
    });

    it('should not add httpOnly if false', () => {
      const result = serializeCookie('sessionId', 'abc123', { httpOnly: false });
      expect(result).not.toContain('HttpOnly');
    });

    it('should not add secure if false', () => {
      const result = serializeCookie('sessionId', 'abc123', { secure: false });
      expect(result).not.toContain('Secure');
    });

    it('should not add sameSite if undefined', () => {
      const result = serializeCookie('sessionId', 'abc123', {});
      expect(result).not.toContain('SameSite');
    });

    it('should handle cookie name with special characters', () => {
      const result = serializeCookie('session-id', 'abc123');
      expect(result).toBe('session-id=abc123; Path=/');
    });

    it('should handle long cookie values', () => {
      const longValue = 'a'.repeat(1000);
      const result = serializeCookie('data', longValue);
      expect(result).toContain(longValue);
    });

    it('should handle negative maxAge', () => {
      const result = serializeCookie('sessionId', 'abc123', { maxAge: -1 });
      expect(result).toContain('Max-Age=-1');
    });

    it('should properly order cookie attributes', () => {
      const result = serializeCookie('sessionId', 'abc123', {
        maxAge: 3600,
        path: '/api',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      });

      const parts = result.split('; ');
      expect(parts[0]).toBe('sessionId=abc123');
      expect(parts[1]).toBe('Max-Age=3600');
      expect(parts[2]).toBe('Path=/api');
      expect(parts[3]).toBe('HttpOnly');
      expect(parts[4]).toBe('Secure');
      expect(parts[5]).toBe('SameSite=strict');
    });
  });

  describe('parseCookies and serializeCookie integration', () => {
    it('should round-trip simple cookie', () => {
      const serialized = serializeCookie('sessionId', 'abc123');
      const cookieHeader = serialized.split(';')[0];
      const parsed = parseCookies(cookieHeader);

      expect(parsed).toEqual({ sessionId: 'abc123' });
    });

    it('should round-trip cookie with special characters', () => {
      const value = 'Hello World!';
      const serialized = serializeCookie('message', value);
      const cookieHeader = serialized.split(';')[0];
      const parsed = parseCookies(cookieHeader);

      expect(parsed).toEqual({ message: value });
    });

    it('should round-trip multiple cookies', () => {
      const cookie1 = serializeCookie('sessionId', 'abc123').split(';')[0];
      const cookie2 = serializeCookie('userId', 'user-456').split(';')[0];
      const cookieHeader = `${cookie1}; ${cookie2}`;
      const parsed = parseCookies(cookieHeader);

      expect(parsed).toEqual({
        sessionId: 'abc123',
        userId: 'user-456'
      });
    });
  });
});

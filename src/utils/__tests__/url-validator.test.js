const { validateURL, isPrivateIP } = require('../url-validator');

describe('URL Validator', () => {
  describe('isPrivateIP function', () => {
    test('should return true for loopback IPv4 addresses', () => {
      expect(isPrivateIP('127.0.0.1')).toBe(true);
      expect(isPrivateIP('127.1.2.3')).toBe(true);
    });

    test('should return true for private class A addresses', () => {
      expect(isPrivateIP('10.0.0.1')).toBe(true);
      expect(isPrivateIP('10.255.255.255')).toBe(true);
    });

    test('should return true for private class B addresses', () => {
      expect(isPrivateIP('172.16.0.1')).toBe(true);
      expect(isPrivateIP('172.31.255.255')).toBe(true);
    });

    test('should return true for private class C addresses', () => {
      expect(isPrivateIP('192.168.0.1')).toBe(true);
      expect(isPrivateIP('192.168.255.255')).toBe(true);
    });

    test('should return true for link-local addresses', () => {
      expect(isPrivateIP('169.254.0.1')).toBe(true);
      expect(isPrivateIP('169.254.255.255')).toBe(true);
    });

    test('should return true for carrier-grade NAT addresses', () => {
      expect(isPrivateIP('100.64.0.1')).toBe(true);
      expect(isPrivateIP('100.127.255.255')).toBe(true);
    });

    test('should return true for benchmarking addresses', () => {
      expect(isPrivateIP('198.18.0.1')).toBe(true);
      expect(isPrivateIP('198.19.255.255')).toBe(true);
    });

    test('should return true for multicast addresses', () => {
      expect(isPrivateIP('224.0.0.1')).toBe(true);
      expect(isPrivateIP('239.255.255.255')).toBe(true);
    });

    test('should return true for IPv6 addresses', () => {
      expect(isPrivateIP('::1')).toBe(true);
      expect(isPrivateIP('[::1]')).toBe(true);
      expect(isPrivateIP('2001:db8::1')).toBe(true);
    });

    test('should return false for public domain names', () => {
      expect(isPrivateIP('example.com')).toBe(false);
      expect(isPrivateIP('google.com')).toBe(false);
      expect(isPrivateIP('github.com')).toBe(false);
    });

    test('should return false for public IPv4 addresses', () => {
      expect(isPrivateIP('8.8.8.8')).toBe(false);
      expect(isPrivateIP('1.1.1.1')).toBe(false);
    });
  });

  describe('validateURL function', () => {
    test('should accept valid HTTPS URL', () => {
      const result = validateURL('https://example.com');
      expect(result.valid).toBe(true);
    });

    test('should accept valid HTTP URL', () => {
      const result = validateURL('http://example.com');
      expect(result.valid).toBe(true);
    });

    test('should reject invalid URL format', () => {
      const result = validateURL('not-a-valid-url');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid URL');
    });

    test('should reject FTP URLs', () => {
      const result = validateURL('ftp://example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('HTTP and HTTPS');
    });

    test('should reject file URLs', () => {
      const result = validateURL('file:///etc/passwd');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('HTTP and HTTPS');
    });

    test('should reject data URLs', () => {
      const result = validateURL('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('HTTP and HTTPS');
    });

    test('should reject javascript URLs', () => {
      const result = validateURL('javascript:alert(1)');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('HTTP and HTTPS');
    });

    test('should reject localhost', () => {
      const result = validateURL('http://localhost');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    test('should reject 127.0.0.1', () => {
      const result = validateURL('http://127.0.0.1');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    test('should reject metadata.google.internal', () => {
      const result = validateURL('http://metadata.google.internal');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    test('should reject URLs with credentials', () => {
      const result = validateURL('http://user:pass@example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('credentials');
    });

    test('should reject URLs with non-standard ports', () => {
      expect(validateURL('http://example.com:8080').valid).toBe(false);
      expect(validateURL('https://example.com:4433').valid).toBe(false);
    });

    test('should accept URLs with standard ports', () => {
      expect(validateURL('http://example.com:80').valid).toBe(true);
      expect(validateURL('https://example.com:443').valid).toBe(true);
    });

    test('should reject decimal IP URLs', () => {
      expect(validateURL('http://2130706433').valid).toBe(false); // 127.0.0.1
    });

    test('should reject IPv6 URLs', () => {
      expect(validateURL('http://[::1]').valid).toBe(false);
    });
  });
});

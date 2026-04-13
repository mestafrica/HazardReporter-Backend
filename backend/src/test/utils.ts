import { vi, expect } from 'vitest';

/**
 * Test utilities and helpers for backend tests
 */

/**
 * Mock Express Request object
 */
export const mockRequest = (overrides = {}) => {
  return {
    headers: { authorization: 'Bearer token' },
    params: {},
    body: {},
    query: {},
    user: null,
    ...overrides,
  };
};

/**
 * Mock Express Response object with chainable methods
 */
export const mockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  res.header = vi.fn().mockReturnValue(res);
  res.redirect = vi.fn().mockReturnValue(res);
  return res;
};

/**
 * Mock Express Next function
 */
export const mockNext = () => vi.fn();

/**
 * Generate mock MongoDB ObjectId
 */
export const mockObjectId = () => ({
  toString: vi.fn(() => '507f1f77bcf86cd799439011'),
});

/**
 * Mock user for authentication tests
 */
export const mockUser = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439011',
  userName: 'testuser',
  email: 'test@example.com',
  role: 'user',
  ...overrides,
});

/**
 * Mock admin user
 */
export const mockAdmin = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439012',
  userName: 'testadmin',
  email: 'admin@example.com',
  role: 'admin',
  ...overrides,
});

/**
 * Mock hazard report
 */
export const mockHazardReport = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439013',
  title: 'Test Fire Incident',
  description: 'Test description',
  hazardtype: 'fire',
  location: '123 Main Street',
  city: 'Accra',
  country: 'Ghana',
  user: '507f1f77bcf86cd799439011',
  images: [],
  status: 'open',
  upvotes: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Assert response status and JSON format
 */
export const assertResponseStatus = (res: any, expectedStatus: number) => {
  expect(res.status).toHaveBeenCalledWith(expectedStatus);
  expect(res.json).toHaveBeenCalled();
};

/**
 * Assert error response
 */
export const assertErrorResponse = (res: any, status: number, messagePattern: string | RegExp) => {
  expect(res.status).toHaveBeenCalledWith(status);
  const jsonCall = res.json.mock.calls[0][0];
  expect(jsonCall.message).toMatch(messagePattern);
};

/**
 * Verify authentication was checked
 */
export const verifyAuthenticationCheck = (req: any) => {
  expect(req.user).toBeDefined();
};

/**
 * Create test suite with common setup/teardown
 */
export const createTestSuite = (name: string, testFn: () => void) => {
  return { name, testFn };
};

/**
 * Mock validation errors
 */
export const createValidationError = (message: string, details: any[] = []) => ({
  message,
  details: details.length > 0 ? details : [{ message, path: ['field'] }],
});

/**
 * Sleep utility for async tests
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Verify timestamps
 */
export const verifyTimestamps = (doc: any) => {
  expect(doc.createdAt).toBeInstanceOf(Date);
  expect(doc.updatedAt).toBeInstanceOf(Date);
  expect(doc.updatedAt.getTime()).toBeGreaterThanOrEqual(doc.createdAt.getTime());
};

/**
 * Mock MongoDB model find response
 */
export const mockFindResponse = (documents: any[]) => ({
  exec: vi.fn().mockResolvedValue(documents),
  then: vi.fn((callback) => callback(documents)),
});

/**
 * Verify pagination parameters
 */
export const verifyPagination = (skip: number, limit: number, page: number) => {
  expect(skip).toBe((page - 1) * limit);
};

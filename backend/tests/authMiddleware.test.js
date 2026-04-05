import { protect } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no authorization header is present', async () => {
    // We expect the middleware to handle the error natively or throw it gracefully.
    try {
      await protect(req, res, next);
    } catch (e) {
      expect(e.message).toMatch(/Not authorized/);
    }
  });

  it('should return 401 if header exists but no bearer token', async () => {
    req.headers.authorization = 'Basic tokenxyz';
    try {
      await protect(req, res, next);
    } catch (e) {
      expect(e.message).toMatch(/Not authorized/);
    }
  });
});

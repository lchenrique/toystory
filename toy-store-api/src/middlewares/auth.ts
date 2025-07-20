import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/auth';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    const payload = verifyToken(token);
    
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or missing token',
    });
  }
} 
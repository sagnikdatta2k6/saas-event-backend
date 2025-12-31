import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// NEW: Added organizationId to the interface
export interface AuthRequest extends Request {
  user?: { userId: string; role: string; organizationId: string };
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    // We force TypeScript to treat "decoded" as our object with organizationId
    (req as AuthRequest).user = decoded as { userId: string; role: string; organizationId: string };
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
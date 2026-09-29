import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { User, IUser } from '../models/User';
import { sendError } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Authentication token required', 'UNAUTHORIZED', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      sendError(res, 'Invalid authorization format', 'UNAUTHORIZED', 401);
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; role: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      sendError(res, 'User no longer exists', 'UNAUTHORIZED', 401);
      return;
    }

    if (!user.isActive) {
      sendError(res, 'Your user account is deactivated. Please contact Parish Office.', 'FORBIDDEN', 403);
      return;
    }

    req.user = user;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      sendError(res, 'Token has expired. Please refresh your session or log in again.', 'TOKEN_EXPIRED', 401);
      return;
    }
    sendError(res, 'Invalid authentication token', 'UNAUTHORIZED', 401);
  }
}

// Optional authentication middleware (for public endpoints where logged in users get more fields)
export async function optionalAuthenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; role: string };
    const user = await User.findById(decoded.id);
    if (user && user.isActive) {
      req.user = user;
    }
  } catch (err) {
    // ignore token errors for optional auth
  }
  next();
}

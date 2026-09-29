import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { Role, UserRole } from '../models/Role';
import { config } from '../config/environment';
import { sendSuccess, sendError } from '../utils/response';
import { logAudit } from '../services/auditService';
import { AuthenticatedRequest } from '../middleware/auth';

function generateTokens(user: IUser) {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as any }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    config.jwtRefreshSecret,
    { expiresIn: config.jwtRefreshExpiresIn as any }
  );

  return { accessToken, refreshToken };
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { loginIdentifier, password } = req.body;

    if (!loginIdentifier || !password) {
      sendError(res, 'Mobile number or email and password are required', 'BAD_REQUEST', 400);
      return;
    }

    const trimmedIdentifier = loginIdentifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [
        { phone: trimmedIdentifier },
        { email: trimmedIdentifier },
      ],
    }).populate('assignedKoottayma', 'name number');

    if (!user) {
      await logAudit(req, 'Failed Login Attempt', 'User', '', `Identifier: ${trimmedIdentifier}`);
      sendError(res, 'Invalid credentials provided', 'UNAUTHORIZED', 401);
      return;
    }

    if (!user.isActive) {
      sendError(res, 'This account is deactivated. Please contact Parish Office.', 'FORBIDDEN', 403);
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await logAudit(req, 'Failed Login - Bad Password', 'User', user._id.toString(), `Identifier: ${trimmedIdentifier}`);
      sendError(res, 'Invalid credentials provided', 'UNAUTHORIZED', 401);
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user);

    user.refreshTokens.push(refreshToken);
    user.lastLogin = new Date();
    await user.save();

    await logAudit(req, 'User Login Success', 'User', user._id.toString(), `Logged in with role ${user.role}`);

    sendSuccess(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          assignedKoottayma: user.assignedKoottayma,
          familyId: user.familyId,
          personId: user.personId,
        },
        accessToken,
        refreshToken,
      },
      'Login successful'
    );
  } catch (err: any) {
    sendError(res, err.message, 'LOGIN_FAILED', 500);
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      sendError(res, 'Refresh token required', 'BAD_REQUEST', 400);
      return;
    }

    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive || !user.refreshTokens.includes(refreshToken)) {
      sendError(res, 'Invalid or revoked refresh token', 'UNAUTHORIZED', 401);
      return;
    }

    const tokens = generateTokens(user);
    // Replace old refresh token with new one
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    sendSuccess(res, tokens, 'Token refreshed successfully');
  } catch (err: any) {
    sendError(res, 'Token refresh failed', 'UNAUTHORIZED', 401);
  }
}

export async function logout(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (req.user && refreshToken) {
      req.user.refreshTokens = req.user.refreshTokens.filter((t) => t !== refreshToken);
      await req.user.save();
    }
    if (req.user) {
      await logAudit(req, 'User Logout', 'User', req.user._id.toString());
    }
    sendSuccess(res, null, 'Logged out successfully');
  } catch (err: any) {
    sendError(res, err.message, 'LOGOUT_FAILED', 500);
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.user!._id)
      .populate('assignedKoottayma')
      .populate('familyId')
      .populate('personId');

    sendSuccess(res, user, 'Current user profile retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_ME_FAILED', 500);
  }
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const { phoneOrEmail } = req.body;
    const user = await User.findOne({
      $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
    });

    if (!user) {
      // Return success anyway to avoid user enumeration
      sendSuccess(res, null, 'If this account exists, password recovery instructions have been sent.');
      return;
    }

    await logAudit(req, 'Password Reset Requested', 'User', user._id.toString());
    sendSuccess(res, null, 'If this account exists, password recovery instructions have been sent.');
  } catch (err: any) {
    sendError(res, err.message, 'FORGOT_PASSWORD_ERROR', 500);
  }
}

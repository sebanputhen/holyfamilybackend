import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { UserRole } from '../models/Role';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';

export async function getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { role, isActive, search } = req.query;
    const query: any = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    if (search) {
      const regex = new RegExp(search as string, 'i');
      query.$or = [{ name: regex }, { phone: regex }, { email: regex }];
    }

    const users = await User.find(query)
      .select('-password -refreshTokens')
      .populate('assignedKoottayma', 'name number')
      .sort({ createdAt: -1 });

    sendSuccess(res, users, 'Users retrieved successfully');
  } catch (err: any) {
    sendError(res, err.message, 'GET_USERS_FAILED', 500);
  }
}

export async function getUserMetrics(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const totalUsers = await User.countDocuments();
    const parishioners = await User.countDocuments({ role: UserRole.PARISHIONER });
    const koottaymaLeaders = await User.countDocuments({ role: UserRole.KOOTTAYMA_LEADER });
    const admins = await User.countDocuments({ role: UserRole.ADMIN });
    const superAdmins = await User.countDocuments({ role: UserRole.SUPER_ADMIN });
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    sendSuccess(res, {
      totalUsers,
      parishioners,
      koottaymaLeaders,
      admins,
      superAdmins,
      activeUsers,
      inactiveUsers,
    }, 'User metrics retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_USER_METRICS_FAILED', 500);
  }
}

export async function createUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, phone, email, password, role, assignedKoottayma } = req.body;
    if (!name || !phone || !password || !role) {
      sendError(res, 'Name, phone, password, and role are required', 'BAD_REQUEST', 400);
      return;
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      sendError(res, 'A user with this mobile phone number already exists', 'BAD_REQUEST', 400);
      return;
    }

    const user = await User.create({
      name,
      phone,
      email,
      password,
      role,
      assignedKoottayma: assignedKoottayma || null,
      isActive: true,
    });

    await logAudit(
      req,
      'Created User Account',
      'User',
      user._id.toString(),
      `Name: ${user.name}, Role: ${user.role}`
    );

    const sanitized = user.toObject();
    delete (sanitized as any).password;
    delete (sanitized as any).refreshTokens;

    sendSuccess(res, sanitized, 'User created successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, 'CREATE_USER_FAILED', 500);
  }
}

export async function updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      sendError(res, 'User not found', 'NOT_FOUND', 404);
      return;
    }

    const allowedUpdates = ['name', 'phone', 'email', 'role', 'isActive', 'assignedKoottayma'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        (user as any)[field] = req.body[field];
      }
    });

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    await user.save();

    await logAudit(
      req,
      'Updated User Account',
      'User',
      user._id.toString(),
      `Role: ${user.role}, Active: ${user.isActive}`
    );

    const sanitized = user.toObject();
    delete (sanitized as any).password;
    delete (sanitized as any).refreshTokens;

    sendSuccess(res, sanitized, 'User updated successfully');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_USER_FAILED', 500);
  }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      sendError(res, 'User not found', 'NOT_FOUND', 404);
      return;
    }

    // Protect Super Admin from deleting themselves
    if (user._id.toString() === req.user?._id?.toString()) {
      sendError(res, 'You cannot delete your own Super Admin account', 'FORBIDDEN', 403);
      return;
    }

    await User.findByIdAndDelete(id);

    await logAudit(
      req,
      'Deleted User Account',
      'User',
      id,
      `User: ${user.name} (${user.phone})`
    );

    sendSuccess(res, null, 'User deleted successfully');
  } catch (err: any) {
    sendError(res, err.message, 'DELETE_USER_FAILED', 500);
  }
}

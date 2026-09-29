import { Request, Response } from 'express';
import { Setting } from '../models/Setting';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';

export async function getSettings(req: Request, res: Response): Promise<void> {
  try {
    let settings = await Setting.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = await Setting.create({ key: 'global_settings' });
    }
    sendSuccess(res, settings, 'Parish settings retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_SETTINGS_FAILED', 500);
  }
}

export async function updateSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    let settings = await Setting.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = new Setting({ key: 'global_settings', ...req.body });
    } else {
      if (req.body.general) settings.general = { ...settings.general, ...req.body.general };
      if (req.body.privacy) settings.privacy = { ...settings.privacy, ...req.body.privacy };
      if (req.body.notifications) settings.notifications = { ...settings.notifications, ...req.body.notifications };
      if (req.body.security) settings.security = { ...settings.security, ...req.body.security };
      if (req.body.application) settings.application = { ...settings.application, ...req.body.application };
    }

    await settings.save();

    await logAudit(
      req,
      'Updated System Settings',
      'Setting',
      settings._id.toString(),
      'Admin updated configuration'
    );

    sendSuccess(res, settings, 'Parish settings updated successfully');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_SETTINGS_FAILED', 500);
  }
}

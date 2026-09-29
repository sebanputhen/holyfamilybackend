import { Response } from 'express';
import { Parish } from '../models/Parish';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';

export async function getParish(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    let parish = await Parish.findOne();
    if (!parish) {
      parish = await Parish.create({
        name: "St. Mary's Forane Church",
        patronSaint: 'Mother Mary (Our Lady of Assumption)',
        diocese: 'Archdiocese of Ernakulam-Angamaly',
        forane: 'Forane of St. Mary',
        address: 'Main Road, Kadavanthra, Kochi, Kerala 682020',
        establishedYear: 1894,
        parishFeast: 'Feast of the Assumption (August 15)',
      });
    }
    sendSuccess(res, parish, 'Parish identity retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_PARISH_FAILED', 500);
  }
}

export async function updateParish(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    let parish = await Parish.findOne();
    if (!parish) {
      parish = new Parish(req.body);
    } else {
      Object.assign(parish, req.body);
    }
    await parish.save();

    await logAudit(
      req,
      'Updated Parish Identity',
      'Parish',
      parish._id.toString(),
      'Admin updated parish profile'
    );

    sendSuccess(res, parish, 'Parish identity updated successfully');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_PARISH_FAILED', 500);
  }
}

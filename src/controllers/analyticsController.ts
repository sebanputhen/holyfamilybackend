import { Response } from 'express';
import { Family } from '../models/Family';
import { Person } from '../models/Person';
import { Koottayma } from '../models/Koottayma';
import { Organization } from '../models/Organization';
import { Event } from '../models/Event';
import { MassSchedule } from '../models/MassSchedule';
import { PrayerMeeting } from '../models/PrayerMeeting';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export async function getDashboardAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const totalFamilies = await Family.countDocuments();
    const totalParishioners = await Person.countDocuments();
    const totalKoottaymas = await Koottayma.countDocuments();
    const totalOrganizations = await Organization.countDocuments();

    const maleMembers = await Person.countDocuments({ gender: 'Male' });
    const femaleMembers = await Person.countDocuments({ gender: 'Female' });

    // Age breakdown
    const today = new Date();
    const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    const thirtyFiveYearsAgo = new Date(today.getFullYear() - 35, today.getMonth(), today.getDate());
    const sixtyYearsAgo = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate());

    const children = await Person.countDocuments({ dateOfBirth: { $gte: thirteenYearsAgo } });
    const youth = await Person.countDocuments({
      dateOfBirth: { $lt: thirteenYearsAgo, $gte: thirtyFiveYearsAgo },
    });
    const adults = await Person.countDocuments({
      dateOfBirth: { $lt: thirtyFiveYearsAgo, $gte: sixtyYearsAgo },
    });
    const seniorCitizens = await Person.countDocuments({ dateOfBirth: { $lt: sixtyYearsAgo } });

    // Koottayma-wise statistics
    const koottaymas = await Koottayma.find().sort({ number: 1 });
    const koottaymaStats = await Promise.all(
      koottaymas.map(async (k) => {
        const familiesCount = await Family.countDocuments({ koottaymaId: k._id });
        const membersCount = await Person.countDocuments({ koottaymaId: k._id });
        return {
          id: k._id,
          name: k.name,
          number: k.number,
          familiesCount,
          membersCount,
        };
      })
    );

    // Upcoming events and today's masses
    const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaysMasses = await MassSchedule.find({
      status: 'Active',
      $or: [{ dayOfWeek: todayDay }, { dayOfWeek: 'Daily' }],
    });

    const upcomingEvents = await Event.find({
      date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      status: 'Upcoming',
    }).sort({ date: 1 }).limit(5);

    const upcomingPrayerMeetings = await PrayerMeeting.find({
      date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }).sort({ date: 1 }).limit(5);

    sendSuccess(res, {
      totalFamilies,
      totalParishioners,
      totalKoottaymas,
      totalOrganizations,
      demographics: {
        maleMembers,
        femaleMembers,
        children,
        youth,
        adults,
        seniorCitizens,
      },
      koottaymaStats,
      todaysMasses,
      upcomingEvents,
      upcomingPrayerMeetings,
    }, 'Dashboard analytics retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_ANALYTICS_FAILED', 500);
  }
}

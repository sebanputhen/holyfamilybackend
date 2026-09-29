import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Family } from '../models/Family';
import { Person } from '../models/Person';
import { Koottayma } from '../models/Koottayma';
import { Event } from '../models/Event';
import { Announcement } from '../models/Announcement';
import { Priest } from '../models/Priest';
import { ReligiousSister } from '../models/ReligiousSister';
import { Organization } from '../models/Organization';
import { GalleryAlbum } from '../models/Gallery';
import { ParishHistory } from '../models/ParishHistory';
import { sanitizeFamily, sanitizePerson } from '../services/privacyService';
import { sendSuccess, sendError } from '../utils/response';
import { UserRole } from '../models/Role';

export async function globalSearch(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const queryStr = (req.query.q as string || '').trim();
    if (!queryStr || queryStr.length < 2) {
      sendSuccess(res, {
        families: [],
        parishioners: [],
        koottaymas: [],
        events: [],
        announcements: [],
        priests: [],
        sisters: [],
        organizations: [],
        gallery: [],
        history: [],
      }, 'Search query too short');
      return;
    }

    const regex = new RegExp(queryStr, 'i');

    // 1. Families
    const familyQuery: any = {
      $or: [
        { houseName: regex },
        { headOfFamily: regex },
        { familyName: regex },
        { phone1: regex },
      ],
    };
    if (req.user?.role === UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
      familyQuery.koottaymaId = req.user.assignedKoottayma;
    }
    const rawFamilies = await Family.find(familyQuery).limit(10);
    const families = rawFamilies
      .map((f) => sanitizeFamily(f, req.user))
      .filter((f) => f !== null);

    // 2. Parishioners
    const personQuery: any = {
      $or: [{ name: regex }, { baptismName: regex }, { phone: regex }],
    };
    if (req.user?.role === UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
      personQuery.koottaymaId = req.user.assignedKoottayma;
    }
    const rawPersons = await Person.find(personQuery).limit(10);
    const parishioners = rawPersons.map((p) => sanitizePerson(p, req.user));

    // 3. Koottaymas
    const koottaymas = await Koottayma.find({
      $or: [{ name: regex }, { patronSaint: regex }, { leader: regex }],
    }).limit(6);

    // 4. Events
    const events = await Event.find({
      $or: [{ title: regex }, { description: regex }, { venue: regex }],
    }).limit(6);

    // 5. Announcements
    const announcements = await Announcement.find({
      isActive: true,
      $or: [{ title: regex }, { content: regex }],
    }).limit(6);

    // 6. Priests
    const priests = await Priest.find({
      $or: [{ name: regex }, { designation: regex }, { diocese: regex }],
    }).limit(6);

    // 7. Religious Sisters
    const sisters = await ReligiousSister.find({
      $or: [{ name: regex }, { religiousCongregation: regex }, { currentMinistry: regex }],
    }).limit(6);

    // 8. Organizations
    const organizations = await Organization.find({
      $or: [{ name: regex }, { description: regex }, { leader: regex }],
    }).limit(6);

    // 9. Gallery
    const gallery = await GalleryAlbum.find({
      isPublic: true,
      $or: [{ title: regex }, { description: regex }, { category: regex }],
    }).limit(6);

    // 10. History
    const history = await ParishHistory.find({
      $or: [{ event: regex }, { description: regex }],
    }).limit(6);

    sendSuccess(res, {
      families,
      parishioners,
      koottaymas,
      events,
      announcements,
      priests,
      sisters,
      organizations,
      gallery,
      history,
    }, 'Global search results retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'SEARCH_FAILED', 500);
  }
}

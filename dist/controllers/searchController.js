"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalSearch = globalSearch;
const Family_1 = require("../models/Family");
const Person_1 = require("../models/Person");
const Koottayma_1 = require("../models/Koottayma");
const Event_1 = require("../models/Event");
const Announcement_1 = require("../models/Announcement");
const Priest_1 = require("../models/Priest");
const ReligiousSister_1 = require("../models/ReligiousSister");
const Organization_1 = require("../models/Organization");
const Gallery_1 = require("../models/Gallery");
const ParishHistory_1 = require("../models/ParishHistory");
const privacyService_1 = require("../services/privacyService");
const response_1 = require("../utils/response");
const Role_1 = require("../models/Role");
async function globalSearch(req, res) {
    try {
        const queryStr = (req.query.q || '').trim();
        if (!queryStr || queryStr.length < 2) {
            (0, response_1.sendSuccess)(res, {
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
        const familyQuery = {
            $or: [
                { houseName: regex },
                { headOfFamily: regex },
                { familyName: regex },
                { phone1: regex },
            ],
        };
        if (req.user?.role === Role_1.UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
            familyQuery.koottaymaId = req.user.assignedKoottayma;
        }
        const rawFamilies = await Family_1.Family.find(familyQuery).limit(10);
        const families = rawFamilies
            .map((f) => (0, privacyService_1.sanitizeFamily)(f, req.user))
            .filter((f) => f !== null);
        // 2. Parishioners
        const personQuery = {
            $or: [{ name: regex }, { baptismName: regex }, { phone: regex }],
        };
        if (req.user?.role === Role_1.UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
            personQuery.koottaymaId = req.user.assignedKoottayma;
        }
        const rawPersons = await Person_1.Person.find(personQuery).limit(10);
        const parishioners = rawPersons.map((p) => (0, privacyService_1.sanitizePerson)(p, req.user));
        // 3. Koottaymas
        const koottaymas = await Koottayma_1.Koottayma.find({
            $or: [{ name: regex }, { patronSaint: regex }, { leader: regex }],
        }).limit(6);
        // 4. Events
        const events = await Event_1.Event.find({
            $or: [{ title: regex }, { description: regex }, { venue: regex }],
        }).limit(6);
        // 5. Announcements
        const announcements = await Announcement_1.Announcement.find({
            isActive: true,
            $or: [{ title: regex }, { content: regex }],
        }).limit(6);
        // 6. Priests
        const priests = await Priest_1.Priest.find({
            $or: [{ name: regex }, { designation: regex }, { diocese: regex }],
        }).limit(6);
        // 7. Religious Sisters
        const sisters = await ReligiousSister_1.ReligiousSister.find({
            $or: [{ name: regex }, { religiousCongregation: regex }, { currentMinistry: regex }],
        }).limit(6);
        // 8. Organizations
        const organizations = await Organization_1.Organization.find({
            $or: [{ name: regex }, { description: regex }, { leader: regex }],
        }).limit(6);
        // 9. Gallery
        const gallery = await Gallery_1.GalleryAlbum.find({
            isPublic: true,
            $or: [{ title: regex }, { description: regex }, { category: regex }],
        }).limit(6);
        // 10. History
        const history = await ParishHistory_1.ParishHistory.find({
            $or: [{ event: regex }, { description: regex }],
        }).limit(6);
        (0, response_1.sendSuccess)(res, {
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
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'SEARCH_FAILED', 500);
    }
}

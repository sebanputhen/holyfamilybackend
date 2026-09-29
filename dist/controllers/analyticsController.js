"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardAnalytics = getDashboardAnalytics;
const Family_1 = require("../models/Family");
const Person_1 = require("../models/Person");
const Koottayma_1 = require("../models/Koottayma");
const Organization_1 = require("../models/Organization");
const Event_1 = require("../models/Event");
const MassSchedule_1 = require("../models/MassSchedule");
const PrayerMeeting_1 = require("../models/PrayerMeeting");
const response_1 = require("../utils/response");
async function getDashboardAnalytics(req, res) {
    try {
        const totalFamilies = await Family_1.Family.countDocuments();
        const totalParishioners = await Person_1.Person.countDocuments();
        const totalKoottaymas = await Koottayma_1.Koottayma.countDocuments();
        const totalOrganizations = await Organization_1.Organization.countDocuments();
        const maleMembers = await Person_1.Person.countDocuments({ gender: 'Male' });
        const femaleMembers = await Person_1.Person.countDocuments({ gender: 'Female' });
        // Age breakdown
        const today = new Date();
        const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
        const thirtyFiveYearsAgo = new Date(today.getFullYear() - 35, today.getMonth(), today.getDate());
        const sixtyYearsAgo = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate());
        const children = await Person_1.Person.countDocuments({ dateOfBirth: { $gte: thirteenYearsAgo } });
        const youth = await Person_1.Person.countDocuments({
            dateOfBirth: { $lt: thirteenYearsAgo, $gte: thirtyFiveYearsAgo },
        });
        const adults = await Person_1.Person.countDocuments({
            dateOfBirth: { $lt: thirtyFiveYearsAgo, $gte: sixtyYearsAgo },
        });
        const seniorCitizens = await Person_1.Person.countDocuments({ dateOfBirth: { $lt: sixtyYearsAgo } });
        // Koottayma-wise statistics
        const koottaymas = await Koottayma_1.Koottayma.find().sort({ number: 1 });
        const koottaymaStats = await Promise.all(koottaymas.map(async (k) => {
            const familiesCount = await Family_1.Family.countDocuments({ koottaymaId: k._id });
            const membersCount = await Person_1.Person.countDocuments({ koottaymaId: k._id });
            return {
                id: k._id,
                name: k.name,
                number: k.number,
                familiesCount,
                membersCount,
            };
        }));
        // Upcoming events and today's masses
        const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const todaysMasses = await MassSchedule_1.MassSchedule.find({
            status: 'Active',
            $or: [{ dayOfWeek: todayDay }, { dayOfWeek: 'Daily' }],
        });
        const upcomingEvents = await Event_1.Event.find({
            date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            status: 'Upcoming',
        }).sort({ date: 1 }).limit(5);
        const upcomingPrayerMeetings = await PrayerMeeting_1.PrayerMeeting.find({
            date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        }).sort({ date: 1 }).limit(5);
        (0, response_1.sendSuccess)(res, {
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
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_ANALYTICS_FAILED', 500);
    }
}

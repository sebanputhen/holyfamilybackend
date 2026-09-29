"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prayerMeetingController_1 = require("../controllers/prayerMeetingController");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const Role_1 = require("../models/Role");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, prayerMeetingController_1.getPrayerMeetings);
// Koottayma Leader, Admin, Super Admin can create/submit prayer meetings
router.post('/', auth_1.authenticate, (0, rbac_1.requireRole)(Role_1.UserRole.KOOTTAYMA_LEADER, Role_1.UserRole.ADMIN, Role_1.UserRole.SUPER_ADMIN), prayerMeetingController_1.createPrayerMeeting);
router.put('/:id', auth_1.authenticate, (0, rbac_1.requireRole)(Role_1.UserRole.KOOTTAYMA_LEADER, Role_1.UserRole.ADMIN, Role_1.UserRole.SUPER_ADMIN), prayerMeetingController_1.updatePrayerMeeting);
// Admin & Super Admin only can delete prayer meetings
router.delete('/:id', auth_1.authenticate, (0, rbac_1.requireRole)(Role_1.UserRole.ADMIN, Role_1.UserRole.SUPER_ADMIN), prayerMeetingController_1.deletePrayerMeeting);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const koottaymaController_1 = require("../controllers/koottaymaController");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const ownership_1 = require("../middleware/ownership");
const Role_1 = require("../models/Role");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, koottaymaController_1.getKoottaymas);
router.get('/dashboard/:id?', auth_1.authenticate, (0, ownership_1.verifyKoottaymaOwnership)('id'), koottaymaController_1.getKoottaymaDashboard);
router.get('/:id', auth_1.authenticate, (0, ownership_1.verifyKoottaymaOwnership)('id'), koottaymaController_1.getKoottaymaById);
// Admin & Super Admin only
router.post('/', auth_1.authenticate, (0, rbac_1.requireRole)(Role_1.UserRole.ADMIN, Role_1.UserRole.SUPER_ADMIN), koottaymaController_1.createKoottayma);
router.put('/:id', auth_1.authenticate, (0, rbac_1.requireRole)(Role_1.UserRole.ADMIN, Role_1.UserRole.SUPER_ADMIN), koottaymaController_1.updateKoottayma);
router.delete('/:id', auth_1.authenticate, (0, rbac_1.requireRole)(Role_1.UserRole.ADMIN, Role_1.UserRole.SUPER_ADMIN), koottaymaController_1.deleteKoottayma);
exports.default = router;

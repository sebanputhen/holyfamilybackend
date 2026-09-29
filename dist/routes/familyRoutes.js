"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const familyController_1 = require("../controllers/familyController");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const Role_1 = require("../models/Role");
const router = (0, express_1.Router)();
// Authenticated directory access (with privacy filters based on role)
router.get('/', auth_1.authenticate, familyController_1.getFamiliesDirectory);
router.get('/:id', auth_1.authenticate, familyController_1.getFamilyById);
// Admin & Super Admin CRUD
router.post('/', auth_1.authenticate, (0, rbac_1.requireRole)(Role_1.UserRole.ADMIN, Role_1.UserRole.SUPER_ADMIN), familyController_1.createFamily);
router.put('/:id', auth_1.authenticate, (0, rbac_1.requireRole)(Role_1.UserRole.ADMIN, Role_1.UserRole.SUPER_ADMIN), familyController_1.updateFamily);
router.delete('/:id', auth_1.authenticate, (0, rbac_1.requireRole)(Role_1.UserRole.ADMIN, Role_1.UserRole.SUPER_ADMIN), familyController_1.deleteFamily);
exports.default = router;

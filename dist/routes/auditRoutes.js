"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditController_1 = require("../controllers/auditController");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const Role_1 = require("../models/Role");
const router = (0, express_1.Router)();
// Strictly Super Admin restricted
router.get('/', auth_1.authenticate, (0, rbac_1.requireRole)(Role_1.UserRole.SUPER_ADMIN), auditController_1.getAuditLogs);
exports.default = router;

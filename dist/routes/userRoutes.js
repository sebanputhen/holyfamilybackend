"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const Role_1 = require("../models/Role");
const router = (0, express_1.Router)();
// Strictly Super Admin restricted
router.use(auth_1.authenticate, (0, rbac_1.requireRole)(Role_1.UserRole.SUPER_ADMIN));
router.get('/', userController_1.getUsers);
router.get('/metrics', userController_1.getUserMetrics);
router.post('/', userController_1.createUser);
router.put('/:id', userController_1.updateUser);
router.delete('/:id', userController_1.deleteUser);
exports.default = router;

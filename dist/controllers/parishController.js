"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParish = getParish;
exports.updateParish = updateParish;
const Parish_1 = require("../models/Parish");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
async function getParish(req, res) {
    try {
        let parish = await Parish_1.Parish.findOne();
        if (!parish) {
            parish = await Parish_1.Parish.create({
                name: "St. Mary's Forane Church",
                patronSaint: 'Mother Mary (Our Lady of Assumption)',
                diocese: 'Archdiocese of Ernakulam-Angamaly',
                forane: 'Forane of St. Mary',
                address: 'Main Road, Kadavanthra, Kochi, Kerala 682020',
                establishedYear: 1894,
                parishFeast: 'Feast of the Assumption (August 15)',
            });
        }
        (0, response_1.sendSuccess)(res, parish, 'Parish identity retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_PARISH_FAILED', 500);
    }
}
async function updateParish(req, res) {
    try {
        let parish = await Parish_1.Parish.findOne();
        if (!parish) {
            parish = new Parish_1.Parish(req.body);
        }
        else {
            Object.assign(parish, req.body);
        }
        await parish.save();
        await (0, auditService_1.logAudit)(req, 'Updated Parish Identity', 'Parish', parish._id.toString(), 'Admin updated parish profile');
        (0, response_1.sendSuccess)(res, parish, 'Parish identity updated successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_PARISH_FAILED', 500);
    }
}

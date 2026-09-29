"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message = 'Operation successful', statusCode = 200, pagination) {
    const payload = {
        success: true,
        message,
        data,
    };
    if (pagination) {
        payload.pagination = pagination;
    }
    return res.status(statusCode).json(payload);
}
function sendError(res, message = 'An error occurred', code = 'INTERNAL_ERROR', statusCode = 500, errors) {
    return res.status(statusCode).json({
        success: false,
        message,
        code,
        ...(errors ? { errors } : {}),
    });
}

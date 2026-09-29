import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Securely log technical stack trace on server
  console.error('[SERVER ERROR]', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'record';
    let userMsg = `A ${field} with this value already exists in the parish database.`;
    if (field === 'phone') userMsg = 'A user or family with this phone number already exists.';
    if (field === 'email') userMsg = 'A record with this email address already exists.';
    if (field === 'familyId') userMsg = 'A family with this Family ID already exists.';
    if (field === 'number') userMsg = 'A Koottayma with this unit number already exists.';
    sendError(res, userMsg, 'DUPLICATE_ENTRY', 409);
    return;
  }

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e: any) => e.message);
    sendError(res, messages.join(', ') || 'Validation error', 'VALIDATION_ERROR', 400);
    return;
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    sendError(res, 'The requested record identifier is invalid.', 'INVALID_ID', 400);
    return;
  }

  // Default clean user-friendly response
  const status = err.statusCode || 500;
  const message =
    status === 500
      ? 'An unexpected error occurred on the parish server. Please try again later.'
      : err.message || 'Operation failed';

  sendError(res, message, err.code || 'INTERNAL_ERROR', status);
}

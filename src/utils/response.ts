import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Operation successful',
  statusCode: number = 200,
  pagination?: PaginationMeta
) {
  const payload: any = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    payload.pagination = pagination;
  }

  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string = 'An error occurred',
  code: string = 'INTERNAL_ERROR',
  statusCode: number = 500,
  errors?: any
) {
  return res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(errors ? { errors } : {}),
  });
}

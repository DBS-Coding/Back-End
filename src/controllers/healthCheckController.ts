import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { successResponse } from '../utils/responseUtils';

export const healthCheckController = (
  request: Request,
  h: ResponseToolkit,
): ResponseObject => {
  const data = {
    status: 'ok',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    version: 'v1',
    uptime: process.uptime(), // dalam detik
  };

  return successResponse(h, data, 200, 'Health check successful');
};

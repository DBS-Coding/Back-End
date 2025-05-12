import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { successResponse } from '../utils/responseUtils';

export const helloController = (
  request: Request,
  h: ResponseToolkit,
): ResponseObject => {
  const data = 'Welcome Server v1';

  return successResponse(h, data, 200, 'Server Load successful');
};

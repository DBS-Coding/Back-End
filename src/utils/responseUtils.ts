import { ResponseToolkit } from '@hapi/hapi';

export const successResponse = (
  h: ResponseToolkit,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  statusCode: number,
  message: string,
) => {
  return h
    .response({
      code: statusCode,
      status: 'success',
      message,
      data,
    })
    .code(statusCode);
};

export const errorResponse = (
  h: ResponseToolkit,
  message: string,
  statusCode: number,
) => {
  return h
    .response({
      code: statusCode,
      status: 'error',
      message,
    })
    .code(statusCode);
};

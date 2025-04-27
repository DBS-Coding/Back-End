import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";

export const helloController = (
  request: Request,
  h: ResponseToolkit,
): ResponseObject => {
  return h.response({ message: "Hello, world mantap" }).code(200);
};

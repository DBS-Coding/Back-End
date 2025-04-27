import { helloController } from "../controllers/helloController";
import { ServerRoute } from "@hapi/hapi";

const routes: ServerRoute[] = [
  {
    method: "GET",
    path: "/",
    handler: helloController,
  },
];

export default routes;

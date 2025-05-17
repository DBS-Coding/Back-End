import { ServerRoute } from '@hapi/hapi';
import { healthCheckController } from '../controllers/healthCheckController';

const healthRoute: ServerRoute[] = [
  {
    method: 'GET',
    path: '/',
    handler: healthCheckController,
  },
];

export default healthRoute;
import { helloController } from '../controllers/helloController';
import { ServerRoute } from '@hapi/hapi';
import {
  AuthWithGoogle,
  getUser,
  forgotPassword,
} from '../controllers/authController';

const routes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/',
    handler: helloController,
  },
  //  auth routes
  {
    method: 'post',
    path: '/auth/google',
    handler: AuthWithGoogle,
  },
  {
    method: 'GET',
    path: '/auth/user',
    handler: getUser,
  },
  {
    method: 'POST',
    path: '/auth/forgot-password',
    handler: forgotPassword,
  },
];

export default routes;

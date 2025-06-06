import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  deleteUser,
} from '../controllers/authController';

// Validation Schemas
const registerValidation = Joi.object({
  email: Joi.string().email().required().description('User email address'),
  password: Joi.string()
    .min(6)
    .required()
    .description('User password (min 6 characters)'),
  name: Joi.string().required().description('User full name'),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required().description('User email address'),
  password: Joi.string().required().description('User password'),
});

const authHeaderValidation = Joi.object({
  authorization: Joi.string()
    .required()
    .description('Bearer token in format "Bearer <token>"'),
}).unknown();

// Route definitions
const authRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/auth/register',
    handler: registerUser,
    options: {
      auth: false,
      tags: ['api', 'auth'],
      description: 'Register a new user account',
      notes: 'Creates a new user with email, password, and name',
      validate: {
        payload: registerValidation,
      },
    },
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: loginUser,
    options: {
      auth: false,
      tags: ['api', 'auth'],
      description: 'Authenticate user and get access token',
      notes: 'Returns JWT token for authenticated requests',
      validate: {
        payload: loginValidation,
      },
    },
  },
  {
    method: 'GET',
    path: '/auth/me',
    handler: getCurrentUser,
    options: {
      tags: ['api', 'auth'],
      description: 'Get current authenticated user data',
      notes: 'Requires valid JWT token in Authorization header',
      validate: {
        headers: authHeaderValidation,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/auth/me',
    handler: deleteUser,
    options: {
      tags: ['api', 'auth'],
      description: 'Delete current user account',
      notes: 'Permanently deletes the authenticated user account',
      validate: {
        headers: authHeaderValidation,
      },
    },
  },
];

export default authRoutes;

import Joi from 'joi';
import { ServerRoute } from '@hapi/hapi';
import {
  createOrUpdateChatbotTag,
  getAllChatbotTags,
  getChatbotTag,
  deleteChatbotTag,
  processChatbotInput,
  getChatbotByNama,
  createChatbotTag,
  updateChatbotTag,
  deleteChatbotAll,
} from '../controllers/chatbotController';

const chatbotRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/chatbot/tags',
    handler: createOrUpdateChatbotTag,
    options: {
      validate: {
        payload: Joi.object({
          nama: Joi.string().valid('soekarno', 'hatta').required(),
          tag: Joi.string().required(),
          input: Joi.array().items(Joi.string()).min(1).required(),
          responses: Joi.array().items(Joi.string()).min(1).required(),
        }),
      },
    },
  },
  {
    method: 'POST',
    path: '/chatbot/create',
    handler: createChatbotTag,
    options: {
      validate: {
        payload: Joi.object({
          nama: Joi.string().valid('soekarno', 'hatta').required(),
          tag: Joi.string().required(),
          input: Joi.array().items(Joi.string()).min(1).required(),
          responses: Joi.array().items(Joi.string()).min(1).required(),
        }),
      },
    },
  },
  {
    method: 'PUT',
    path: '/chatbot/update/{id}',
    handler: updateChatbotTag,
    options: {
      validate: {
        payload: Joi.object({
          nama: Joi.string().valid('soekarno', 'hatta').required(),
          tag: Joi.string().required(),
          input: Joi.array().items(Joi.string()).min(1).required(),
          responses: Joi.array().items(Joi.string()).min(1).required(),
        }),
      },
    },
  },

  {
    method: 'GET',
    path: '/chatbot/tags',
    handler: getAllChatbotTags,
  },
  {
    method: 'GET',
    path: '/chatbot/tags/nama/{nama}',
    handler: getChatbotByNama,
  },
  {
    method: 'GET',
    path: '/chatbot/tags/{id}',
    handler: getChatbotTag,
  },
  {
    method: 'DELETE',
    path: '/chatbot/tags/{id}',
    handler: deleteChatbotTag,
  },
  {
    method: 'POST',
    path: '/chatbot/process',
    handler: processChatbotInput,
    options: {
      validate: {
        payload: Joi.object({
          input: Joi.string().required(),
        }),
      },
    },
  },
  {
    method: 'DELETE',
    path: '/chatbot/all/{db_key}',
    handler: deleteChatbotAll,
  },
];

export default chatbotRoutes;

import Joi from 'joi';
import { ServerRoute } from '@hapi/hapi';
import {
  createOrUpdateChatbotTag,
  getAllChatbotTags,
  getChatbotTag,
  deleteChatbotTag,
  processChatbotInput
} from '../controllers/chatbotController';

const chatbotRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/chatbot/tags',
    handler: createOrUpdateChatbotTag,
    options: {
      validate: {
        payload: Joi.object({
          tag: Joi.string().required(),
          input: Joi.array().items(Joi.string()).min(1).required(),
          responses: Joi.array().items(Joi.string()).min(1).required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/chatbot/tags',
    handler: getAllChatbotTags
  },
  {
    method: 'GET',
    path: '/chatbot/tags/{tag}',
    handler: getChatbotTag
  },
  {
    method: 'DELETE',
    path: '/chatbot/tags/{tag}',
    handler: deleteChatbotTag
  },
  {
    method: 'POST',
    path: '/chatbot/process',
    handler: processChatbotInput,
    options: {
      validate: {
        payload: Joi.object({
          input: Joi.string().required()
        })
      }
    }
  }
];

export default chatbotRoutes;

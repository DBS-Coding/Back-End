import { Request, ResponseToolkit } from '@hapi/hapi';
import { supabase } from '../config/supabaseClient';
import { successResponse, errorResponse } from '../utils/responseUtils';
import Joi from 'joi';

// Interface for chatbot data
interface ChatbotData {
  tag: string;
  input: string[];
  responses: string[];
}

// Validation schema
const chatbotSchema = Joi.object({
  tag: Joi.string().required(),
  input: Joi.array().items(Joi.string()).min(1).required(),
  responses: Joi.array().items(Joi.string()).min(1).required()
});

// Create or update a chatbot tag with its inputs and responses
export const createOrUpdateChatbotTag = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req.payload as ChatbotData;

    // Validate input
    const { error: validationError } = chatbotSchema.validate(payload);
    if (validationError) {
      return errorResponse(h, validationError.details[0].message, 400);
    }

    // Start a transaction
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .upsert(
        { tag_name: payload.tag },
        { onConflict: 'tag_name' }
      )
      .select()
      .single();

    if (tagError) throw tagError;

    // Delete existing inputs and responses for this tag
    const { error: deleteInputsError } = await supabase
      .from('inputs')
      .delete()
      .eq('tag_id', tag.id);

    if (deleteInputsError) throw deleteInputsError;

    const { error: deleteResponsesError } = await supabase
      .from('responses')
      .delete()
      .eq('tag_id', tag.id);

    if (deleteResponsesError) throw deleteResponsesError;

    // Insert new inputs
    const inputRecords = payload.input.map(text => ({
      tag_id: tag.id,
      input_text: text
    }));

    const { error: inputsError } = await supabase
      .from('inputs')
      .insert(inputRecords);

    if (inputsError) throw inputsError;

    // Insert new responses
    const responseRecords = payload.responses.map(text => ({
      tag_id: tag.id,
      response_text: text
    }));

    const { error: responsesError } = await supabase
      .from('responses')
      .insert(responseRecords);

    if (responsesError) throw responsesError;

    return successResponse(
      h,
      { tag: tag.tag_name },
      201,
      'Chatbot tag created/updated successfully'
    );
  } catch (err) {
    console.error('Error in createOrUpdateChatbotTag:', err);
    return errorResponse(h, 'Internal server error', 500);
  }
};

// Get all chatbot tags with their inputs and responses
export const getAllChatbotTags = async (req: Request, h: ResponseToolkit) => {
  try {

    // Get all tags
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('*')
      .order('created_at', { ascending: true });

    if (tagsError) throw tagsError;

    // For each tag, get inputs and responses
    const result = await Promise.all(
      tags.map(async tag => {
        const { data: inputs } = await supabase
          .from('inputs')
          .select('input_text')
          .eq('tag_id', tag.id);

        const { data: responses } = await supabase
          .from('responses')
          .select('response_text')
          .eq('tag_id', tag.id);

        return {
          tag: tag.tag_name,
          input: inputs?.map(i => i.input_text) || [],
          responses: responses?.map(r => r.response_text) || []
        };
      })
    );

    return successResponse(h, result, 200, 'Chatbot data retrieved');
  } catch (err) {
    console.error('Error in getAllChatbotTags:', err);
    return errorResponse(h, 'Internal server error', 500);
  }
};

// Get a specific chatbot tag by name
export const getChatbotTag = async (req: Request, h: ResponseToolkit) => {
  try {
    const tagName = req.params.tag;
    if (!tagName) {
      return errorResponse(h, 'Tag name is required', 400);
    }

    // Get the tag
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('*')
      .eq('tag_name', tagName)
      .single();

    if (tagError || !tag) {
      return errorResponse(h, 'Tag not found', 404);
    }

    // Get inputs and responses
    const { data: inputs } = await supabase
      .from('inputs')
      .select('input_text')
      .eq('tag_id', tag.id);

    const { data: responses } = await supabase
      .from('responses')
      .select('response_text')
      .eq('tag_id', tag.id);

    const result = {
      tag: tag.tag_name,
      input: inputs?.map(i => i.input_text) || [],
      responses: responses?.map(r => r.response_text) || []
    };

    return successResponse(h, result, 200, 'Chatbot tag retrieved');
  } catch (err) {
    console.error('Error in getChatbotTag:', err);
    return errorResponse(h, 'Internal server error', 500);
  }
};

// Delete a chatbot tag
export const deleteChatbotTag = async (req: Request, h: ResponseToolkit) => {
  try {
    const tagName = req.params.tag;

    // Get the tag first to get its ID
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('tag_name', tagName)
      .single();

    if (tagError || !tag) {
      return errorResponse(h, 'Tag not found', 404);
    }

    // Delete the tag (cascade will delete inputs and responses)
    const { error: deleteError } = await supabase
      .from('tags')
      .delete()
      .eq('id', tag.id);

    if (deleteError) throw deleteError;

    return successResponse(h, null, 200, 'Chatbot tag deleted successfully');
  } catch (err) {
    console.error('Error in deleteChatbotTag:', err);
    return errorResponse(h, 'Internal server error', 500);
  }
};

// Process user input and find matching response
export const processChatbotInput = async (req: Request, h: ResponseToolkit) => {
  try {
    const userInput = (req.payload as { input: string }).input;

    if (!userInput || typeof userInput !== 'string') {
      return errorResponse(h, 'Input is required', 400);
    }

    // Search for matching input (case insensitive)
    const { data: matchedInput, error: inputError } = await supabase
      .from('inputs')
      .select('tag_id')
      .ilike('input_text', `%${userInput}%`);

    if (inputError) throw inputError;

    if (!matchedInput || matchedInput.length === 0) {
      return successResponse(
        h,
        { response: "Maaf, saya tidak mengerti pertanyaan Anda." },
        200,
        'No matching tag found'
      );
    }

    // Get random response from the first matched tag
    const tagId = matchedInput[0].tag_id;

    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('response_text')
      .eq('tag_id', tagId);

    if (responsesError) throw responsesError;

    if (!responses || responses.length === 0) {
      return successResponse(
        h,
        { response: "Maaf, saya tidak memiliki jawaban untuk pertanyaan ini." },
        200,
        'No responses found for tag'
      );
    }

    // Select random response
    const randomResponse = responses[Math.floor(Math.random() * responses.length)].response_text;

    return successResponse(
      h,
      { response: randomResponse },
      200,
      'Response found'
    );
  } catch (err) {
    console.error('Error in processChatbotInput:', err);
    return errorResponse(h, 'Internal server error', 500);
  }
};
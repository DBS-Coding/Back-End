import { Request, ResponseToolkit } from '@hapi/hapi';
import { supabase, supabaseAnonKey } from '../config/supabaseClient';
import { successResponse, errorResponse } from '../utils/responseUtils';
import Joi from 'joi';

// Interface for chatbot data
interface ChatbotData {
  nama: string;
  tag: string;
  input: string[];
  responses: string[];
}

// Validation schema
const chatbotSchema = Joi.object({
  nama: Joi.string().allow(null, '').optional(),
  tag: Joi.string().required(),
  input: Joi.array().items(Joi.string()).min(1).required(),
  responses: Joi.array().items(Joi.string()).min(1).required(),
});

// Create or update a chatbot tag with its inputs and responses
export const createOrUpdateChatbotTag = async (
  req: Request,
  h: ResponseToolkit,
) => {
  try {
    const payload = req.payload as ChatbotData;

    // Cari tag yang cocok berdasarkan tag_name dan nama
    const { data: existingTag, error: findError } = await supabase
      .from('tags')
      .select('*')
      .eq('tag_name', payload.tag)
      .eq('nama', payload.nama)
      .single();
    // return successResponse(h, existingTag, 200, 'Tag found');

    if (findError && findError.code !== 'PGRST116') throw findError;

    let tagId: number;

    if (!existingTag) {
      // Insert tag baru jika belum ada
      const { data: newTag, error: insertError } = await supabase
        .from('tags')
        .insert({ tag_name: payload.tag, nama: payload.nama })
        .select()
        .single();

      if (insertError) throw insertError;
      tagId = newTag.id;
    } else {
      tagId = existingTag.id;
    }

    // Ambil data input & response lama
    const { data: oldInputs = [] } = await supabase
      .from('inputs')
      .select('input_text')
      .eq('tag_id', tagId);

    const { data: oldResponses = [] } = await supabase
      .from('responses')
      .select('response_text')
      .eq('tag_id', tagId);

    // Filter input/response baru yang belum ada
    const newInputs = payload.input
      .filter((i) => !oldInputs.some((old) => old.input_text === i))
      .map((i) => ({
        tag_id: tagId,
        input_text: i,
      }));

    const newResponses = payload.responses
      .filter((r) => !oldResponses.some((old) => old.response_text === r))
      .map((r) => ({
        tag_id: tagId,
        response_text: r,
      }));

    if (newInputs.length > 0) {
      const { error: inputInsertError } = await supabase
        .from('inputs')
        .insert(newInputs);
      if (inputInsertError) throw inputInsertError;
    }

    if (newResponses.length > 0) {
      const { error: responseInsertError } = await supabase
        .from('responses')
        .insert(newResponses);
      if (responseInsertError) throw responseInsertError;
    }

    return successResponse(
      h,
      {
        tag: payload.tag,
        nama: payload.nama,
        added_inputs: newInputs.length,
        added_responses: newResponses.length,
      },
      201,
      existingTag ? 'Tag diperbarui (data ditambahkan)' : 'Tag baru dibuat',
    );
  } catch (err) {
    console.error('Error in createOrUpdateChatbotTag:', err);
    return errorResponse(h, 'Internal server error', 500);
  }
};

// Get all chatbot tags with their inputs and responses
export const getAllChatbotTags = async (req: Request, h: ResponseToolkit) => {
  try {
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('*')
      .order('created_at', { ascending: true });

    if (tagsError) throw tagsError;

    const result = await Promise.all(
      tags.map(async (tag) => {
        const { data: inputs } = await supabase
          .from('inputs')
          .select('input_text')
          .eq('tag_id', tag.id);

        const { data: responses } = await supabase
          .from('responses')
          .select('response_text')
          .eq('tag_id', tag.id);

        return {
          id: tag.id,
          tag: tag.tag_name,
          nama: tag.nama,
          input: inputs?.map((i) => i.input_text) || [],
          responses: responses?.map((r) => r.response_text) || [],
        };
      }),
    );

    return successResponse(h, result, 200, 'Chatbot data retrieved');
  } catch (err) {
    console.error('Error in getAllChatbotTags:', err);
    return errorResponse(h, 'Internal server error', 500);
  }
};

// Get a specific chatbot tag by id
export const getChatbotTag = async (req: Request, h: ResponseToolkit) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return errorResponse(h, 'Tag id is required', 400);
    }

    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single();

    if (tagError || !tag) {
      return errorResponse(h, 'Tag not found', 404);
    }

    const { data: inputs } = await supabase
      .from('inputs')
      .select('input_text')
      .eq('tag_id', tag.id);

    const { data: responses } = await supabase
      .from('responses')
      .select('response_text')
      .eq('tag_id', tag.id);

    const result = {
      id: tag.id,
      tag: tag.tag_name,
      nama: tag.nama,
      input: inputs?.map((i) => i.input_text) || [],
      responses: responses?.map((r) => r.response_text) || [],
    };

    return successResponse(h, result, 200, 'Chatbot tag retrieved');
  } catch (err) {
    console.error('Error in getChatbotTag:', err);
    return errorResponse(h, 'Internal server error', 500);
  }
};

// get a list all  chatbot by nama
export const getChatbotByNama = async (req: Request, h: ResponseToolkit) => {
  try {
    const nama = req.params.nama;
    if (!nama) {
      return errorResponse(h, 'Nama is required', 400);
    }

    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('*')
      .ilike('nama', `%${nama}%`);

    if (tagsError) throw tagsError;

    if (!tags || tags.length === 0) {
      return successResponse(
        h,
        [],
        200,
        'No chatbot found with the given name',
      );
    }

    const result = await Promise.all(
      tags.map(async (tag) => {
        const { data: inputs } = await supabase
          .from('inputs')
          .select('input_text')
          .eq('tag_id', tag.id);

        const { data: responses } = await supabase
          .from('responses')
          .select('response_text')
          .eq('tag_id', tag.id);

        return {
          id: tag.id,
          tag: tag.tag_name,
          nama: tag.nama,
          input: inputs?.map((i) => i.input_text) || [],
          responses: responses?.map((r) => r.response_text) || [],
        };
      }),
    );
    return successResponse(h, result, 200, 'Chatbots retrieved by name');
  } catch (err) {
    console.error('Error in getChatbotByNama:', err);
    return errorResponse(h, 'Internal server error', 500);
  }
};

// Delete a chatbot tag
export const deleteChatbotTag = async (req: Request, h: ResponseToolkit) => {
  try {
    const id = parseInt(req.params.id);

    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('id', id)
      .single();

    if (tagError || !tag) {
      return errorResponse(h, 'Tag not found', 404);
    }

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

    const { data: matchedInput, error: inputError } = await supabase
      .from('inputs')
      .select('tag_id')
      .ilike('input_text', `%${userInput}%`);

    if (inputError) throw inputError;

    if (!matchedInput || matchedInput.length === 0) {
      return successResponse(
        h,
        { response: 'Maaf, saya tidak mengerti pertanyaan Anda.' },
        200,
        'No matching tag found',
      );
    }

    const tagId = matchedInput[0].tag_id;

    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('response_text')
      .eq('tag_id', tagId);

    if (responsesError) throw responsesError;

    if (!responses || responses.length === 0) {
      return successResponse(
        h,
        { response: 'Maaf, saya tidak memiliki jawaban untuk pertanyaan ini.' },
        200,
        'No responses found for tag',
      );
    }

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)].response_text;

    return successResponse(
      h,
      { response: randomResponse },
      200,
      'Response found',
    );
  } catch (err) {
    console.error('Error in processChatbotInput:', err);
    return errorResponse(h, 'Internal server error', 500);
  }
};

// create chat bot
export const createChatbotTag = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req.payload as ChatbotData;

    const { error: validationError } = chatbotSchema.validate(payload);
    if (validationError) {
      return errorResponse(h, validationError.details[0].message, 400);
    }

    // Check if tag already exists
    const { data: existingTag, error: fetchError } = await supabase
      .from('tags')
      .select()
      .eq('tag_name', payload.tag)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    if (existingTag) {
      return errorResponse(
        h,
        'Tag already exists. Use update endpoint instead.',
        409,
      );
    }

    // Insert new tag
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .insert({ tag_name: payload.tag, nama: payload.nama || null })
      .select()
      .single();

    if (tagError) throw tagError;

    // Insert inputs
    const inputRecords = payload.input.map((text) => ({
      tag_id: tag.id,
      input_text: text,
    }));
    const { error: inputsError } = await supabase
      .from('inputs')
      .insert(inputRecords);
    if (inputsError) throw inputsError;

    // Insert responses
    const responseRecords = payload.responses.map((text) => ({
      tag_id: tag.id,
      response_text: text,
    }));
    const { error: responsesError } = await supabase
      .from('responses')
      .insert(responseRecords);
    if (responsesError) throw responsesError;

    return successResponse(
      h,
      { tag: tag.tag_name, nama: tag.nama },
      201,
      'Chatbot tag created successfully',
    );
  } catch (err) {
    console.error('Error in createChatbotTag:', err);
    return errorResponse(h, 'Internal server error', 500);
  }
};

// Update an chat bot
export const updateChatbotTag = async (req: Request, h: ResponseToolkit) => {
  try {
    const id = parseInt(req.params.id);
    const payload = req.payload as ChatbotData;

    const { error: validationError } = chatbotSchema.validate(payload);
    if (validationError) {
      return errorResponse(h, validationError.details[0].message, 400);
    }

    // Cek apakah tag dengan ID tersebut ada
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single();

    // return successResponse(h, tag, 200, 'Tag found');

    if (tagError || !tag) {
      return errorResponse(h, 'Tag not found', 404);
    }

    // Update tag
    const { error: updateError } = await supabase
      .from('tags')
      .update({ tag_name: payload.tag, nama: payload.nama || null })
      .eq('id', id);

    if (updateError) throw updateError;

    // Hapus input dan response lama
    await supabase.from('inputs').delete().eq('tag_id', id);
    await supabase.from('responses').delete().eq('tag_id', id);

    // Insert input baru
    const inputRecords = payload.input.map((text) => ({
      tag_id: id,
      input_text: text,
    }));
    const { error: inputsError } = await supabase
      .from('inputs')
      .insert(inputRecords);
    if (inputsError) throw inputsError;

    // Insert response baru
    const responseRecords = payload.responses.map((text) => ({
      tag_id: id,
      response_text: text,
    }));
    const { error: responsesError } = await supabase
      .from('responses')
      .insert(responseRecords);
    if (responsesError) throw responsesError;

    return successResponse(
      h,
      { tag: payload.tag, nama: payload.nama },
      200,
      'Chatbot tag updated successfully by ID',
    );
  } catch (err) {
    return errorResponse(h, `Internal server error ${err.message}`, 500);
  }
};

export const deleteChatbotAll = async (req: Request, h: ResponseToolkit) => {
  try {
    if (req.params.db_key !== supabaseAnonKey)
      return errorResponse(h, 'Unauthorized', 401);
    const { data: tags, error: tagsFetchError } = await supabase
      .from('tags')
      .select('id');
    // return successResponse(h, tags, 200, 'tags');
    tags.forEach(async (tag) => {
      await supabase.from('inputs').delete().eq('tag_id', tag.id);
      await supabase.from('responses').delete().eq('tag_id', tag.id);
      await supabase.from('tags').delete().eq('id', tag.id);
    });

    return successResponse(
      h,
      null,
      200,
      'All chatbot data deleted successfully',
    );
  } catch (err) {
    console.error('Error in deleteChatbotAll:', err);
    return errorResponse(h, `Internal server error ${err.message}`, 500);
  }
};

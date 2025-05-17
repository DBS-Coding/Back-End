import { Request, ResponseToolkit } from '@hapi/hapi';
import { supabase } from '../config/supabaseClient';
import { successResponse, errorResponse } from '../utils/responseUtils';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import bcrypt from 'bcrypt';

// Constants
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-secret';
const JWT_EXPIRES_IN = '24h';

// Interfaces
interface UserPayload {
  id: string;
  email: string;
  name: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

// Validation Schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Helper Functions
const generateToken = (user: UserPayload): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const getUserResponse = (user: any) => ({
  id: user.id,
  email: user.email,
  name: user.name,
});

// Controller Functions
export const registerUser = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req.payload as RegisterPayload;

    // Validate input
    const { error: validationError } = registerSchema.validate(payload);
    if (validationError) {
      return errorResponse(h, validationError.details[0].message, 400);
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', payload.email)
      .single();

    if (existingUser) {
      return errorResponse(h, 'User already exists', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);

    // Create new user
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert([{
        email: payload.email,
        password_hash: passwordHash,
        name: payload.name,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      return errorResponse(h, 'Failed to create user', 500);
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return successResponse(
      h,
      {
        user: getUserResponse(user),
        token,
      },
      201,
      'User registered successfully',
    );
  } catch (err) {
    console.error('Error in user registration:', err);
    return errorResponse(h, 'Internal server error', 500);
  }
};

export const loginUser = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req.payload as LoginPayload;

    // Validate input
    const { error: validationError } = loginSchema.validate(payload);
    if (validationError) {
      return errorResponse(h, validationError.details[0].message, 400);
    }

    // Find user
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', payload.email)
      .single();

    if (!user || findError) {
      return errorResponse(h, 'Invalid email or password', 401);
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(payload.password, user.password_hash);
    if (!passwordMatch) {
      return errorResponse(h, 'Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return successResponse(
      h,
      {
        user: getUserResponse(user),
        token,
      },
      200,
      'Login successful',
    );
  } catch (err) {
    console.error('Error in user login:', err);
    return errorResponse(h, 'Internal server error', 500);
  }
};

export const getCurrentUser = async (req: Request, h: ResponseToolkit) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return errorResponse(h, 'Authorization token required', 401);
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

    // Get user data
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .eq('id', decoded.id)
      .single();

    if (!user || error) {
      return errorResponse(h, 'User not found', 404);
    }

    return successResponse(h, getUserResponse(user), 200, 'User data retrieved');
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    if (err instanceof jwt.JsonWebTokenError) {
      return errorResponse(h, 'Invalid or expired token', 401);
    }
    return errorResponse(h, 'Internal server error', 500);
  }
};

export const deleteUser = async (req: Request, h: ResponseToolkit) => {
  try {

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return errorResponse(h, 'Authorization token required', 401);
    }


    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

     const { data: user } = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .eq('id', decoded.id)
      .single();

    if (!user) {
      return errorResponse(h, 'User not found', 404);
    }
    
    // Delete user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', decoded.id);
    
    if (error) {
      return errorResponse(h, 'Failed to delete user', 500);
    }
  

    return successResponse(h, 'successful', 200, 'User deleted successfully');
  } catch (err) {
    console.error('Error in deleteUser:', err);
    if (err instanceof jwt.JsonWebTokenError) {
      return errorResponse(h, 'Invalid or expired token', 401);
    }
    return errorResponse(h, 'Internal server error', 500);
  }
};
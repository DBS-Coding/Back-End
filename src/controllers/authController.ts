import { Request, ResponseToolkit } from '@hapi/hapi';
import { supabase } from '../config/supabaseClient';
import { successResponse, errorResponse } from '../utils/responseUtils';

export const AuthWithGoogle = async (req: Request, h: ResponseToolkit) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    console.error('Error signing in with Google:', error.message);
    return errorResponse(h, 'Failed to sign in with Google', 500);
  }

  return successResponse(
    h,
    { url: data?.url },
    200,
    'Google login URL generated',
  );
};

export const getUser = async (req: Request, h: ResponseToolkit) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return errorResponse(h, 'Missing access token', 401);
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.error('Error fetching user:', error?.message);
    return errorResponse(h, 'Failed to get user info', 401);
  }

  return successResponse(h, user, 200, 'User info retrieved');
};

export const forgotPassword = async (req: Request, h: ResponseToolkit) => {
  const { email } = req.payload as { email: string };

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/reset-password',
  });

  if (error) {
    console.error('Error sending reset password email:', error.message);
    return errorResponse(h, 'Failed to send password reset email', 500);
  }

  return successResponse(h, data, 200, 'Password reset email sent');
};

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from './db';
import User from '@/models/User';

const getJwtSecret = () =>
  process.env.JWT_SECRET || 'super_secret_jwt_key_jobportal_2026_xyz';

export function generateToken(id: string): string {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: '30d',
  });
}

export async function getOptionalUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return null;
  }

  try {
    await connectDB();
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret()) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export async function requireAuth(
  request: NextRequest,
  allowedRoles?: string[]
): Promise<{ user: any; error?: never } | { user?: never; error: NextResponse }> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Not authorized, no token provided' },
        { status: 401 }
      ),
    };
  }

  try {
    await connectDB();
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret()) as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return {
        error: NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 401 }
        ),
      };
    }

    if (!user.isActive) {
      return {
        error: NextResponse.json(
          { success: false, message: 'Account is deactivated' },
          { status: 403 }
        ),
      };
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return {
        error: NextResponse.json(
          {
            success: false,
            message: `User role '${user.role}' is not authorized to access this route`,
          },
          { status: 403 }
        ),
      };
    }

    return { user };
  } catch {
    return {
      error: NextResponse.json(
        { success: false, message: 'Not authorized, invalid token' },
        { status: 401 }
      ),
    };
  }
}

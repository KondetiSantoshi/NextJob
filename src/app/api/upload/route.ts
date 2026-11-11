import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import UploadedFile from '@/models/UploadedFile';

export const dynamic = 'force-dynamic';

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { success: false, message: 'Please upload a file' },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Only images (.png, .jpg, .webp) and documents (.pdf, .doc, .docx) are allowed',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || MIME_BY_EXT[ext] || 'application/octet-stream';

    const saved = await UploadedFile.create({
      originalName: file.name,
      mimeType,
      size: file.size,
      data: buffer,
      uploadedBy: auth.user._id,
    });

    const fileUrl = `/api/uploads/${saved._id}`;
    return NextResponse.json(
      {
        success: true,
        fileUrl,
        filename: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        message: 'File uploaded successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

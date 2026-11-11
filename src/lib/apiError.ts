import { NextResponse } from 'next/server';

export function handleApiError(err: any): NextResponse {
  console.error(err);

  if (err?.name === 'CastError') {
    return NextResponse.json(
      { success: false, message: 'Resource not found' },
      { status: 404 }
    );
  }

  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Item'} already exists`;
    return NextResponse.json({ success: false, message }, { status: 400 });
  }

  if (err?.name === 'ValidationError' && err.errors) {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
    return NextResponse.json({ success: false, message }, { status: 400 });
  }

  return NextResponse.json(
    {
      success: false,
      message: err?.message || 'Server Internal Error',
    },
    { status: err?.statusCode || 500 }
  );
}

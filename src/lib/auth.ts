import { NextRequest, NextResponse } from 'next/server';

export function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const role_id = req.cookies.get('role_id')?.value;

  if (!token || !role_id) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const path = req.nextUrl.pathname;

  const roleRedirect: Record<string, string> = {
    '1': '/dashboard/admin',
    '2': '/dashboard/rw',
    '3': '/dashboard/rt',
    '4': '/dashboard/warga',
  };

  const allowedPath = roleRedirect[role_id];
  if (!path.startsWith(allowedPath)) {
    return NextResponse.redirect(new URL(allowedPath, req.url));
  }

  return NextResponse.next();
}

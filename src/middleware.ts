import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname === '/login') {
    const token = req.cookies.get('token')?.value;
    const role_id = Number(req.cookies.get('role_id')?.value);

    if (token && role_id) {
      let destination = '/warga'; // default
      if (role_id === 1) destination = '/admin';
      else if (role_id === 2) destination = '/rw';
      else if (role_id === 3) destination = '/rt';
      else if (role_id === 4) destination = '/warga';

      return NextResponse.redirect(new URL(destination, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
};
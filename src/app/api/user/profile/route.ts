import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const role_id = Number(cookieStore.get('role_id')?.value);
    const nik = cookieStore.get('nik')?.value;

    if (!nik || !role_id) {
      return NextResponse.json({ error: 'User belum login' }, { status: 401 });
    }

    // Mapping role_id ke nama role
    const roleMap: Record<number, string> = {
      1: 'admin',
      2: 'rw',
      3: 'rt',
      4: 'warga',
    };

    return NextResponse.json({
      nik,
      role: roleMap[role_id] ?? 'unknown',
    });
  } catch (error) {
    console.error('Error ambil profil user:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

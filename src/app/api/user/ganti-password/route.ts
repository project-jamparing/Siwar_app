// app/api/user/ganti-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function PATCH(req: NextRequest) {
  try {
    const { password_lama, password_baru } = await req.json();

    if (!password_lama || !password_baru) {
      return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const nik = cookieStore.get('nik')?.value;

    if (!nik) {
      return NextResponse.json({ message: 'User tidak terautentikasi' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { nik },
    });

    if (!user || !user.password) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
    }

    const valid = await bcrypt.compare(password_lama, user.password);
    if (!valid) {
      return NextResponse.json({ message: 'Password lama salah' }, { status: 401 });
    }

    const hashedBaru = await bcrypt.hash(password_baru, 10);

    await prisma.user.update({
      where: { nik },
      data: { password: hashedBaru },
    });

    return NextResponse.json({ message: 'Password berhasil diubah' });
  } catch (error: any) {
    console.error('Gagal ganti password:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan', error: error.message }, { status: 500 });
  }
}
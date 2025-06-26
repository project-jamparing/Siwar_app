import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { nik, password } = await req.json();

    const user = await prisma.user.findFirst({
      where: { nik },
      include: {
        role: true,
        warga: {
          include: {
            kk: true, 
          },
        },
      },
    });

    if (!user || !user.password || !user.role_id) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }
    

    const roleRedirect: Record<number, string> = {
      1: 'dashboard/admin',
      2: 'dashboard/rw',
      3: 'dashboard/rt',
      4: 'dashboard/warga',
    };

    const res = NextResponse.json({
      message: 'Login berhasil',
      redirect: roleRedirect[user.role_id],
      role_id: user.role_id,
      rt_id: user?.warga?.kk?.rt_id ?? null,
    });

    res.cookies.set('token', 'dummy-token', { httpOnly: true });
    res.cookies.set('role_id', String(user.role_id), { httpOnly: true });
    res.cookies.set('nik', String(user.nik), { httpOnly: true });
    
    return res;    
  } catch (error) {
    console.error('🔥 Login Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { nik, nama } = await request.json();

    if (!nik || !nama) {
      return NextResponse.json({ message: 'nik dan nama harus diisi' }, { status: 400 });
    }

    // Cek user sudah ada atau belum
    const existingUser = await prisma.user.findUnique({ where: { nik } });
    if (existingUser) {
      return NextResponse.json({ message: 'User sudah terdaftar' }, { status: 409 });
    }

    // Hash password default '123456'
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Insert user baru
    const user = await prisma.user.create({
      data: {
        nik,
        password: hashedPassword,
        role_id: 4, // default warga
      },
    });

    return NextResponse.json({ message: 'User berhasil dibuat', user }, { status: 201 });
  } catch (error) {
    console.error('Error di API user/tambah-dari-nik:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

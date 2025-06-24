// app/api/kk/[no_kk]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { no_kk: string } }) {
  const { no_kk } = params;

  try {
    const warga = await prisma.warga.findMany({
      where: { no_kk },
      select: {
        nik: true,
        nama: true,
        status_hubungan_dalam_keluarga: true,
      },
      orderBy: {
        status_hubungan_dalam_keluarga: 'asc',
      },
    });

    return NextResponse.json(warga);
  } catch (error) {
    console.error('Error fetch KK:', error);
    return NextResponse.json({ message: 'Error ambil data KK' }, { status: 500 });
  }
}